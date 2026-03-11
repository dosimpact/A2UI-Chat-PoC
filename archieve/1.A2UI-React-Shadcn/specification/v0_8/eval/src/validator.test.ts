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

import assert from "node:assert";
import { describe, it } from "node:test";
import { SchemaMatcher, ValidationResult } from "./schema_matcher";
import { validateSchemaWithClassification } from "./validator";

class AlwaysFailMatcher extends SchemaMatcher {
  validate(): ValidationResult {
    return {
      success: false,
      error: "Matcher failed.",
    };
  }
}

describe("validateSchemaWithClassification", () => {
  it("classifies missing top-level envelope as hard failure", () => {
    const report = validateSchemaWithClassification(
      { notA2Ui: true },
      "schema.json"
    );

    assert.strictEqual(report.failures.length > 0, true);
    assert.strictEqual(report.decision?.classification, "hard");
    assert.strictEqual(report.decision?.action, "reject");
  });

  it("classifies matcher failures as soft failures", () => {
    const report = validateSchemaWithClassification(
      {
        beginRendering: {
          surfaceId: "s1",
          root: "root",
        },
      },
      "schema.json",
      [new AlwaysFailMatcher()]
    );

    assert.strictEqual(report.failures.length, 1);
    assert.strictEqual(report.failures[0].source, "matcher");
    assert.strictEqual(report.failures[0].classification, "soft");
    assert.strictEqual(report.decision?.classification, "soft");
  });
});
