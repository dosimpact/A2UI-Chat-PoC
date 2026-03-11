import assert from "node:assert";
import { describe, it } from "node:test";
import {
  normalizeUserActionPayload,
  type UserAction,
} from "./client-event.js";

describe("normalizeUserActionPayload", () => {
  it("normalizes legacy sourceComponentId/surfaceId fields", () => {
    const action: UserAction = {
      name: "submit",
      sourceComponentId: "button-1",
      surfaceId: "main-surface",
      timestamp: "2025-02-02T10:00:00.000Z",
      context: { key: "value" },
    };

    const normalized = normalizeUserActionPayload(action);
    assert.strictEqual(normalized.source.componentId, "button-1");
    assert.strictEqual(normalized.surface.id, "main-surface");
    assert.deepStrictEqual(normalized.context, { key: "value" });
  });

  it("passes through the standardized shape", () => {
    const action: UserAction = {
      name: "submit",
      source: { componentId: "button-2", interaction: "click" },
      surface: { id: "settings" },
      timestamp: "2025-02-02T10:00:00.000Z",
    };

    const normalized = normalizeUserActionPayload(action);
    assert.strictEqual(normalized.source.componentId, "button-2");
    assert.strictEqual(normalized.surface.id, "settings");
    assert.strictEqual(normalized.source.interaction, "click");
  });

  it("throws when source or surface cannot be resolved", () => {
    const badAction = {
      name: "submit",
      timestamp: "2025-02-02T10:00:00.000Z",
    } as UserAction;

    assert.throws(
      () => normalizeUserActionPayload(badAction),
      /source\.componentId/,
    );
  });
});
