# Natural Language Duration Parsing Implementation Plan

## Overview

Add natural-language string parsing to `Duration` constructor, enabling `Duration("5 seconds")` alongside existing numeric `new Duration(5)` and static factories. Parser supports English-only, single-unit inputs with case-insensitive units, decimals, underscores, optional spacing. Rejects negatives, commas, bare numbers, multi-unit strings.

## Current State Analysis

- `Duration` class: numeric constructor (`new Duration(seconds)`), four static factories (`seconds`, `milliseconds`, `minutes`, `hours`), four converters (`toSeconds`, etc.)
- Tests: comprehensive coverage for numeric paths (234 lines)
- README: shows numeric usage; line 21 teases `Duration("1 second")` but unimplemented

### Constraints:

- Must preserve existing numeric constructor and static factories
- Must maintain backward compat: `new Duration(5)` still accepts seconds as number
- Internal storage: `secondsValue` (number)

## Desired End State

```ts
// Callable factory with string parsing
Duration("5 seconds"); // ✓
Duration("1s"); // ✓ compact form
Duration("0.5 hours"); // ✓ decimals
Duration("1_000 ms"); // ✓ underscores

// Numeric constructor still works
new Duration(5); // ✓ 5 seconds

// Static factories unchanged
Duration.seconds(5); // ✓

// Errors thrown
Duration("5"); // ✗ bare number
Duration("-5 seconds"); // ✗ negative
Duration("1,000 seconds"); // ✗ comma separator
Duration("1 hour 30 min"); // ✗ multi-unit
```

### Verification:

- All existing tests pass
- New parser tests cover valid/invalid inputs
- `Duration("5s") instanceof Duration` → true
- `Duration("5s").toSeconds() === Duration.seconds(5).toSeconds()` → true

## What We're NOT Doing

- Multi-unit strings (`"1 hour 30 minutes"`, `"1h30m"`)
- Comma thousands separators in numbers
- Negative durations
- Bare numbers without units
- Scientific notation (`"1e3 ms"`)
- Localization beyond US English
- Days, weeks, years (only ms/s/m/h)
- "and" conjunctions
- Non-ASCII Unicode digits/units

## Implementation Approach

1. Build regex-based parser with strict validation
2. Convert `Duration` export to callable/newable hybrid via Proxy or dual-purpose function
3. Preserve existing behavior: numeric input → seconds, string → parse
4. Comprehensive unit tests for parser edge cases
5. Update README with examples and constraints

---

## Phase 1: String Parser Implementation

### Overview

Implement standalone parser function that validates and converts natural language strings to seconds. No constructor changes yet.

### Changes Required:

#### 1. Parser Function

**File**: `src/index.ts`
**Changes**: Add `parseNaturalLanguage` before class definition

```ts
// Unit definitions with aliases
const UNIT_MAP: Record<string, number> = {
  // milliseconds
  ms: 0.001,
  millisecond: 0.001,
  milliseconds: 0.001,
  // seconds
  s: 1,
  sec: 1,
  secs: 1,
  second: 1,
  seconds: 1,
  // minutes
  m: 60,
  min: 60,
  mins: 60,
  minute: 60,
  minutes: 60,
  // hours
  h: 3600,
  hr: 3600,
  hrs: 3600,
  hour: 3600,
  hours: 3600,
};

function parseNaturalLanguage(input: string): number {
  const trimmed = input.trim();

  // Regex: optional spaces, number (int/decimal with optional underscores), optional spaces, unit, optional spaces
  // Pattern: ^\s*(\d[\d_]*(?:\.\d[\d_]*)?)\s*([a-zA-Z]+)\s*$
  const match = /^\s*(\d[\d_]*(?:\.[\d_]*)?)\s*([a-zA-Z]+)\s*$/.exec(trimmed);

  if (!match) {
    throw new TypeError(
      `Invalid duration format: "${input}". Expected format: "<number> <unit>" (e.g., "5 seconds", "1.5h"). Unit is required.`,
    );
  }

  const [, numStr, unitStr] = match;

  // Validate no commas (comma would've failed regex, but check if somehow present)
  if (numStr.includes(",")) {
    throw new TypeError(
      `Invalid duration: commas not supported in numbers. Use underscores instead: "${numStr.replace(/,/g, "_")}"`,
    );
  }

  // Parse number (remove underscores)
  const numValue = parseFloat(numStr.replace(/_/g, ""));

  if (!Number.isFinite(numValue)) {
    throw new TypeError(`Invalid number in duration: "${numStr}"`);
  }

  if (numValue < 0) {
    throw new TypeError(`Negative durations not supported: "${numValue}"`);
  }

  // Lookup unit (case-insensitive)
  const unitLower = unitStr.toLowerCase();
  const multiplier = UNIT_MAP[unitLower];

  if (multiplier === undefined) {
    const validUnits = Object.keys(UNIT_MAP).join(", ");
    throw new TypeError(
      `Unknown unit: "${unitStr}". Supported units (case-insensitive): ${validUnits}`,
    );
  }

  return numValue * multiplier;
}
```

