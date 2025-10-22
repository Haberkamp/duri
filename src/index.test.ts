import { expect, it } from "vitest";

import { Duration } from "./index.js";

it("creates a duration from 5 seconds via method", () => {
  // ARRANGE
  const subject = Duration;

  // ACT
  const duration = subject.seconds(5);

  // ASSERT
  expect(duration.toSeconds()).toBe(5);
});
