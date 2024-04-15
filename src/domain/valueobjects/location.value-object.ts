export class Location {
  lat: number;
  long: number;

  constructor(input: { lat: number; long: number }) {
    this.lat = input.lat;
    this.long = input.long;
  }
}
