export class Duration {
  private secondsValue: number;

  constructor(seconds: number) {
    this.secondsValue = seconds;
  }

  static hours(value: number): Duration {
    return new Duration(value * 3600);
  }

  static minutes(value: number): Duration {
    return new Duration(value * 60);
  }

  static seconds(value: number): Duration {
    return new Duration(value);
  }

  toSeconds(): number {
    return this.secondsValue;
  }
}
