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
  it("converts duration from milliseconds to milliseconds", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.milliseconds(1234);

    // ASSERT
    expect(duration.toMilliseconds()).toBe(1234);
  });

  it("converts duration from seconds to milliseconds", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.seconds(5);

    // ASSERT
    expect(duration.toMilliseconds()).toBe(5000);
  });

  it("converts duration from minutes to milliseconds", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.minutes(2);

    // ASSERT
    expect(duration.toMilliseconds()).toBe(120_000);
  });

  it("converts duration from hours to milliseconds", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.hours(1);

    // ASSERT
    expect(duration.toMilliseconds()).toBe(3_600_000);
  });
});

describe("convert duration into seconds", () => {
  it("converts duration from milliseconds to seconds", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.milliseconds(1234);

    // ASSERT
    expect(duration.toSeconds()).toBe(1.234);
  });

  it("converts duration from seconds to seconds", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.seconds(5);

    // ASSERT
    expect(duration.toSeconds()).toBe(5);
  });

  it("converts duration from minutes to seconds", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.minutes(2);

    // ASSERT
    expect(duration.toSeconds()).toBe(120);
  });

  it("converts duration from hours to seconds", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.hours(1);

    // ASSERT
    expect(duration.toSeconds()).toBe(3600);
  });
});

describe("convert duration into minutes", () => {
  it("converts duration from milliseconds to minutes", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.milliseconds(120_000);

    // ASSERT
    expect(duration.toMinutes()).toBe(2);
  });

  it("converts duration from seconds to minutes", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.seconds(5);

    // ASSERT
    expect(duration.toMinutes()).toBe(0.083_333_333_333_333_33);
  });

  it("converts duration from minutes to minutes", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.minutes(3);

    // ASSERT
    expect(duration.toMinutes()).toBe(3);
  });

  it("converts duration from hours to minutes", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.hours(1.5);

    // ASSERT
    expect(duration.toMinutes()).toBe(90);
  });
});

describe("convert duration into hours", () => {
  it("converts duration from milliseconds to hours", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.milliseconds(3_600_000);

    // ASSERT
    expect(duration.toHours()).toBe(1);
  });

  it("converts duration from seconds to hours", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.seconds(3600);

    // ASSERT
    expect(duration.toHours()).toBe(1);
  });

  it("converts duration from minutes to hours", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.minutes(90);

    // ASSERT
    expect(duration.toHours()).toBe(1.5);
  });

  it("converts duration from hours to hours", () => {
    // ARRANGE
    const subject = Duration;

    // ACT
    const duration = subject.hours(2.5);

    // ASSERT
    expect(duration.toHours()).toBe(2.5);
  });
});
