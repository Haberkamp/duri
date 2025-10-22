import { describe, expect, it } from "vitest";

import { Duration } from "./index.js";

describe("create duration from methods", () => {
  it("creates a duration of 1234 milliseconds via method", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.milliseconds(1234);

    // ASSERT
    expect(duration.toSeconds()).toBe(1.234);
  });

  it("creates a duration of 5 seconds via method", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.seconds(5);

    // ASSERT
    expect(duration.toSeconds()).toBe(5);
  });

  it("creates a duration of 1 minute via method", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.minutes(1);

    // ASSERT
    expect(duration.toSeconds()).toBe(60);
  });

  it("creates a duration of 1 hour via method", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.hours(1);

    // ASSERT
    expect(duration.toSeconds()).toBe(3600);
  });
});

describe("convert duration into milliseconds", () => {
  it("converts duration into milliseconds", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.seconds(5);

    // ASSERT
    expect(duration.toMilliseconds()).toBe(5000);
  });
});

describe("convert duration into seconds", () => {
  it("converts duration to seconds", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.seconds(5);

    // ASSERT
    expect(duration.toSeconds()).toBe(5);
  });
});

describe("convert duration into minutes", () => {
  it("converts duration into minutes", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.seconds(5);

    // ASSERT
    expect(duration.toMinutes()).toBe(0.083_333_333_333_333_33);
  });
});

describe("convert duration into hours", () => {
  it("converts duration into hours", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.seconds(3600);

    // ASSERT
    expect(duration.toHours()).toBe(1);
  });
});
