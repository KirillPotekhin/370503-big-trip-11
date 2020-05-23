import TripEvent from "../components/trip-event.js";
import TripEventEdit from "../components/trip-event-edit.js";
import {RenderPosition, render, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
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

  render(event) {
    const oldEventComponent = this._tripEvent;
    const oldEventEditComponent = this._tripEventEdit;

    this._tripEvent = new TripEvent(event);
    this._tripEventEdit = new TripEventEdit(event);

    this._tripEvent.setEventRollupButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEdit.setEventEditSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
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

    if (oldEventEditComponent && oldEventComponent) {
      replace(this._taskComponent, oldEventComponent);
      replace(this._taskEditComponent, oldEventEditComponent);
    } else {
      render(this._container, this._tripEvent, RenderPosition.BEFOREEND);
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

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._tripEventEdit.reset();
    replace(this._tripEvent, this._tripEventEdit);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
