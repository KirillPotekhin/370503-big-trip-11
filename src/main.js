import {generateEvents} from "./mock/event.js";

import TripInfo from "./components/trip-info.js";
import TripTab from "./components/trip-tab.js";
import TripFilter from "./components/trip-filter.js";
import TripController from "./controllers/trip-controller.js";
import PointsModel from "./models/points.js";
import {RenderPosition, render} from "./utils/render.js";

const EVENT_COUNT = 20;

const events = generateEvents(EVENT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setEvents(events);

const tripMainElement = document.querySelector(`.trip-main`);

render(tripMainElement, new TripInfo(events), RenderPosition.AFTERBEGIN);

const tripControlElement = tripMainElement.querySelector(`.trip-controls`);
const tripTitlesControlElements = tripControlElement.querySelectorAll(`h2`);
render(tripTitlesControlElements[0], new TripTab(), RenderPosition.AFTEREND);
render(tripControlElement, new TripFilter(), RenderPosition.BEFOREEND);

const tripEventElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventElement, pointsModel);

tripController.render(events);
