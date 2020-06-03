export default class Point {
  constructor(point) {
    this.id = point[`id`];
    this.type = point[`type`];
    this.startTime = point[`date_from`];
    this.endTime = point[`date_to`];
    this.destination = point[`destination`];
    this.price = point[`base_price`];
    this.offers = point[`offers`];
    this.isFavorite = Boolean(point[`is_favorite`]);
  }

  toRaw() {
    return {
      'id': this.id,
      'type': this.type,
      'date_from': this.startTime,
      'date_to': this.endTime,
      'destination': this.destination,
      'base_price': this.price,
      'offers': this.offers,
      'is_favorite': this.isFavorite,
    };
  }

  static parseEvent(point) {
    return new Point(point);
  }

  static parseEvents(point) {
    return point.map(Point.parseEvent);
  }

  static clone(point) {
    return new Point(point.toRaw());
  }
}
