import assert from "node:assert";
import { describe, it } from "node:test";
import {
  getComponentContract,
  validateComponentPropsContract,
} from "./components.js";

describe("component contract helpers", () => {
  it("exposes required/optional/forbidden props for known component types", () => {
    const contract = getComponentContract("Button");

    assert.ok(contract);
    assert.deepStrictEqual(contract.required, ["child", "action"]);
    assert.ok(contract.optional.includes("weight"));
    assert.ok(contract.forbidden.includes("children"));
  });

  it("classifies missing and forbidden props", () => {
    const result = validateComponentPropsContract("Button", {
      child: "content-1",
      children: { explicitList: ["a", "b"] },
    });

    assert.deepStrictEqual(result.missing, ["action"]);
    assert.deepStrictEqual(result.forbidden, ["children"]);
  });

  it("returns fallback scaffold metadata", () => {
    const result = validateComponentPropsContract("Text", {});
    assert.strictEqual(result.fallback.strategy, "auto-repair");
    assert.ok(Array.isArray(result.fallback.suggestedDefaults));
  });
});
