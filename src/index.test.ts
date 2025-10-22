import { describe, expect, it } from "vitest";

import { sum } from "./index.js";

describe("sum", () => {
  it("adds", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
