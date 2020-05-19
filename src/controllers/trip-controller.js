import TripSort, {SortType} from "../components/trip-sort.js";
import TripBoard from "../components/trip-board.js";
import TripDay from "../components/trip-day.js";
import TripEvent from "../components/trip-event.js";
import TripEventEdit from "../components/trip-event-edit.js";
import NoPoint from "../components/no-point.js";
import {RenderPosition, render, replace} from "../utils/render.js";

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

const renderEvents = (container, routePointDates, sortType) => {
  routePointDates.forEach((routeDate, i) => {
    render(container, new TripDay(routePointDates[i][0].startTime, i + 1), RenderPosition.BEFOREEND);

    routeDate.forEach((eventsDate, j) => {
      const tripEventsListElement = container.querySelectorAll(`.trip-events__list`);
      renderEvent(tripEventsListElement[tripEventsListElement.length - 1], routeDate[j]);
    });

    const tripSortDay = document.querySelector(`.trip-sort__item--day`);
    if (SortType.DEFAULT !== sortType) {
      tripSortDay.textContent = ``;
      container.querySelector(`.day__info`).innerHTML = ``;
    } else {
      tripSortDay.textContent = `Day`;
    }
  });
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
    const routeDateList = getRouteDateList();

    const getRouteDate = () => {
      return routeDateList.
        map((it, i) => {
          return events.slice().filter((item) => Date.parse(new Date(item.startTime).toLocaleDateString(`en-US`)) === getRouteDateList()[i]);
        });
    };
    const routeDates = getRouteDate();
    renderEvents(tripDayElement, routeDates, SortType.DEFAULT);

    const getSortedEvents = (eventsList, sortType) => {
      let sortedEvents = [];
      const routeSortProcess = eventsList.slice();

      switch (sortType) {
        case SortType.TIME:
          sortedEvents[0] = routeSortProcess.sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));
          break;
        case SortType.PRICE:
          sortedEvents[0] = routeSortProcess.sort((a, b) => b.price - a.price);
          break;
        case SortType.DEFAULT:
          sortedEvents = routeDates;
          break;
      }

      return sortedEvents;
    };

    this._tripSort.setSortTypeChangeHandler((sortType) => {
      tripDayElement.innerHTML = ``;

      const sortedEvents = getSortedEvents(events, sortType);
      renderEvents(tripDayElement, sortedEvents, sortType);
    });
  }
}
