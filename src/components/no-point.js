import AbstractComponent from "./abstract-component.js";

const createNoPointTeamplate = () => `<p class="trip-events__msg">Click New Event to create your first point</p>`;

export default class NoPoint extends AbstractComponent {
  getTemplate() {
    return createNoPointTeamplate();
  }
}
