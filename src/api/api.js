import Point from "../models/point.js";

const ServerUrl = {
  POINTS: `https://11.ecmascript.pages.academy/big-trip/points`,
  OFFERS: `https://11.ecmascript.pages.academy/big-trip/offers`,
  DESTINATIONS: `https://11.ecmascript.pages.academy/big-trip/destinations`,
  SYNC: `https://11.ecmascript.pages.academy/big-trip/points/sync`
};

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const ResponseStatus = {
  OK: 200,
  REDIRECT: 300
};

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }
  getEvents() {
    return this._load({
      url: ServerUrl.POINTS
    })
      .then((response) => response.json())
      .then(Point.parseEvents);
  }

  getDestinations() {
    return this._load({
      url: ServerUrl.DESTINATIONS
    })
      .then((response) => response.json());
  }

  getOffers() {
    return this._load({
      url: ServerUrl.OFFERS
    })
      .then((response) => response.json());
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

  createEvent(point) {
    return this._load({
      url: ServerUrl.POINTS,
      method: Method.POST,
      body: JSON.stringify(point.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Point.parseEvent);
  }

  updateEvent(id, data) {
    return this._load({
      url: `${ServerUrl.POINTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Point.parseEvent);
  }

  deleteEvent(id) {
    return this._load({
      url: `${ServerUrl.POINTS}/${id}`,
      method: Method.DELETE
    });
  }

  sync(data) {
    return this._load({
      url: ServerUrl.SYNC,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(url, {method, body, headers})
      .then(this._checkStatus)
      .catch((error) => {
        throw error;
      });
  }

  _checkStatus(response) {
    if (response.status >= ResponseStatus.OK && response.status < ResponseStatus.REDIRECT) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }
};

export default API;
