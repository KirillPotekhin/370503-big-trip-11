'use strict';

const EVENT_COUNT = 20;

import {generateEvent, generateEvents} from "./mock/event.js";

import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripTabTemplate} from "./components/trip-tab.js";
import {createTripFilterTemplate} from "./components/trip-filter.js";
import {createTripSortTemplate} from "./components/trip-sort.js";
import {createTripBoardTemplate} from "./components/trip-board.js";
import {createTripDayTemplate} from "./components/trip-day.js";
import {createTripEventTemplate} from "./components/trip-event.js";
import {createTripEventEditTemplate} from "./components/trip-event-edit.js";

const render = (container, template, place = `beforeend`) => {
  return container.insertAdjacentHTML(place, template);
};

const events = generateEvents(EVENT_COUNT);

const tripMainElement = document.querySelector(`.trip-main`);

render(tripMainElement, createTripInfoTemplate(events), `afterbegin`);

const tripControlElement = tripMainElement.querySelector(`.trip-controls`);
const tripTitlesControlElements = tripControlElement.querySelectorAll(`h2`);

render(tripTitlesControlElements[0], createTripTabTemplate(), `afterend`);
render(tripControlElement, createTripFilterTemplate());

const tripEventElement = document.querySelector(`.trip-events`);

render(tripEventElement, createTripSortTemplate());
render(tripEventElement, createTripBoardTemplate());

const tripDayElement = tripEventElement.querySelector(`.trip-days`);

const getRouteDateList = () => {
  let dates = [];
  events.forEach((it) => {
    dates.push(Date.parse(new Date(it.startTime).toLocaleDateString('en-US')));
});
  dates = Array.from(new Set([...dates])).sort((a, b) => a - b);
  return dates;
};

const getRouteDate = () => {
  let days = [];
  getRouteDateList().forEach((it, i) => {
    days.push(events.slice().filter((item) => Date.parse(new Date(item.startTime).toLocaleDateString('en-US')) === getRouteDateList()[i]));
});
  return days;
};


getRouteDate().forEach((routeDate, i) => {
  render(tripDayElement, createTripDayTemplate(getRouteDate()[i][0].startTime, i + 1));
  routeDate.forEach((eventsDate, j) => {
    const tripEventsListElement = tripDayElement.querySelectorAll(`.trip-events__list`);
    render(tripEventsListElement[tripEventsListElement.length - 1], createTripEventTemplate(routeDate[j]));
});
});

const tripEventsListElement = tripDayElement.querySelectorAll(`.trip-events__list`);
tripEventsListElement[0].querySelectorAll(`.trip-events__item`)[0].remove();
render(tripEventsListElement[0], createTripEventEditTemplate(getRouteDate()[0][0]), `afterbegin`);
