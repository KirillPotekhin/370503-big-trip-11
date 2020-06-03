import API from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import Loading from './components/loading.js';
import TripInfo from "./components/trip-info.js";
import TripTab, {TabItem} from "./components/trip-tab.js";
import TripController from "./controllers/trip-controller.js";
import FilterController from "./controllers/filter.js";
import Statistics from "./components/statistics.js";
import PointsModel from "./models/points.js";
import {RenderPosition, render, remove} from "./utils/render.js";
import {FilterTypes} from "./const.js";

const AUTHORIZATION = `Basic HJKhugk24HKhkhqOFDa=`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const pointsModel = new PointsModel();

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlElement = tripMainElement.querySelector(`.trip-controls`);
const tripTitlesControlElements = tripControlElement.querySelectorAll(`h2`);
const tripEventElement = document.querySelector(`.trip-events`);
const newEvent = tripMainElement.querySelector(`.trip-main__event-add-btn`);
const pageMain = document.querySelector(`.page-main`);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);

const loading = new Loading();
const tripTab = new TripTab();
const filterController = new FilterController(tripControlElement, pointsModel);
filterController.render();
const tripController = new TripController(tripEventElement, pointsModel, apiWithProvider);
const statistics = new Statistics(pointsModel);

render(pageBodyContainer, loading, RenderPosition.BEFOREEND);
render(tripTitlesControlElements[0], tripTab, RenderPosition.AFTEREND);
render(pageBodyContainer, statistics, RenderPosition.BEFOREEND);
statistics.hide();

newEvent.addEventListener(`click`, () => {
  tripTab.setActiveItem(TabItem.EVENTS);
  statistics.hide();
  tripController.show();
  tripController.onSortTypeReset();
  filterController.onFilterChange(FilterTypes.EVERYTHING);
  filterController.render();
  tripController.createEvent();
});

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

apiWithProvider.getData()
  .then((data) => {
    const {events, destinations, offers} = data;
    pointsModel.setEvents(events);
    render(tripMainElement, new TripInfo(pointsModel.getEventsAll()), RenderPosition.AFTERBEGIN);
    tripController.getData(destinations, offers);
    remove(loading);
    tripController.render();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
