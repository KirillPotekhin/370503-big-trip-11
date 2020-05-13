import {DAY, HOUR, MINUTE} from "../const.js";
import {createElement, timeDisplay} from "../utils.js";

const getDifferenceTime = (startTime, endTime) => {
  const differenceTime = Math.floor(endTime - startTime);
  const day = Math.floor(differenceTime / DAY);
  const hour = (differenceTime < DAY) ? Math.floor(differenceTime / HOUR) : Math.floor(Math.floor(differenceTime % DAY) / HOUR);
  let minute;
  if (differenceTime < HOUR) {
    minute = differenceTime / MINUTE;
  } else if (differenceTime < DAY) {
    minute = Math.floor(differenceTime % HOUR) / MINUTE;
  } else {
    minute = Math.floor(Math.floor(Math.floor(differenceTime % DAY) % HOUR) / MINUTE);
  }
  return `${day ? `${day}D ` : ``}${hour ? `${hour}H ` : ``}${minute ? `${minute}M` : ``}`;
};

const createEventOptionMarkup = (optionAll) => {
  return optionAll.slice(0, 3)
  .map((option) => {
    return `<li class="event__offer">
      <span class="event__offer-title">${option.titile}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
    </li>`;
  }).join(`\n`);
};

const createTripEventTemplate = (event) => {
  const {type, city, startTime, endTime, price, optionAll} = event;
  const startTimeDate = new Date(startTime);
  const endTimeDate = new Date(endTime);
  const eventOptionMarkup = createEventOptionMarkup(optionAll);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event ${type.toLowerCase()} icon">
        </div>
        <h3 class="event__title">${type} ${(type === `Sightseeing`) || (type === `Restaurant`) || (type === `Check-in`) ? `in` : `to`} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${timeDisplay(startTimeDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${timeDisplay(endTimeDate)}</time>
          </p>
          <p class="event__duration">${getDifferenceTime(startTime, endTime)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        ${optionAll.length ? `<h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${eventOptionMarkup}
          </ul>` : ``}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class TripEvent {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
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
