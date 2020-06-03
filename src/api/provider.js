import Point from "../models/point.js";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (events) => {
  return events.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((points) => {
          const events = createStoreStructure(points.map((point) => point.toRaw()));

          this._store.setItems(events);

          return points;
        });
    }
    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(Point.parseEvents(storePoints));
  }

  createEvent(point) {
    if (isOnline()) {
      return this._api.createEvent(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRaw());

          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Point.clone(Object.assign(point, {id: localNewPointId}));

    this._store.setItem(localNewPoint.id, localNewPoint.toRaw());

    return Promise.resolve(localNewPoint);
  }

  updateEvent(id, point) {
    if (isOnline()) {
      return this._api.updateEvent(id, point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRaw());

          return newPoint;
        });
    }

    const localPoint = Point.clone(Object.assign(point, {id}));
    this._store.setItem(id, localPoint.toRaw());

    return Promise.resolve(localPoint);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);
    return Promise.resolve();
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getDestinations());
    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers);
          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getOffers());
    return Promise.resolve(storeOffers);
  }
  getData() {
    return Promise.all([
      this.getEvents(),
      this.getDestinations(),
      this.getOffers(),
    ])
      .then((response) => {
        const [events, destinations, offers] = response;
        return {
          events,
          destinations,
          offers,
        };
      });
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdTripEvents = getSyncedEvents(response.created);
          const updatedTripEvents = getSyncedEvents(response.updated);

          const items = createStoreStructure([...createdTripEvents, ...updatedTripEvents]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
