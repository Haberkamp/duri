export class Duration {
  private secondsValue: number;

  constructor(seconds: number) {
    this.secondsValue = seconds;
  }

  static seconds(value: number): Duration {
    return new Duration(value);
  }

  toSeconds(): number {
    return this.secondsValue;
  }
}
