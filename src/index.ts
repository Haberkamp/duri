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

// Unit definitions with aliases
const UNIT_MAP: Record<string, number> = {
  h: 3600,
  hour: 3600,
  hours: 3600,
  hr: 3600,
  m: 60,
  millisecond: 0.001,
  milliseconds: 0.001,
  min: 60,
  minute: 60,
  minutes: 60,
  ms: 0.001,
  s: 1,
  sec: 1,
  second: 1,
  seconds: 1,
};

// Callable and newable factory
interface DurationConstructor {
  new (seconds: number): DurationClass;
  (input: number | string): DurationClass;
  hours(value: number): DurationClass;
  milliseconds(value: number): DurationClass;
  minutes(value: number): DurationClass;
  seconds(value: number): DurationClass;
}

function parseNaturalLanguage(input: string): number {
  const trimmed = input.trim();

  // Regex: optional spaces, optional minus, number (int/decimal with optional underscores), optional spaces, unit, optional spaces
  // Pattern: ^\s*(-?)(\d*\.?\d[\d_]*)\s*([a-zA-Z]+)\s*$
  const match = /^\s*(-?)(\d*\.?\d[\d_]*)\s*([a-zA-Z]+)\s*$/.exec(trimmed);

  if (!match) {
    throw new TypeError(
      `Invalid duration format: "${input}". Expected format: "<number> <unit>" (e.g., "5 seconds", "1.5h"). Unit is required.`,
    );
  }

  const [, minusSign, numberString, unitString] = match;

  // Check for negative sign first
  if (minusSign) {
    throw new TypeError(`Negative durations not supported: "${input}"`);
  }

  // Validate no commas (comma would've failed regex, but check if somehow present)
  if (numberString!.includes(",")) {
    throw new TypeError(
      `Invalid duration: commas not supported in numbers. Use underscores instead: "${numberString!.replaceAll(",", "_")}"`,
    );
  }

  // Parse number (remove underscores)
  const numberValue = Number.parseFloat(numberString!.replaceAll("_", ""));

  if (!Number.isFinite(numberValue)) {
    throw new TypeError(`Invalid number in duration: "${numberString}"`);
  }

  // Lookup unit (case-insensitive)
  const unitLower = unitString!.toLowerCase();
  const multiplier = UNIT_MAP[unitLower];

  if (multiplier === undefined) {
    const validUnits = Object.keys(UNIT_MAP).join(", ");
    throw new TypeError(
      `Unknown unit: "${unitString}". Supported units (case-insensitive): ${validUnits}`,
    );
  }

  return numberValue * multiplier;
}

const Duration = function (input: number | string): DurationClass {
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
