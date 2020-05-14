import {createElement} from "../utils.js";

const createNoPointTeamplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoPoint {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoPointTeamplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
