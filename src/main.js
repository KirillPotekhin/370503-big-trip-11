import {generateEvents} from "./mock/event.js";

import TripInfo from "./components/trip-info.js";
import TripTab from "./components/trip-tab.js";
import TripFilter from "./components/trip-filter.js";
import TripSort from "./components/trip-sort.js";
import TripBoard from "./components/trip-board.js";
import TripDay from "./components/trip-day.js";
import TripEvent from "./components/trip-event.js";
import TripEventEdit from "./components/trip-event-edit.js";
import {RenderPosition, render} from "./utils.js";

const EVENT_COUNT = 20;

const events = generateEvents(EVENT_COUNT);

const tripMainElement = document.querySelector(`.trip-main`);

render(tripMainElement, new TripInfo(events).getElement(), RenderPosition.AFTERBEGIN);

const tripControlElement = tripMainElement.querySelector(`.trip-controls`);
const tripTitlesControlElements = tripControlElement.querySelectorAll(`h2`);
render(tripTitlesControlElements[0], new TripTab().getElement(), RenderPosition.AFTEREND);
render(tripControlElement, new TripFilter().getElement(), RenderPosition.BEFOREEND);

const renderEvent = (eventListElement, event) => {
  const onEventRollupButtonClick = () => {
    eventListElement.replaceChild(tripEventEdit.getElement(), tripEvent.getElement());
  };

  const onEventEditFormSubmit = (evt) => {
    evt.preventDefault();
    eventListElement.replaceChild(tripEvent.getElement(), tripEventEdit.getElement());
  };
  const tripEvent = new TripEvent(event);
  const eventRollupButton = tripEvent.getElement().querySelector(`.event__rollup-btn`);
  eventRollupButton.addEventListener(`click`, onEventRollupButtonClick);

  const tripEventEdit = new TripEventEdit(event);
  const eventEditForm = tripEventEdit.getElement().querySelector(`.event--edit`);
  eventEditForm.addEventListener(`submit`, onEventEditFormSubmit);

  render(eventListElement, tripEvent.getElement(), RenderPosition.BEFOREEND);
};

const renderEventList = (eventsList) => {
  const tripEventElement = document.querySelector(`.trip-events`);

  render(tripEventElement, new TripSort().getElement(), RenderPosition.BEFOREEND);
  render(tripEventElement, new TripBoard().getElement(), RenderPosition.BEFOREEND);

  const tripDayElement = tripEventElement.querySelector(`.trip-days`);
  const getRouteDateList = () => {
    let datesEvents = eventsList.map((event) => {
      return (Date.parse(new Date(event.startTime).toLocaleDateString(`en-US`)));
    });
    datesEvents = Array.from(new Set([...datesEvents])).sort((a, b) => a - b);
    return datesEvents;
  };

  const getRouteDate = () => {
    return getRouteDateList().
      map((it, i) => {
        return eventsList.slice().filter((item) => Date.parse(new Date(item.startTime).toLocaleDateString(`en-US`)) === getRouteDateList()[i]);
      });
  };


  getRouteDate().forEach((routeDate, i) => {
    render(tripDayElement, new TripDay(getRouteDate()[i][0].startTime, i + 1).getElement(), RenderPosition.BEFOREEND);
    routeDate.forEach((eventsDate, j) => {
      const tripEventsListElement = tripDayElement.querySelectorAll(`.trip-events__list`);
      renderEvent(tripEventsListElement[tripEventsListElement.length - 1], routeDate[j]);
    });
  });
};

renderEventList(events);
