import AbstractComponent from "./abstract-component.js";

const createTripBoardTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class TripBoard extends AbstractComponent {
  getTemplate() {
    return createTripBoardTemplate();
  }
}
