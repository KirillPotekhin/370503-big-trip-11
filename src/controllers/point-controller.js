import TripEvent from "../components/trip-event.js";
import TripEventEdit from "../components/trip-event-edit.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {TYPES} from "../const.js";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {
  type: TYPES[0],
  destination: {
    name: ``,
  },
  offers: [],
  price: ``,
  isFavorite: false,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._tripEvent = null;
    this._tripEventEdit = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    const oldEventComponent = this._tripEvent;
    const oldEventEditComponent = this._tripEventEdit;
    this._mode = mode;

    this._tripEvent = new TripEvent(event);
    this._tripEventEdit = new TripEventEdit(event);

    this._tripEvent.setEventRollupButtonClickHandler(() => {
      this._replaceEventToEdit();
      // console.log(event);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEdit.setEventEditSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._tripEventEdit.getData();
      console.log(data);
      this._onDataChange(this, event, data);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEdit.setDeleteButtonClickHandler(() => {
      this._onDataChange(this, event, null);
    });

    this._tripEventEdit.setEventEditRollupButtonClickHandler(() => {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEdit.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
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
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);

        const tripEventsElement = document.querySelector(`.trip-events`);
        const tripSortElement = tripEventsElement.querySelector(`.trip-events__trip-sort`);
        if (tripSortElement) {
          render(tripSortElement, this._tripEventEdit, RenderPosition.AFTEREND);
          break;
        }
        render(tripEventsElement, this._tripEventEdit, RenderPosition.BEFOREEND);
        break;
    }
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
