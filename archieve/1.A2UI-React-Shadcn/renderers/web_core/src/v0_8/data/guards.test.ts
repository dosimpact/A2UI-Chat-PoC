import assert from "node:assert";
import { describe, it } from "node:test";
import { assessV08Lock } from "./guards.js";

describe("assessV08Lock", () => {
  it("allows v0.8 protocol payloads", () => {
    const result = assessV08Lock({ protocolVersion: "0.8" });
    assert.strictEqual(result.supported, true);
    assert.strictEqual(result.shouldReject, false);
    assert.deepStrictEqual(result.issues, []);
  });

  it("rejects v0.9 by default", () => {
    const result = assessV08Lock({ protocolVersion: "0.9" });
    assert.strictEqual(result.supported, false);
    assert.strictEqual(result.shouldReject, true);
    assert.strictEqual(result.issues.length, 1);
    assert.strictEqual(result.issues[0]?.version, "0.9");
  });

  it("flags but does not reject when mode is flag", () => {
    const result = assessV08Lock(
      {
        protocolVersion: "0.10",
        catalogUri: "https://example.dev/spec/v0_10/catalog.json",
      },
      "flag",
    );
    assert.strictEqual(result.supported, true);
    assert.strictEqual(result.shouldReject, false);
    assert.ok(result.issues.length >= 1);
    assert.ok(result.issues.some((issue) => issue.version === "0.10"));
  });
});
