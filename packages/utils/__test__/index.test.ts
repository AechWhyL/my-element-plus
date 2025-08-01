import { describe, it, expect } from "vitest";
import { makeIntaller } from "../index";

describe("packages/utils/index.ts", () => {
  it("should export makeIntaller", () => {
    expect(typeof makeIntaller).toBe("function");
  });
});
