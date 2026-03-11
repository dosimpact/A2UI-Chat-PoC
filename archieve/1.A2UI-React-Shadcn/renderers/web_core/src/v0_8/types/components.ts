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

import { StringValue } from "./primitives";

export interface Action {
  /**
   * A unique name identifying the action (e.g., 'submitForm').
   */
  name: string;
  /**
   * A key-value map of data bindings to be resolved when the action is triggered.
   */
  context?: {
    key: string;
    /**
     * The dynamic value. Define EXACTLY ONE of the nested properties.
     */
    value: {
      /**
       * A data binding reference to a location in the data model (e.g., '/user/name').
       */
      path?: string;
      /**
       * A fixed, hardcoded string value.
       */
      literalString?: string;
      literalNumber?: number;
      literalBoolean?: boolean;
    };
  }[];
}

export interface Text {
  text: StringValue;
  usageHint: "h1" | "h2" | "h3" | "h4" | "h5" | "caption" | "body";
}

export interface Image {
  url: StringValue;
  usageHint:
    | "icon"
    | "avatar"
    | "smallFeature"
    | "mediumFeature"
    | "largeFeature"
    | "header";
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export interface Icon {
  name: StringValue;
}

export interface Video {
  url: StringValue;
}

export interface AudioPlayer {
  url: StringValue;
  /**
   * A label, title, or placeholder text.
   */
  description?: StringValue;
}

export interface Tabs {
  /**
   * A list of tabs, each with a title and a child component ID.
   */
  tabItems: {
    /**
     * The title of the tab.
     */
    title: {
      /**
       * A data binding reference to a location in the data model (e.g., '/user/name').
       */
      path?: string;
      /**
       * A fixed, hardcoded string value.
       */
      literalString?: string;
    };
    /**
     * A reference to a component instance by its unique ID.
     */
    child: string;
  }[];
}

export interface Divider {
  /**
   * The orientation.
   */
  axis?: "horizontal" | "vertical";
  /**
   * The color of the divider (e.g., hex code or semantic name).
   */
  color?: string;
  /**
   * The thickness of the divider.
   */
  thickness?: number;
}

export interface Modal {
  /**
   * The ID of the component (e.g., a button) that triggers the modal.
   */
  entryPointChild: string;
  /**
   * The ID of the component to display as the modal's content.
   */
  contentChild: string;
}

export interface Button {
  /**
   * The ID of the component to display as the button's content.
   */
  child: string;