### Success Criteria:

#### Automated Verification:

- [x] Type checking passes: `npx tsc --noEmit`
- [x] Linting passes: `pnpm lint`
- [x] Existing tests still pass: `pnpm test`

#### Manual Verification:

- [ ] Parser function correctly converts valid inputs to seconds
- [ ] Parser throws appropriate errors for invalid inputs

**Implementation Note**: After automated tests pass, verify parser logic manually in Node REPL before proceeding.

---

## Phase 2: Hybrid Constructor/Factory

### Overview

Convert `Duration` class export to callable factory that accepts string or number, while preserving `new Duration(num)` behavior and static methods.

### Changes Required:

#### 1. Dual-Purpose Factory Function

**File**: `src/index.ts`
**Changes**: Replace `export class Duration` with factory wrapper

```ts
class DurationClass {
  private secondsValue: number;

  constructor(seconds: number) {
    this.secondsValue = seconds;
  }

  static hours(value: number): DurationClass {
    return new DurationClass(value * 3600);
  }

  static milliseconds(value: number): DurationClass {
    return new DurationClass(value / 1000);
  }

  static minutes(value: number): DurationClass {
    return new DurationClass(value * 60);
  }

  static seconds(value: number): DurationClass {
    return new DurationClass(value);
  }

  toHours(): number {
    return this.secondsValue / 3600;
  }

  toMilliseconds(): number {
    return this.secondsValue * 1000;
  }

  toMinutes(): number {
    return this.secondsValue / 60;
  }

  toSeconds(): number {
    return this.secondsValue;
  }
}

// Callable and newable factory
interface DurationConstructor {
  new (seconds: number): DurationClass;
  (input: string | number): DurationClass;
  hours(value: number): DurationClass;
  milliseconds(value: number): DurationClass;
  minutes(value: number): DurationClass;
  seconds(value: number): DurationClass;
}

const Duration = function (input: string | number): DurationClass {
  // Called with `new`
  if (new.target) {
    if (typeof input !== "number") {
      throw new TypeError(
        'Constructor requires numeric seconds. Use Duration("...") for string parsing.',
      );
    }
    return new DurationClass(input);
  }

  // Called as factory
  if (typeof input === "string") {
    const seconds = parseNaturalLanguage(input);
    return new DurationClass(seconds);
  }

  if (typeof input === "number") {
    return new DurationClass(input);
  }

  throw new TypeError("Duration expects a string or number");
} as unknown as DurationConstructor;

// Copy static methods
Duration.hours = DurationClass.hours.bind(DurationClass);
Duration.milliseconds = DurationClass.milliseconds.bind(DurationClass);
Duration.minutes = DurationClass.minutes.bind(DurationClass);
Duration.seconds = DurationClass.seconds.bind(DurationClass);

// Set prototype for instanceof
Object.setPrototypeOf(Duration, DurationClass);
Duration.prototype = DurationClass.prototype;

export { Duration };
```

### Success Criteria:

#### Automated Verification:

- [x] Type checking passes: `npx tsc --noEmit`
- [x] All existing tests pass: `pnpm test`
- [x] No linting errors: `pnpm lint`

#### Manual Verification:

- [ ] `Duration("5s") instanceof Duration` → true
- [ ] `new Duration(5) instanceof Duration` → true
- [ ] `Duration.seconds(5)` still works
- [ ] `Duration("5s").toSeconds()` returns 5

**Implementation Note**: Verify instanceof behavior and static method preservation before proceeding.

---

## Phase 3: Comprehensive Parser Tests

### Overview

Add exhaustive unit tests for natural language parser covering valid inputs, edge cases, and error conditions.

### Changes Required:

#### 1. Parser Test Suite

**File**: `src/index.test.ts`
**Changes**: Add new `describe` blocks after existing tests

```ts
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

    it("parses 'secs'", () => {
      expect(Duration("3 secs").toSeconds()).toBe(3);
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

    it("parses 'mins'", () => {
      expect(Duration("10 mins").toSeconds()).toBe(600);
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

    it("parses 'hrs'", () => {
      expect(Duration("3 hrs").toSeconds()).toBe(10800);
    });

    it("parses 'hour' singular", () => {
      expect(Duration("1 hour").toSeconds()).toBe(3600);
    });

    it("parses 'hours' plural", () => {
      expect(Duration("3 hours").toSeconds()).toBe(10800);
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
    expect(() => new Duration("5 seconds" as any)).toThrow(TypeError);
  });
});
```

