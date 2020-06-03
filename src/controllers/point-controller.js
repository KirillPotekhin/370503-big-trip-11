import Point from "../models/point.js";
import TripEvent from "../components/trip-event.js";
import TripEventEdit from "../components/trip-event-edit.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {eventTypes} from "../const.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const parseFormData = (formData, id) => {
  const eventEditForm = document.querySelector(`.event--edit`);
  const types = eventEditForm.querySelectorAll(`.event__type-input`);
  const activeType = Array.from(types).find((it) => it.checked).value;
  const [startTimeString, endTimeString] = formData.get(`event-start-time`).split(` to `);
  const startTimeValue = Date.parse(startTimeString);
  const endTimeValue = Date.parse(endTimeString);
  const offerList = eventEditForm.querySelectorAll(`.event__offer-selector`);
  const checkedOffers = Array.from(offerList).filter((it) => {
    return it.querySelector(`.event__offer-checkbox`).checked;
  });
  const description = eventEditForm.querySelector(`.event__destination-description`).textContent;
  const images = eventEditForm.querySelectorAll(`.event__photo`);
  const pictures = Array.from(images).map((it) => {
    return {
      'src': it.src,
      'description': it.alt,
    };
  });

  const offersActive = checkedOffers.map((it) => {
    return {
      title: it.querySelector(`.event__offer-title`).textContent,
      price: parseInt(it.querySelector(`.event__offer-price`).textContent, 10),
    };
  });
  return new Point({
    'id': id,
    'type': activeType,
    'destination': {
      'name': formData.get(`event-destination`),
      'description': description,
      'pictures': pictures,
    },
    'date_from': new Date(startTimeValue).toISOString(),
    'date_to': new Date(endTimeValue).toISOString(),
    'offers': offersActive,
    'base_price': parseInt(formData.get(`event-price`), 10),
    'is_favorite': eventEditForm.querySelector(`.event__favorite-checkbox`).checked,
  });
};

export const EmptyEvent = {
  type: eventTypes[0],
  destination: {
    name: ``,
  },
  offers: [],
  price: ``,
  isFavorite: false,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, destinations, offers) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._destinations = destinations;
    this._offers = offers;
    this._mode = Mode.DEFAULT;
    this._tripEvent = null;
    this._tripEventEdit = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode) {
    const oldEventComponent = this._tripEvent;
    const oldEventEditComponent = this._tripEventEdit;
    this._mode = mode;
    const tripEventAddButton = document.querySelector(`.trip-main__event-add-btn`);

    this._tripEvent = new TripEvent(point);
    this._tripEventEdit = new TripEventEdit(point, this._mode, this._destinations, this._offers);

    this._tripEvent.setEventRollupButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEdit.setEventEditSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._tripEventEdit.getData();
      const info = parseFormData(formData, point.id);
      document.querySelector(`.trip-events__item`).classList.remove(`invalid-form`);
      this._tripEventEdit.setData({
        saveButtonText: `Saving...`,
      });
      this.blockForm();

      this._onDataChange(this, point, info)
        .then(() => {
          setTimeout(() => {
            return this._tripEventEdit.setData({
              saveButtonText: `Save`,
            });
          }, SHAKE_ANIMATION_TIMEOUT);
        });
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEdit.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._tripEventEdit.setData({
        deleteButtonText: `Deleting...`,
      });
      this.blockForm();

      this._onDataChange(this, point, null).then(() => {
        setTimeout(() => {
          return this._tripEventEdit.setData({
            deleteButtonText: `Delete`,
          });
        }, SHAKE_ANIMATION_TIMEOUT);
      });
    });

    this._tripEventEdit.setEventEditRollupButtonClickHandler(() => {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEdit.setFavoritesButtonClickHandler(() => {
      const newEvent = Point.clone(point);
      newEvent.isFavorite = !newEvent.isFavorite;
      this._onDataChange(this, point, newEvent);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._tripEvent, oldEventComponent);
          replace(this._tripEventEdit, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._tripEvent, RenderPosition.BEFOREEND);
        }

        tripEventAddButton.disabled = false;
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        tripEventAddButton.disabled = true;
        const tripEventMsg = document.querySelector(`.trip-events__msg`);
        if (tripEventMsg) {
          tripEventMsg.remove();
        }
        const tripEventsElement = document.querySelector(`.trip-events`);
        const tripSortElement = tripEventsElement.querySelector(`.trip-events__trip-sort`);
        if (tripSortElement) {
          render(tripSortElement, this._tripEventEdit, RenderPosition.AFTEREND);
          this._tripEventEdit.getPointControllerMode(Mode.ADDING);
          break;
        }
        render(tripEventsElement, this._tripEventEdit, RenderPosition.BEFOREEND);
        this._tripEventEdit.getPointControllerMode(Mode.ADDING);
        break;
    }
  }

  blockForm() {
    const eventEditForm = document.querySelector(`.event--edit`);
    Array.from(eventEditForm.querySelectorAll(`input`)).forEach((inputPlace) => (inputPlace.disabled = true));
    Array.from(eventEditForm.querySelectorAll(`button`)).forEach((buttonForm) => (buttonForm.disabled = true));
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._tripEventEdit, this._tripEvent);
    this._mode = Mode.EDIT;
  }

  destroy() {
    remove(this._tripEventEdit);
    remove(this._tripEvent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._tripEventEdit.reset();
    if (document.contains(this._tripEventEdit.getElement())) {
      replace(this._tripEvent, this._tripEventEdit);
    }
    this._mode = Mode.DEFAULT;
  }

  shake() {
    this._tripEventEdit.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._tripEvent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._tripEventEdit.getElement().style.animation = ``;
      this._tripEvent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
      }
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
