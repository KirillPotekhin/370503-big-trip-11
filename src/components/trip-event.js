import {timeDisplay} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";
import Moment from "moment";

const getDifferenceTime = (startTime, endTime) => {
  const startTimeValue = new Moment(startTime);
  const endTimeValue = new Moment(endTime);
  const diferenceTime = Moment.duration(endTimeValue.diff(startTimeValue));
  const day = diferenceTime.days() ? `${diferenceTime.days()}D` : ``;
  const hour = diferenceTime.hours() ? `${diferenceTime.hours()}H` : ``;
  const minute = diferenceTime.minutes() ? `${diferenceTime.minutes()}M` : ``;
  return `${day} ${hour} ${minute}`;
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
  const {type, startTime, endTime, destination, price, offers} = event;
  const city = destination.name;
  const typeCapitalLetter = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
  const startTimeDate = new Date(startTime);
  const endTimeDate = new Date(endTime);
  const eventOptionMarkup = createEventOptionMarkup(offers);
  const pretext = (type === `Sightseeing`) || (type === `Restaurant`) || (type === `Check-in`) ? `in` : `to`;
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
        </div>
        <h3 class="event__title">${typeCapitalLetter} ${pretext} ${city}</h3>

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

        ${offers.length ? `<h4 class="visually-hidden">Offers:</h4>
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

export default class TripEvent extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
  }

  setEventRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
