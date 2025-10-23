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

describe("natural language parsing - valid inputs", () => {
  describe("milliseconds", () => {
    it("parses 'ms'", () => {
      expect(Duration("500ms").toMilliseconds()).toBe(500);
    });

    it("parses 'millisecond' singular", () => {
      expect(Duration("1 millisecond").toMilliseconds()).toBe(1);
    });

    it("parses 'milliseconds' plural", () => {
      expect(Duration("250 milliseconds").toMilliseconds()).toBe(250);
    });

    it("handles decimals with ms", () => {
      expect(Duration("1.5ms").toMilliseconds()).toBe(1.5);
    });
  });

  describe("seconds", () => {
    it("parses 's'", () => {
      expect(Duration("5s").toSeconds()).toBe(5);
    });

    it("parses 'sec'", () => {
      expect(Duration("10 sec").toSeconds()).toBe(10);
    });

    it("parses 'second' singular", () => {
      expect(Duration("1 second").toSeconds()).toBe(1);
    });

    it("parses 'seconds' plural", () => {
      expect(Duration("5 seconds").toSeconds()).toBe(5);
    });

    it("handles decimals", () => {
      expect(Duration("2.5 seconds").toSeconds()).toBe(2.5);
    });

    it("handles underscores", () => {
      expect(Duration("1_000 seconds").toSeconds()).toBe(1000);
    });
  });

  describe("minutes", () => {
    it("parses 'm'", () => {
      expect(Duration("2m").toSeconds()).toBe(120);
    });

    it("parses 'min'", () => {
      expect(Duration("5 min").toSeconds()).toBe(300);
    });

    it("parses 'minute' singular", () => {
      expect(Duration("1 minute").toSeconds()).toBe(60);
    });

    it("parses 'minutes' plural", () => {
      expect(Duration("3 minutes").toSeconds()).toBe(180);
    });

    it("handles decimals", () => {
      expect(Duration("1.5 minutes").toSeconds()).toBe(90);
    });
  });

  describe("hours", () => {
    it("parses 'h'", () => {
      expect(Duration("1h").toSeconds()).toBe(3600);
    });

    it("parses 'hr'", () => {
      expect(Duration("2 hr").toSeconds()).toBe(7200);
    });

    it("parses 'hour' singular", () => {
      expect(Duration("1 hour").toSeconds()).toBe(3600);
    });

    it("parses 'hours' plural", () => {
      expect(Duration("3 hours").toSeconds()).toBe(10_800);
    });

    it("handles decimals", () => {
      expect(Duration("0.5 hours").toSeconds()).toBe(1800);
    });
  });

  describe("case insensitivity", () => {
    it("parses uppercase unit", () => {
      expect(Duration("5 SECONDS").toSeconds()).toBe(5);
    });

    it("parses mixed case", () => {
      expect(Duration("10 SeCoNdS").toSeconds()).toBe(10);
    });

    it("parses uppercase compact", () => {
      expect(Duration("5S").toSeconds()).toBe(5);
    });
  });

  describe("whitespace handling", () => {
    it("handles no space (compact)", () => {
      expect(Duration("5s").toSeconds()).toBe(5);
    });

    it("handles single space", () => {
      expect(Duration("5 s").toSeconds()).toBe(5);
    });

    it("handles multiple spaces", () => {
      expect(Duration("5    seconds").toSeconds()).toBe(5);
    });

    it("trims leading spaces", () => {
      expect(Duration("   5 seconds").toSeconds()).toBe(5);
    });

    it("trims trailing spaces", () => {
      expect(Duration("5 seconds   ").toSeconds()).toBe(5);
    });
  });

  describe("zero values", () => {
    it("accepts zero seconds", () => {
      expect(Duration("0 seconds").toSeconds()).toBe(0);
    });

    it("accepts zero milliseconds", () => {
      expect(Duration("0ms").toMilliseconds()).toBe(0);
    });

    it("accepts 0.0", () => {
      expect(Duration("0.0 hours").toHours()).toBe(0);
    });
  });

  describe("decimal precision", () => {
    it("preserves fractional milliseconds", () => {
      expect(Duration("0.001 seconds").toMilliseconds()).toBe(1);
    });

    it("handles leading decimal", () => {
      expect(Duration(".5 seconds").toSeconds()).toBe(0.5);
    });
  });
});