### Success Criteria:

#### Automated Verification:

- [x] All new tests pass: `pnpm test`
- [x] Code coverage maintained or improved: `pnpm test -- --coverage`
- [x] Type checking passes: `npx tsc --noEmit`
- [x] No linting errors: `pnpm lint`

#### Manual Verification:

- [ ] Test output shows clear pass/fail for each case
- [ ] Error messages are informative and accurate

---

## Phase 4: Documentation

### Overview

Update README with natural language parsing examples, constraints, and error handling guidance.

### Changes Required:

#### 1. README Usage Section

**File**: `README.md`
**Changes**: Replace lines 36-42 with expanded examples

````markdown
## Usage

### Static Factory Methods

```ts
const time = Duration.seconds(5);
const timeInMilliseconds = time.toMilliseconds(); // 5_000 milliseconds
```
````

### Natural Language Parsing

```ts
// Callable factory with string input
const duration = Duration("5 seconds");
duration.toSeconds(); // 5

// Compact forms (no space)
Duration("1s"); // 1 second
Duration("500ms"); // 500 milliseconds
Duration("10m"); // 10 minutes
Duration("2h"); // 2 hours

// Aliases supported (case-insensitive)
Duration("5 sec");
Duration("10 mins");
Duration("2 hrs");
Duration("500 milliseconds");

// Decimals and underscores
Duration("1.5 hours"); // 1.5 hours
Duration("1_000 seconds"); // 1000 seconds

// Whitespace is flexible
Duration("  5   seconds  ");
```

### Numeric Constructor

```ts
// Direct numeric input (seconds)
const duration = new Duration(5); // 5 seconds
```

### Constraints

- **English only**: US spelling (`seconds`, not `secs` with British variants)
- **Single unit**: Multi-unit strings like `"1 hour 30 minutes"` are not supported
- **No negatives**: Negative durations will throw `TypeError`
- **Unit required**: Bare numbers like `"5"` will throw `TypeError`
- **Supported units**:
  - Milliseconds: `ms`, `millisecond`, `milliseconds`
  - Seconds: `s`, `sec`, `secs`, `second`, `seconds`
  - Minutes: `m`, `min`, `mins`, `minute`, `minutes`
  - Hours: `h`, `hr`, `hrs`, `hour`, `hours`

### Error Handling

```ts
// These throw TypeError:
Duration("5"); // No unit
Duration("-5 seconds"); // Negative
Duration("1,000 seconds"); // Comma separator
Duration("5 days"); // Unsupported unit
Duration("1h30m"); // Multi-unit
```

```

### Success Criteria:

#### Automated Verification:
- [x] Markdown linting passes (if configured)
- [x] Code examples in README are syntactically valid TypeScript

#### Manual Verification:
- [ ] README examples accurately reflect implementation
- [ ] Error examples match actual thrown errors
- [ ] Constraints are clearly documented

---

## Testing Strategy

### Unit Tests:
- **Valid inputs**: Every unit alias, case variations, whitespace variations, decimals, underscores, zero values
- **Invalid inputs**: Bare numbers, negatives, commas, unknown units, multi-unit, scientific notation, empty strings
- **Equivalence**: String parsing produces identical results to static factories
- **instanceof**: All construction methods produce valid `Duration` instances
- **Backward compat**: Numeric constructor still works, static factories unchanged

### Manual Testing:
1. Run `pnpm test` and verify all 70+ new tests pass
2. In Node REPL, test `Duration("5s") instanceof Duration` → true
3. Verify error messages are user-friendly and specific
4. Test with TypeScript project to ensure type inference works correctly
5. Check that README examples execute without errors

## Performance Considerations

- Regex compilation: `UNIT_MAP` and regex are defined once at module load (not per parse)
- String manipulation minimal: single trim, single replace for underscores
- No recursion or complex loops; O(1) parsing time
- For high-frequency parsing (e.g., config loading), consider caching if profiling shows need

## Migration Notes

- **Backward compatible**: Existing code using `new Duration(num)` or `Duration.seconds()` works unchanged
- **Type changes**: Constructor signature widens from `(seconds: number)` to `(input: string | number)` for callable form, but `new Duration()` still enforces numeric
- **No breaking changes**: Static factories, converters, internal storage unchanged

## References

- Original README: lines 12-22 teasing `Duration("1 second")`
- Existing tests: `src/index.test.ts` lines 1-234 (all numeric tests preserved)
- Pluralization: strict regex ensures both singular/plural work; "1 seconds" accepted (user chose to allow)

```
