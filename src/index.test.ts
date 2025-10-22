import { expect, it } from "vitest";

import { Duration } from "./index.js";

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

it("converts duration to seconds", () => {
  // ARRANGE
  const subject = Duration;

  // ACT
  const duration = subject.seconds(5);

  // ASSERT
  expect(duration.toSeconds()).toBe(5);
});

it("converts duration into milliseconds", () => {
  // ARRANGE
  const subject = Duration;

  // ACT
  const duration = subject.seconds(5);

  // ASSERT
  expect(duration.toMilliseconds()).toBe(5000);
});

it("converts duration into minutes", () => {
  // ARRANGE
  const subject = Duration;

  // ACT
  const duration = subject.seconds(5);

  // ASSERT
  expect(duration.toMinutes()).toBe(0.083_333_333_333_333_33);
});
