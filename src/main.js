import {generateEvents} from "./mock/event.js";

import TripInfo from "./components/trip-info.js";
import TripTab, {TabItem} from "./components/trip-tab.js";
import TripController from "./controllers/trip-controller.js";
import FilterController from "./controllers/filter.js";
import Statistics from "./components/statistics.js";
import PointsModel from "./models/points.js";
import {RenderPosition, render} from "./utils/render.js";
import {FilterTypes} from "./const.js";

const EVENT_COUNT = 2;

const events = generateEvents(EVENT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setEvents(events);

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfo(events), RenderPosition.AFTERBEGIN);

const tripControlElement = tripMainElement.querySelector(`.trip-controls`);
const tripTitlesControlElements = tripControlElement.querySelectorAll(`h2`);
const tripTab = new TripTab();
render(tripTitlesControlElements[0], tripTab, RenderPosition.AFTEREND);

const filterController = new FilterController(tripControlElement, pointsModel);
filterController.render();

const tripEventElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventElement, pointsModel);
tripController.render(events);
// tripController.setActiveItem(TabItem.EVENTS);

const newEvent = tripMainElement.querySelector(`.trip-main__event-add-btn`);
newEvent.addEventListener(`click`, () => {
  filterController.onFilterChange(FilterTypes.EVERYTHING);
  filterController.render();
  tripController.createEvent();
});

const pageMain = document.querySelector(`.page-main`);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);
const statistics = new Statistics();
render(pageBodyContainer, statistics, RenderPosition.BEFOREEND);
statistics.hide();

tripTab.setOnClick((tabItem) => {
  switch (tabItem) {
    case TabItem.STATISTICS:
      tripController.hide();
      statistics.show();
      break;
    case TabItem.EVENTS:
      statistics.hide();
      tripController.show();
      tripController.onSortTypeReset();
      break;
  }
});
