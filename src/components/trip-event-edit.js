import {TYPES} from "../const.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";
import RangePlugin from "flatpickr/dist/plugins/rangePlugin";
import "flatpickr/dist/flatpickr.min.css";
import {Mode as PointControllerMode} from "../controllers/point-controller.js";

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
  cancelButtonText: `Cancel`,
};

const createEventTypeMarkup = (types, activeType) => {
  return types
    .map((type, index) => {
      const typeCapitalLetter = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
      const isChecked = activeType === type ? `checked` : ``;
      return (
        `<div class="event__type-item">
          <input id="event-type-${type}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${index}">${typeCapitalLetter}</label>
        </div>`
      );
    })
    .join(`\n`);
};

const createEventOptionMarkup = (optionList, optionAll, type) => {
  return optionList.find((it) => it.type === type).offers
    .map((option, index) => {
      const isOption = optionAll.find((item) => item.title === option.title && item.price === option.price);
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="event-offer-${index}" ${isOption ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${index}">
            <span class="event__offer-title">${option.title}</span>
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

const createTripEventEditTemplate = (event, mode, offerFlag, destinations, offersList, externalData = DefaultData) => {
  const {type, destination, price, offers, isFavorite} = event;
  const city = destination.name;
  const description = city ? destinations.find((it) => it.name === city).description : ``;
  const photos = city ? destinations.find((it) => it.name === city).pictures : ``;
  const eventPhotoMarkup = city ? createEventPhotoMarkup(photos) : ``;
  const typeCapitalLetter = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
  const destinationItemMarkup = createDestinationItemMarkup(destinations);
  const eventTypeTransferMarkup = createEventTypeMarkup(TYPES.slice(0, 7), type);
  const eventTypeActivityMarkup = createEventTypeMarkup(TYPES.slice(-3), type);
  const eventOptionMarkup = createEventOptionMarkup(offersList, offers, type);
  const isBlockSaveButton = !city || !price;
  const offerList = mode === PointControllerMode.ADDING && !offerFlag ? [] : offersList.filter((it) => it.type === type)[0].offers;
  const pretext = (type === `sightseeing`) || (type === `restaurant`) || (type === `check-in`) ? `in` : `to`;
  const saveButtonText = externalData.saveButtonText;
  const deleteButtonText = mode !== PointControllerMode.ADDING ? externalData.deleteButtonText : externalData.cancelButtonText;
  return (
    `<form class="event  event--edit trip-events__item" action="#" method="post">
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
            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockSaveButton ? `disabled` : ``}>${saveButtonText}</button>
          <button class="event__reset-btn" type="reset">${deleteButtonText}</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1" ${mode === PointControllerMode.ADDING ? `style="display: none"` : ``}>
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button ${mode === PointControllerMode.ADDING ? `style="display: none"` : ``}class="event__rollup-btn" type="button">
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
          ${description ? `<section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${description}</p>

              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${eventPhotoMarkup}
                </div>
              </div>
          </section>` : ``}
        </section>
      </form>`
  );
};

export default class TripEventEdit extends AbstractSmartComponent {
  constructor(event, mode, destinations, offers) {
    super();
    this._event = event;
    this._mode = mode;
    this._destinations = destinations;
    this._offers = offers;
    this._eventEditSubmitHandler = null;
    this._eventEditRollupButtonClickHandler = null;
    this._favoritesButtonClickHandler = null;
    this._flatpickr = null;
    this._eventTimeValue = {};
    this._deleteButtonClickHandler = null;
    this._eventInfo = Object.assign({}, this._event);
    this._activeEventType = {type: this._event.type};
    this._eventDestinationValue = {destination: this._event.destination};
    this._applyFlatpickr();
    this._subscribeOnEvents();
    this._isOffer = null;
    this._externalData = DefaultData;
  }

  getTemplate() {
    return createTripEventEditTemplate(this._eventInfo, this._mode, this._isOffer, this._destinations, this._offers, this._externalData);
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setEventEditSubmitHandler(this._eventEditSubmitHandler);
    this.setEventEditRollupButtonClickHandler(this._eventEditRollupButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const event = this._event;

    this._activeEventType = {type: event.type};
    this._eventDestinationValue = {};

    this.rerender();
  }

  getData() {
    const eventEditForm = document.querySelector(`.event--edit`);
    return new FormData(eventEditForm);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setEventEditSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
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

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  getPointControllerMode(handler) {
    this._mode = handler;
    this.rerender();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const element = this.getElement();
    const [eventStartTime, eventEndTime] = element.querySelectorAll(`.event__input--time`);
    const time = {
      timeFormat: `time_24hr`,
    };
    const flatpickrOption = {
      altInput: true,
      allowInput: true,
      altFormat: `d/m/y H:i`,
      enableTime: true,
      defaultDate: [this._eventInfo.startTime || `today`, this._eventInfo.endTime || `today`],
      plugins: [new RangePlugin({input: eventEndTime})],
    };
    flatpickrOption[time.timeFormat] = true;
    this._flatpickr = flatpickr(eventStartTime, flatpickrOption);

    const datePicker = element.querySelector(`.flatpickr-input`);
    datePicker.addEventListener(`change`, (evt) => {
      const [startTimeString, endTimeString] = evt.target.value.split(` to `);
      const startTimeValue = Date.parse(startTimeString);
      const endTimeValue = Date.parse(endTimeString);
      this._eventTimeValue.startTime = new Date(startTimeValue).toISOString();
      this._eventTimeValue.endTime = new Date(endTimeValue).toISOString();
      this._eventInfo = Object.assign({}, this._eventInfo, this._eventTimeValue);
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const eventType = element.querySelector(`.event__type-list`);
    eventType.addEventListener(`change`, (evt) => {
      this._activeEventType.type = evt.target.value;
      this._activeEventType.offers = [];
      this._eventInfo = Object.assign({}, this._eventInfo, this._activeEventType);
      this._isOffer = true;
      this.rerender();
    });

    const eventDestination = element.querySelector(`.event__input--destination`);
    eventDestination.addEventListener(`change`, (evt) => {
      this._eventDestinationValue.name = evt.target.value;
      const index = this._destinations.findIndex((item) => item.name === this._eventDestinationValue.name);
      if (index !== -1) {
        this._eventDestinationValue.name = this._destinations[index].name;
        this._eventDestinationValue.description = this._destinations[index].description;
        this._eventDestinationValue.pictures = this._destinations[index].pictures;
        this._eventDestinationValue.destination = this._eventDestinationValue;
      } else {
        this._eventDestinationValue.name = this._eventInfo.name;
      }
      this._eventInfo = Object.assign({}, this._eventInfo, this._eventDestinationValue);
      const saveButton = this.getElement().querySelector(`.event__save-btn`);
      saveButton.disabled = !this._eventInfo.price || !eventDestination.value;
      this.rerender();

    });

    // const datePicker = element.querySelector(`.flatpickr-input`);
    // datePicker.addEventListener(`input`, (evt) => {
    //   const [startTimeString, endTimeString] = evt.target.value.split(` to `);
    //   const startTimeValue = Date.parse(startTimeString);
    //   const endTimeValue = Date.parse(endTimeString);
    //   this._eventTimeValue.startTime = new Date(startTimeValue).toISOString();
    //   this._eventTimeValue.endTime = new Date(endTimeValue).toISOString();
    //   this._eventInfo = Object.assign({}, this._eventInfo, this._eventTimeValue);
    //   console.log(this._eventInfo);
    // });
    // if (datePicker) {
    //   datePicker.addEventListener(`input`, (evt) => {
    //     const [startTimeString, endTimeString] = evt.target.value.split(` to `);
    //     const startTimeValue = Date.parse(startTimeString);
    //     const endTimeValue = Date.parse(endTimeString);
    //     this._eventTimeValue.startTime = new Date(startTimeValue).toISOString();
    //     this._eventTimeValue.endTime = new Date(endTimeValue).toISOString();
    //     this._eventInfo = Object.assign({}, this._eventInfo, this._eventTimeValue);
    //     console.log(this._eventInfo);
    //   });
    // }

    element.querySelector(`.event__input--price`)
      .addEventListener(`keydown`, (evt) => {
        const theEvent = evt || window.event;
        let key = theEvent.key;
        const regex = /[0-9]|Backspace/;
        if (!regex.test(key)) {
          theEvent.returnValue = false;
          if (theEvent.preventDefault) {
            theEvent.preventDefault();
          }
        }
      });

    element.querySelector(`.event__input--price`)
      .addEventListener(`input`, (evt) => {
        this._currentPrice = evt.target.value;
        this._eventInfo = Object.assign({}, this._eventInfo, {price: this._currentPrice});
        const saveButton = this.getElement().querySelector(`.event__save-btn`);
        saveButton.disabled = !this._currentPrice || !eventDestination.value;
      });
  }
}
