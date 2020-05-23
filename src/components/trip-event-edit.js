import {TYPES} from "../const.js";
import {timeDisplay} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {destinations, offersList} from "../mock/event.js";

const createEventTypeMarkup = (types) => {
  return types
    .map((type, index) => {
      const typeCapitalLetter = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
      return (
        `<div class="event__type-item">
          <input id="event-type-${type}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${index}">${typeCapitalLetter}</label>
        </div>`
      );
    })
    .join(`\n`);
};

const getDateEvent = (date) => {
  return new Date(date).toLocaleDateString(`en-GB`, {day: `numeric`, month: `numeric`, year: `2-digit`});
};

const createEventOptionMarkup = (optionList, optionAll, type) => {
  return optionList.filter((it) => it.type === type)[0].offers
    .map((option, index) => {
      const isOption = optionAll.find((item) => item.title === option.title && item.price === option.price);
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="event-offer-${index}" ${isOption ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${index}">
            <span class="event__offer-title">${option.titile}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
          </label>
        </div>`
      );
    }).join(`\n`);
};

const createEventPhotoMarkup = (photos) => {
  return photos
    .map((photo) => {
      return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
    }).join(`\n`);
};

const createDestinationItemMarkup = (cities) => {
  return cities
    .map((city) => {
      return `<option value="${city.name}"></option>`;
    }).join(`\n`);
};

const createTripEventEditTemplate = (event) => {
  const {type, startTime, endTime, destination, price, offers, isFavorite} = event;
  const description = destination.description;
  const city = destination.name;
  const photos = destination.pictures;
  const typeCapitalLetter = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
  const destinationItemMarkup = createDestinationItemMarkup(destinations);
  const eventTypeTransferMarkup = createEventTypeMarkup(TYPES.slice(0, 7));
  const eventTypeActivityMarkup = createEventTypeMarkup(TYPES.slice(-3));
  const eventOptionMarkup = createEventOptionMarkup(offersList, offers, type);
  const eventPhotoMarkup = createEventPhotoMarkup(photos);
  const offerList = offersList.filter((it) => it.type === type)[0].offers;
  const pretext = (type === `Sightseeing`) || (type === `Restaurant`) || (type === `Check-in`) ? `in` : `to`;
  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${eventTypeTransferMarkup}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${eventTypeActivityMarkup}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${typeCapitalLetter} ${pretext}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationItemMarkup}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateEvent(startTime)} ${timeDisplay(startTime)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateEvent(endTime)} ${timeDisplay(endTime)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          ${offerList.length ?
      `<section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          
              <div class="event__available-offers">
                ${eventOptionMarkup}
              </div>
            </section>` : ``}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${eventPhotoMarkup}
              </div>
            </div>
          </section> 
        </section>
      </form>
    </li>`
  );
};

export default class TripEventEdit extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;
    this._eventEditSubmitHandler = null;
    this._eventEditRollupButtonClickHandler = null;
    this._favoritesButtonClickHandler = null;

    this._activeEventType = {type: this._event.type};
    this._eventDestinationValue = {};

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTripEventEditTemplate(Object.assign({}, this._event, this._activeEventType, this._eventDestinationValue.destination));
  }

  recoveryListeners() {
    this.setEventEditSubmitHandler(this._evenstEditSubmitHandler);
    this.setEventEditRollupButtonClickHandler(this._eventEditRollupButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const event = this._event;

    this._activeEventType = {type: event.type};
    this._eventDestinationValue = {};

    this.rerender();
  }

  setEventEditSubmitHandler(handler) {
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, handler);
    this._eventEditSubmitHandler = handler;
  }

  setEventEditRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
    this._eventEditRollupButtonClickHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, handler);
    this._favoritesButtonClickHandler = handler;
    this.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const eventType = element.querySelector(`.event__type-list`);
    eventType.addEventListener(`change`, (evt) => {
      this._activeEventType.type = evt.target.value;
      this._activeEventType.offers = [];

      this.rerender();
    });

    const eventDestination = element.querySelector(`.event__input--destination`);
    eventDestination.addEventListener(`change`, (evt) => {
      this._eventDestinationValue.name = evt.target.value;
      const index = destinations.findIndex((item) => item.name === this._eventDestinationValue.name);
      if (index !== -1) {
        this._eventDestinationValue.name = destinations[index].name;
        this._eventDestinationValue.description = destinations[index].description;
        this._eventDestinationValue.pictures = destinations[index].pictures;
        this._eventDestinationValue.destination = this._eventDestinationValue;
      }

      this.rerender();
    });
  }
}