  /**
   * Represents a user-initiated action.
   */
  action: Action;
}

export interface Checkbox {
  label: StringValue;
  value: {
    /**
     * A data binding reference to a location in the data model (e.g., '/user/name').
     */
    path?: string;
    literalBoolean?: boolean;
  };
}

export interface TextField {
  text?: StringValue;
  /**
   * A label, title, or placeholder text.
   */
  label: StringValue;
  type?: "shortText" | "number" | "date" | "longText";
  /**
   * A regex string to validate the input.
   */
  validationRegexp?: string;
}

export interface DateTimeInput {
  value: StringValue;
  enableDate?: boolean;
  enableTime?: boolean;
  /**
   * The string format for the output (e.g., 'YYYY-MM-DD').
   */
  outputFormat?: string;
}

export interface MultipleChoice {
  selections: {
    /**
     * A data binding reference to a location in the data model (e.g., '/user/name').
     */
    path?: string;
    literalArray?: string[];
  };
  options?: {
    label: {
      /**
       * A data binding reference to a location in the data model (e.g., '/user/name').
       */
      path?: string;
      /**
       * A fixed, hardcoded string value.
       */
      literalString?: string;
    };
    value: string;
  }[];
  maxAllowedSelections?: number;
  type?: "checkbox" | "chips";
  filterable?: boolean;
}

export interface Slider {
  value: {
    /**
     * A data binding reference to a location in the data model (e.g., '/user/name').
     */
    path?: string;
    literalNumber?: number;
  };
  minValue?: number;
  maxValue?: number;
}

export type FallbackStrategy = "hard" | "soft" | "auto-repair";

export interface ComponentFallbackMetadata {
  strategy: FallbackStrategy;
  reason: string;
  suggestedDefaults: string[];
}

export interface ComponentContract<Props extends object = Record<string, unknown>> {
  required: ReadonlyArray<keyof Props & string>;
  optional: readonly string[];
  forbidden: readonly string[];
  fallback: ComponentFallbackMetadata;
}

export type ComponentContractName =
  | "Text"
  | "Image"
  | "Icon"
  | "Video"
  | "AudioPlayer"
  | "Tabs"
  | "Divider"
  | "Modal"
  | "Button"
  | "CheckBox"
  | "TextField"
  | "DateTimeInput"
  | "MultipleChoice"
  | "Slider";

export const COMPONENT_CONTRACTS: Readonly<
  Record<ComponentContractName, ComponentContract>
> = {
  Text: {
    required: ["text"],
    optional: ["usageHint", "weight", "accessibility"],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "auto-repair",
      reason: "Text can be recovered by injecting placeholder copy.",
      suggestedDefaults: ['text: { literalString: "Untitled" }', 'usageHint: "body"'],
    },
  },
  Image: {
    required: ["url"],
    optional: ["fit", "weight", "accessibility"],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "soft",
      reason: "Image can degrade gracefully to a placeholder asset.",
      suggestedDefaults: ['fit: "cover"', 'usageHint: "mediumFeature"'],
    },
  },
  Icon: {
    required: ["name"],
    optional: ["weight", "accessibility"],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "soft",
      reason: "Icon can fallback to a generic symbol.",
      suggestedDefaults: ['name: { literalString: "info" }'],
    },
  },
  Video: {
    required: ["url"],
    optional: ["weight", "accessibility"],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "hard",
      reason: "Video without URL cannot render meaningful content.",
      suggestedDefaults: [],
    },
  },
  AudioPlayer: {
    required: ["url"],
    optional: ["description", "weight", "accessibility"],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "hard",
      reason: "Audio player requires media source.",
      suggestedDefaults: [],
    },
  },
  Tabs: {
    required: ["tabItems"],
    optional: ["weight", "accessibility"],
    forbidden: ["children"],
    fallback: {
      strategy: "auto-repair",
      reason: "Tabs can be reconstructed from minimal tab scaffolding.",
      suggestedDefaults: ['tabItems: [{ title: { literalString: "Tab" }, child: "root" }]'],
    },
  },
  Divider: {
    required: [],
    optional: ["axis", "color", "thickness", "weight", "accessibility"],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "soft",
      reason: "Divider can be omitted with low UX impact.",
      suggestedDefaults: ['axis: "horizontal"'],
    },
  },
  Modal: {
    required: ["entryPointChild", "contentChild"],
    optional: ["weight", "accessibility"],
    forbidden: ["children"],
    fallback: {
      strategy: "hard",
      reason: "Modal requires both entry and content references.",
      suggestedDefaults: [],
    },
  },
  Button: {
    required: ["child", "action"],
    optional: ["weight", "accessibility"],
    forbidden: ["children"],
    fallback: {
      strategy: "auto-repair",
      reason: "Button can fallback with a no-op action and text child.",
      suggestedDefaults: [
        'action: { name: "noop" }',
        'child: "button-label"',
      ],
    },
  },
  CheckBox: {
    required: ["label", "value"],
    optional: ["weight", "accessibility"],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "auto-repair",
      reason: "CheckBox can fallback to false value and synthetic label.",
      suggestedDefaults: [
        'label: { literalString: "Option" }',
        "value: { literalBoolean: false }",
      ],
    },
  },
  TextField: {
    required: ["label"],
    optional: [
      "text",
      "type",
      "validationRegexp",
      "weight",
      "accessibility",
    ],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "auto-repair",
      reason: "Text field can fallback to generated label and short text type.",
      suggestedDefaults: [
        'label: { literalString: "Input" }',
        'type: "shortText"',
      ],
    },
  },
  DateTimeInput: {
    required: ["value"],
    optional: [
      "enableDate",
      "enableTime",
      "outputFormat",
      "weight",
      "accessibility",
    ],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "auto-repair",
      reason: "DateTimeInput can fallback with current timestamp value.",
      suggestedDefaults: [
        'value: { literalString: "1970-01-01T00:00:00.000Z" }',
      ],
    },
  },
  MultipleChoice: {
    required: ["selections"],
    optional: [
      "options",
      "maxAllowedSelections",
      "type",
      "filterable",
      "weight",
      "accessibility",
    ],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "auto-repair",
      reason: "MultipleChoice can fallback to an empty options list.",
      suggestedDefaults: [
        "selections: { literalArray: [] }",
        "options: []",
      ],
    },
  },
  Slider: {
    required: ["value"],
    optional: ["minValue", "maxValue", "weight", "accessibility"],
    forbidden: ["children", "child"],
    fallback: {
      strategy: "auto-repair",
      reason: "Slider can fallback to zero bounded range.",
      suggestedDefaults: [
        "value: { literalNumber: 0 }",
        "minValue: 0",
        "maxValue: 100",
      ],
    },
  },
};

export interface ComponentPropsContractValidation {
  componentName: string;
  missing: string[];
  forbidden: string[];
  unknown: string[];
  fallback: ComponentFallbackMetadata;
}

export function getComponentContract(
  componentName: string
): ComponentContract | null {
  if (componentName in COMPONENT_CONTRACTS) {
    return COMPONENT_CONTRACTS[componentName as ComponentContractName];
  }
  return null;
}

export function validateComponentPropsContract(
  componentName: string,
  props: Record<string, unknown>
): ComponentPropsContractValidation {
  const contract = getComponentContract(componentName);
  if (!contract) {
    return {
      componentName,
      missing: [],
      forbidden: [],
      unknown: Object.keys(props),
      fallback: {
        strategy: "soft",
        reason: "Unknown component type; cannot enforce v0.8 contract.",
        suggestedDefaults: [],
      },
    };
  }

  const missing = contract.required.filter((key) => props[key] === undefined);
  const forbidden = contract.forbidden.filter(
    (key) => props[key] !== undefined
  );

  const allowed = new Set([...contract.required, ...contract.optional]);
  const unknown = Object.keys(props).filter(
    (key) => !allowed.has(key) && !contract.forbidden.includes(key)
  );

  return {
    componentName,
    missing,
    forbidden,
    unknown,
    fallback: contract.fallback,
  };
}
