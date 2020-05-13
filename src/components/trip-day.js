import {createElement} from "../utils.js";

const createTripDayTemplate = (dateValue, number = 1) => {
  const date = new Date(dateValue).toLocaleDateString(`en-US`, {day: `numeric`, month: `short`});
  const dateTime = new Date().toLocaleDateString(`nl`, {year: `numeric`, month: `2-digit`, day: `2-digit`});
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${number}</span>
        <time class="day__date" datetime="${dateTime}">${date}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class TripDay {
  constructor(dateValue, number) {
    this._dateValue = dateValue;
    this._number = number;
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate(this._dateValue, this._number);
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
