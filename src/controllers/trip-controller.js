import TripSort, {SortType} from "../components/trip-sort.js";
import TripBoard from "../components/trip-board.js";
import TripDay from "../components/trip-day.js";
import TripEventItem from "../components/trip-event-item";
import PointController, {Mode as PointControllerMode, EmptyEvent} from "./point-controller.js";
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
      render(tripEventsListElement[tripEventsListElement.length - 1], new TripEventItem(), RenderPosition.BEFOREEND);
      const tripEventItem = tripEventsListElement[tripEventsListElement.length - 1].querySelectorAll(`.trip-events__item`);
      const pointController = new PointController(tripEventItem[tripEventItem.length - 1], onDataChange, onViewChange);
      pointController.render(eventsDate, PointControllerMode.DEFAULT);
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
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._creatingEvent = null;
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

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    const tripSort = document.querySelectorAll(`.trip-events__trip-sort`);
    if (!tripSort.length) {
      render(this._container, this._tripSort, RenderPosition.AFTERBEGIN);
    }

    const tripEventsWrapper = document.querySelector(`.trip-events`);
    this._creatingEvent = new PointController(tripEventsWrapper, this._onDataChange, this._onViewChange);
    this._creatingEvent.render(EmptyEvent, PointControllerMode.ADDING);
  }

  _removeEvents() {
    this._showedEventControllers.forEach((showedEventControllers) => {
      showedEventControllers.forEach((pointController) => pointController.destroy());
    });

    this._showedEventControllers = [];

    const tripDayElement = this._container.querySelector(`.trip-days`);
    const tripDaysItems = tripDayElement.querySelectorAll(`.trip-days__item`);
    tripDaysItems.forEach((tripDayItem) => tripDayItem.remove());
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

  _updateEvents() {
    const tripSort = document.querySelectorAll(`.trip-events__trip-sort`);
    if (!tripSort.length) {
      render(this._container, this._tripSort, RenderPosition.AFTERBEGIN);
    }
    if (!this._pointsModel.getEvents().length) {
      this._tripSort.getElement().remove();
    }
    this._removeEvents();
    this._renderEvents(this._pointsModel.getEvents());
  }

  _getInfoCost() {
    const tripCost = this._pointsModel.getEvents().reduce((acc, it) => acc + it.price, 0);
    const offersCost = this._pointsModel.getEvents().reduce((acc, it) => {
      it.offers.forEach((offer) => {
        acc = acc + offer.price;
        return acc;
      });
      return acc;
    }, 0);
    const totalCost = tripCost + offersCost;
    const costValue = this._pointsModel.getEvents().length ? totalCost : 0;
    const tripInfo = document.querySelector(`.trip-info__cost-value`);
    tripInfo.textContent = costValue;
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyEvent) {

      this._creatingEvent = null;
      if (newData === null) {
        pointController.destroy();
        this._updateEvents();
        this._getInfoCost();
        this._onSortTypeChange(this._tripSort.getSortType());
      } else {
        this._pointsModel.addEvent(newData);
        pointController.render(newData, PointControllerMode.DEFAULT);

        const pointControllerWripper = [[pointController]];
        this._showedEventControllers = [].concat(pointControllerWripper, this._showedEventControllers);
        this._getInfoCost();
        this._onSortTypeChange(this._tripSort.getSortType());
      }
    } else if (newData === null) {
      this._pointsModel.removeEvent(oldData.id);
      this._updateEvents();
      this._getInfoCost();
      this._onSortTypeChange(this._tripSort.getSortType());
      if (!this._pointsModel.getEvents().length) {
        render(this._container, this._noPointComponent, RenderPosition.BEFOREEND);
      }
    } else {
      const isSuccess = this._pointsModel.updateEvent(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData);
        this._getInfoCost();
        this._onSortTypeChange(this._tripSort.getSortType());
      }
    }
  }

  _onViewChange() {
    this._showedEventControllers.forEach((showedEventControllers) => {
      showedEventControllers.forEach((it) => it.setDefaultView());
    });
    const newForm = document.querySelector(`.event--edit`);
    if (newForm) {
      newForm.remove();
      const tripEventAddButton = document.querySelector(`.trip-main__event-add-btn`);
      tripEventAddButton.disabled = false;
      this._creatingEvent = null;
    }
  }

  _onSortTypeChange(sortType) {
    const tripDayElement = this._container.querySelector(`.trip-days`);
    this._removeEvents();

    const sortedEvents = getSortedEvents(this._pointsModel.getEvents(), sortType);
    this._showedEventControllers = renderEvents(tripDayElement, sortedEvents, sortType, this._onDataChange, this._onViewChange);
  }

  _onFilterChange() {
    this._updateEvents();
    this._onSortTypeChange(SortType.DEFAULT);
    this._tripSort.reserSortChecked();
  }
}
