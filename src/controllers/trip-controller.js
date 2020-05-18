import TripSort from "../components/trip-sort.js";
import TripBoard from "../components/trip-board.js";
import TripDay from "../components/trip-day.js";
import TripEvent from "../components/trip-event.js";
import TripEventEdit from "../components/trip-event-edit.js";
import NoPoint from "../components/no-point.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";

const renderEvent = (eventListElement, event) => {
  const replaceEventToEdit = () => {
    replace(tripEventEdit, tripEvent);
  };

  const replaceEditToEvent = () => {
    replace(tripEvent, tripEventEdit);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };
  const tripEvent = new TripEvent(event);
  tripEvent.setEventRollupButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const tripEventEdit = new TripEventEdit(event);
  tripEventEdit.setEventEditSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  tripEventEdit.setEventEditRollupButtonClickHandler(() => {
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, tripEvent, RenderPosition.BEFOREEND);
};

export default class TripController {
  constructor(container) {
    this._noPointComponent = new NoPoint();
    this._tripSort = new TripSort();
    this._tripBoard = new TripBoard();
    this._container = container;
  }

  render(events) {
    if (!events.length) {
      render(this._container, this._noPointComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._tripSort, RenderPosition.BEFOREEND);
    render(this._container, this._tripBoard, RenderPosition.BEFOREEND);

    const tripDayElement = this._container.querySelector(`.trip-days`);
    const getRouteDateList = () => {
      let datesEvents = events.map((event) => {
        return (Date.parse(new Date(event.startTime).toLocaleDateString(`en-US`)));
      });
      datesEvents = Array.from(new Set([...datesEvents])).sort((a, b) => a - b);
      return datesEvents;
    };

    const getRouteDate = () => {
      return getRouteDateList().
        map((it, i) => {
          return events.slice().filter((item) => Date.parse(new Date(item.startTime).toLocaleDateString(`en-US`)) === getRouteDateList()[i]);
        });
    };

    getRouteDate().forEach((routeDate, i) => {
      render(tripDayElement, new TripDay(getRouteDate()[i][0].startTime, i + 1), RenderPosition.BEFOREEND);
      routeDate.forEach((eventsDate, j) => {
        const tripEventsListElement = tripDayElement.querySelectorAll(`.trip-events__list`);
        renderEvent(tripEventsListElement[tripEventsListElement.length - 1], routeDate[j]);
      });
    });

    this._tripSort.setSortTypeChangeHandler(() => {
      tripDayElement.innerHTML = ``;

      getRouteDate().forEach((routeDate, i) => {
        render(tripDayElement, new TripDay(getRouteDate()[i][0].startTime, i + 1), RenderPosition.BEFOREEND);
        routeDate.forEach((eventsDate, j) => {
          const tripEventsListElement = tripDayElement.querySelectorAll(`.trip-events__list`);
          renderEvent(tripEventsListElement[tripEventsListElement.length - 1], routeDate[j]);
        });
      });
    });
  }
}
