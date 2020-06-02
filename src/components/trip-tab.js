import AbstractComponent from "./abstract-component.js";

export const TabItem = {
  EVENTS: `trip-tabs__table`,
  STATISTICS: `trip-tabs__statistic`,
};

const createTripTabTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a id="trip-tabs__table" class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a id="trip-tabs__statistic" class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class TripTab extends AbstractComponent {
  getTemplate() {
    return createTripTabTemplate();
  }

  setActiveItem(tabItem) {
    const item = document.querySelector(`#${tabItem}`);
    const tabsAll = document.querySelectorAll(`.trip-tabs__btn`);
    const itemNotActive = Array.from(tabsAll).filter((it) => it.id !== tabItem)[0];

    if (item) {
      itemNotActive.classList.remove(`trip-tabs__btn--active`);
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  setOnClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const tabItem = evt.target.id;
      this.setActiveItem(tabItem);
      handler(tabItem);
    });
  }
}
