/*
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

type SupportedMessageType =
  | "beginRendering"
  | "surfaceUpdate"
  | "dataModelUpdate"
  | "deleteSurface";

const SUPPORTED_MESSAGE_TYPES: SupportedMessageType[] = [
  "beginRendering",
  "surfaceUpdate",
  "dataModelUpdate",
  "deleteSurface",
];

export type ValidationFailureCategory = "hard" | "soft" | "auto-repair";

export interface ValidationFailure {
  category: ValidationFailureCategory;
  message: string;
}

export interface FallbackDecision {
  classification: ValidationFailureCategory;
  action: "reject" | "accept" | "accept-with-warnings" | "auto-repaired";
  reason: string;
}

export interface ValidationFallbackResult {
  text: string | null;
  failures: ValidationFailure[];
  decision: FallbackDecision;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function inferBeginRenderingFromMessages(messages: unknown[]): {
  beginRendering: { surfaceId: string; root: string };
} {
  for (const message of messages) {
    if (!isObject(message) || !("surfaceUpdate" in message)) {
      continue;
    }
    const surfaceUpdate = message.surfaceUpdate;
    if (!isObject(surfaceUpdate)) {
      continue;
    }

    const surfaceId =
      typeof surfaceUpdate.surfaceId === "string"
        ? surfaceUpdate.surfaceId
        : "@default";
    const rootCandidate = Array.isArray(surfaceUpdate.components)
      ? surfaceUpdate.components.find(
          (component): component is Record<string, unknown> => {
            return isObject(component) && typeof component.id === "string";
          }
        )
      : null;
    const root =
      rootCandidate && typeof rootCandidate.id === "string"
        ? rootCandidate.id
        : "root";

    return {
      beginRendering: {
        surfaceId,
        root,
      },
    };
  }

  return {
    beginRendering: {
      surfaceId: "@default",
      root: "root",
    },
  };
}

function normalizeEnvelope(
  message: unknown,
  index: number,
  failures: ValidationFailure[]
): Record<string, unknown> | null {
  if (!isObject(message)) {
    failures.push({
      category: "hard",
      message: `Message at index ${index} is not an object.`,
    });
    return null;
  }

  const candidateTypes = SUPPORTED_MESSAGE_TYPES.filter((type) => {
    return message[type] !== undefined;
  });

  if (candidateTypes.length === 0) {
    failures.push({
      category: "hard",
      message: `Message at index ${index} has no supported top-level message type.`,
    });
    return null;
  }

  if (candidateTypes.length === 1) {
    const selectedType = candidateTypes[0];
    return validateEnvelopePayload(
      {
        [selectedType]: message[selectedType],
      },
      selectedType,
      index,
      failures
    );
  }

  const selectedType = candidateTypes[0];
  failures.push({
    category: "auto-repair",
    message: `Message at index ${index} has multiple message types (${candidateTypes.join(", ")}); using '${selectedType}'.`,
  });

  return validateEnvelopePayload(
    {
      [selectedType]: message[selectedType],
    },
    selectedType,
    index,
    failures
  );
}

function validateEnvelopePayload(
  envelope: Record<string, unknown>,
  messageType: SupportedMessageType,
  index: number,
  failures: ValidationFailure[]
): Record<string, unknown> | null {
  const payload = envelope[messageType];
  if (!isObject(payload)) {
    failures.push({
      category: "hard",
      message: `Message at index ${index} has invalid '${messageType}' payload (expected object).`,
    });
    return null;
  }

  if (messageType === "beginRendering") {
    if (
      typeof payload.surfaceId !== "string" ||
      typeof payload.root !== "string"
    ) {
      failures.push({
        category: "hard",
        message:
          `Message at index ${index} has invalid beginRendering payload; ` +
          "expected string surfaceId and root.",
      });
      return null;
    }
  }

  if (messageType === "surfaceUpdate") {
    if (
      typeof payload.surfaceId !== "string" ||
      !Array.isArray(payload.components)
    ) {
      failures.push({
        category: "hard",
        message:
          `Message at index ${index} has invalid surfaceUpdate payload; ` +
          "expected string surfaceId and components array.",
      });
      return null;
    }
  }

  if (messageType === "dataModelUpdate") {
    if (
      typeof payload.surfaceId !== "string" ||
      !Array.isArray(payload.contents)
    ) {
      failures.push({
        category: "hard",
        message:
          `Message at index ${index} has invalid dataModelUpdate payload; ` +
          "expected string surfaceId and contents array.",
      });
      return null;
    }
  }

  if (messageType === "deleteSurface") {
    if (typeof payload.surfaceId !== "string") {
      failures.push({
        category: "hard",
        message:
          `Message at index ${index} has invalid deleteSurface payload; ` +
          "expected string surfaceId.",
      });
      return null;
    }
  }

  return envelope;
}

export function validateAndApplyFallback(rawText: string): ValidationFallbackResult {
  const failures: ValidationFailure[] = [];
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    failures.push({
      category: "hard",
      message: `Model output is not valid JSON: ${error}`,
    });
    return {
      text: null,
      failures,
      decision: {
        classification: "hard",
        action: "reject",
        reason: "Malformed JSON cannot be repaired safely.",
      },
    };
  }

  const wasArray = Array.isArray(parsed);
  const rawMessages: unknown[] = wasArray ? (parsed as unknown[]) : [parsed];
  const normalizedMessages: Record<string, unknown>[] = [];
  rawMessages.forEach((message, index) => {
    const normalized = normalizeEnvelope(message, index, failures);
    if (normalized) {
      normalizedMessages.push(normalized);
    }
  });

  if (normalizedMessages.length === 0) {
    failures.push({
      category: "hard",
      message: "No valid message envelopes remain after normalization.",
    });
    return {
      text: null,
      failures,
      decision: {
        classification: "hard",
        action: "reject",
        reason: "No valid messages available after validation.",
      },
    };
  }

  const hasBeginRendering = normalizedMessages.some(
    (message) => message.beginRendering !== undefined
  );
  if (!hasBeginRendering) {
    failures.push({
      category: "auto-repair",
      message:
        "Missing beginRendering message; injected inferred beginRendering envelope.",
    });
    normalizedMessages.unshift(
      inferBeginRenderingFromMessages(normalizedMessages)
    );
  }

  if (failures.some((failure) => failure.category === "hard")) {
    return {
      text: null,
      failures,
      decision: {
        classification: "hard",
        action: "reject",
        reason: "Hard validation failure category detected.",
      },
    };
  }

  if (failures.some((failure) => failure.category === "auto-repair")) {
    return {
      text: JSON.stringify(normalizedMessages),
      failures,
      decision: {
        classification: "auto-repair",
        action: "auto-repaired",
        reason: "Response repaired via deterministic middleware transformations.",
      },
    };
  }

  if (failures.some((failure) => failure.category === "soft")) {
    return {
      text: JSON.stringify(wasArray ? normalizedMessages : normalizedMessages[0]),
      failures,
      decision: {
        classification: "soft",
        action: "accept-with-warnings",
        reason: "Only soft validation warnings detected.",
      },
    };
  }

  return {
    text: JSON.stringify(wasArray ? normalizedMessages : normalizedMessages[0]),
    failures,
    decision: {
      classification: "soft",
      action: "accept",
      reason: "No validation failures detected.",
    },
  };
}
