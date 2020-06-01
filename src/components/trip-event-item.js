import AbstractComponent from "./abstract-component.js";

const createTripEventItemTemplate = () => {
  return (
    `<li class="trip-events__item"></li>`
  );
};

export default class TripEventItem extends AbstractComponent {
  getTemplate() {
    return createTripEventItemTemplate();
  }
}
