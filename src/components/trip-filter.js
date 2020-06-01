import AbstractComponent from "./abstract-component.js";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createTripFilterMarkup = (filter) => {
  const {name, checked: isChecked} = filter;
  const filterCapitalLetter = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${name}">${filterCapitalLetter}</label>
    </div>`
  );
};

const createTripFilterTemplate = (filters) => {
  const tripFiltersMarkup = filters.map((filter) => createTripFilterMarkup(filter)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${tripFiltersMarkup}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class TripFilter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createTripFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