describe("natural language parsing - invalid inputs", () => {
  it("throws on bare number (no unit)", () => {
    expect(() => Duration("5")).toThrow(TypeError);
    expect(() => Duration("5")).toThrow(/unit/i);
  });

  it("throws on negative number", () => {
    expect(() => Duration("-5 seconds")).toThrow(TypeError);
    expect(() => Duration("-5 seconds")).toThrow(/negative/i);
  });

  it("throws on comma separators", () => {
    expect(() => Duration("1,000 seconds")).toThrow(TypeError);
  });

  it("throws on unknown unit", () => {
    expect(() => Duration("5 days")).toThrow(TypeError);
    expect(() => Duration("5 days")).toThrow(/unknown unit/i);
  });

  it("throws on unsupported 'secs' variant", () => {
    expect(() => Duration("5 secs")).toThrow(TypeError);
    expect(() => Duration("5 secs")).toThrow(/unknown unit/i);
  });

  it("throws on unsupported 'mins' variant", () => {
    expect(() => Duration("10 mins")).toThrow(TypeError);
    expect(() => Duration("10 mins")).toThrow(/unknown unit/i);
  });

  it("throws on unsupported 'hrs' variant", () => {
    expect(() => Duration("2 hrs")).toThrow(TypeError);
    expect(() => Duration("2 hrs")).toThrow(/unknown unit/i);
  });

  it("throws on multi-unit string", () => {
    expect(() => Duration("1 hour 30 minutes")).toThrow(TypeError);
  });

  it("throws on 'and' conjunction", () => {
    expect(() => Duration("1 hour and 30 minutes")).toThrow(TypeError);
  });

  it("throws on invalid number", () => {
    expect(() => Duration("abc seconds")).toThrow(TypeError);
  });

  it("throws on scientific notation", () => {
    expect(() => Duration("1e3 ms")).toThrow(TypeError);
  });

  it("throws on empty string", () => {
    expect(() => Duration("")).toThrow(TypeError);
  });

  it("throws on only unit", () => {
    expect(() => Duration("seconds")).toThrow(TypeError);
  });

  it("throws on multiple numbers", () => {
    expect(() => Duration("5 10 seconds")).toThrow(TypeError);
  });
});

describe("natural language parsing - equivalence", () => {
  it("string parsing equals static factory (seconds)", () => {
    expect(Duration("5 seconds").toSeconds()).toBe(
      Duration.seconds(5).toSeconds(),
    );
  });

  it("string parsing equals static factory (milliseconds)", () => {
    expect(Duration("1000 ms").toMilliseconds()).toBe(
      Duration.milliseconds(1000).toMilliseconds(),
    );
  });

  it("string parsing equals static factory (minutes)", () => {
    expect(Duration("10 minutes").toMinutes()).toBe(
      Duration.minutes(10).toMinutes(),
    );
  });

  it("string parsing equals static factory (hours)", () => {
    expect(Duration("2 hours").toHours()).toBe(Duration.hours(2).toHours());
  });

  it("compact form equals full form", () => {
    expect(Duration("5s").toSeconds()).toBe(Duration("5 seconds").toSeconds());
  });
});

describe("natural language parsing - instanceof checks", () => {
  it("string-parsed instance is instanceof Duration", () => {
    expect(Duration("5 seconds")).toBeInstanceOf(Duration);
  });

  it("numeric constructor instance is instanceof Duration", () => {
    expect(new Duration(5)).toBeInstanceOf(Duration);
  });

  it("static factory instance is instanceof Duration", () => {
    expect(Duration.seconds(5)).toBeInstanceOf(Duration);
  });
});

describe("constructor backward compatibility", () => {
  it("numeric constructor still works", () => {
    expect(new Duration(5).toSeconds()).toBe(5);
  });

  it("throws when calling new with string", () => {
    // @ts-expect-error - Testing runtime error when passing string to constructor
    expect(() => new Duration("5 seconds")).toThrow(TypeError);
  });
});
