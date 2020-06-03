import Event from "./models/event.js";

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
      .then(Event.parseEvents);
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

  createEvent(event) {
    return this._load({
      url: ServerUrl.POINTS,
      method: Method.POST,
      body: JSON.stringify(event.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parseEvent);
  }

  updateEvent(id, data) {
    return this._load({
      url: `${ServerUrl.POINTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parseEvent);
  }

  deleteEvent(id) {
    return this._load({
      url: `${ServerUrl.POINTS}/${id}`,
      method: Method.DELETE
    });
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
