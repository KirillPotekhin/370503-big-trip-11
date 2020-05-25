import TripSort, {SortType} from "../components/trip-sort.js";
import TripBoard from "../components/trip-board.js";
import TripDay from "../components/trip-day.js";
import PointController from "./point-controller.js";
import NoPoint from "../components/no-point.js";
import {RenderPosition, render} from "../utils/render.js";

const renderEvents = (container, routePointDates, sortType, onDataChange, onViewChange) => {
  return routePointDates.map((routeDate, i) => {
    render(container, new TripDay(routePointDates[i][0].startTime, i + 1), RenderPosition.BEFOREEND);
    const tripSortDay = document.querySelector(`.trip-sort__item--day`);
    if (SortType.DEFAULT !== sortType) {
      tripSortDay.textContent = ``;
      container.querySelector(`.day__info`).innerHTML = ``;
    } else {
      tripSortDay.textContent = `Day`;
    }

    return routeDate.map((eventsDate) => {
      const tripEventsListElement = container.querySelectorAll(`.trip-events__list`);
      const pointController = new PointController(tripEventsListElement[tripEventsListElement.length - 1], onDataChange, onViewChange);
      pointController.render(eventsDate);
      return pointController;
    });
  });
};

const getSortedEvents = (eventsList, sortType) => {
  const getRouteDateList = () => {
    let datesEvents = eventsList.map((event) => {
      return (Date.parse(new Date(event.startTime).toLocaleDateString(`en-US`)));
    });
    datesEvents = Array.from(new Set([...datesEvents])).sort((a, b) => a - b);
    return datesEvents;
  };
  const routeDateList = getRouteDateList();

  const getRouteDate = () => {
    return routeDateList.
      map((it, i) => {
        return eventsList.slice().filter((item) => Date.parse(new Date(item.startTime).toLocaleDateString(`en-US`)) === getRouteDateList()[i]);
      });
  };
  const routeDates = getRouteDate();

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

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._showedEventControllers = [];
    this._noPointComponent = new NoPoint();
    this._tripSort = new TripSort();
    this._tripBoard = new TripBoard();
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._tripSort.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render() {
    const events = this._pointsModel.getEvents();

    if (!events.length) {
      render(this._container, this._noPointComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._tripSort, RenderPosition.BEFOREEND);
    render(this._container, this._tripBoard, RenderPosition.BEFOREEND);

    this._renderEvents(events);
  }

  _renderEvents(events) {
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
          return events.filter((item) => Date.parse(new Date(item.startTime).toLocaleDateString(`en-US`)) === getRouteDateList()[i]);
        });
    };
    const routeDates = getRouteDate();
    this._showedEventControllers = renderEvents(tripDayElement, routeDates, SortType.DEFAULT, this._onDataChange, this._onViewChange);
  }

  _onDataChange(pointController, oldData, newData) {
    const isSuccess = this._pointsModel.updateTask(oldData.id, newData);

    if (isSuccess) {
      pointController.render(newData);
    }
  }

  _onViewChange() {
    this._showedEventControllers.forEach((showedEventControllers) => {
      showedEventControllers.forEach((it) => it.setDefaultView());
    });
  }

  _onSortTypeChange(sortType) {
    const tripDayElement = this._container.querySelector(`.trip-days`);
    tripDayElement.innerHTML = ``;

    const sortedEvents = getSortedEvents(this._pointsModel.getEvents(), sortType);
    this._showedEventControllers = renderEvents(tripDayElement, sortedEvents, sortType, this._onDataChange, this._onViewChange);
  }
}
