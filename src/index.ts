export class Duration {
  private secondsValue: number;

  constructor(seconds: number) {
    this.secondsValue = seconds;
  }

  static hours(value: number): Duration {
    return new Duration(value * 3600);
  }

  static milliseconds(value: number): Duration {
    return new Duration(value / 1000);
  }

  static minutes(value: number): Duration {
    return new Duration(value * 60);
  }

  static seconds(value: number): Duration {
    return new Duration(value);
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
