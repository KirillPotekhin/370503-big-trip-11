'use strict';

const EVENT_DAY = 1;
const EVENT_COUNT = 3;

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

const tripMainElement = document.querySelector(`.trip-main`);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripControlElement = tripMainElement.querySelector(`.trip-controls`);
const tripTitlesControlElements = tripControlElement.querySelectorAll(`h2`);

render(tripTitlesControlElements[0], createTripTabTemplate(), `afterend`);
render(tripControlElement, createTripFilterTemplate());

const tripEventElement = document.querySelector(`.trip-events`);

render(tripEventElement, createTripSortTemplate());
render(tripEventElement, createTripBoardTemplate());

const tripDayElement = tripEventElement.querySelector(`.trip-days`);

for (let i = 0; i < EVENT_DAY; i++) {
  render(tripDayElement, createTripDayTemplate());
  for (let j = 0; j < EVENT_COUNT; j++) {
    const tripEventsListElement = tripDayElement.querySelector(`.trip-events__list`);
    render(tripEventsListElement, createTripEventTemplate());
  }
}

const tripEventsListElement = tripDayElement.querySelector(`.trip-events__list`);
render(tripEventsListElement, createTripEventEditTemplate(), `afterbegin`);
