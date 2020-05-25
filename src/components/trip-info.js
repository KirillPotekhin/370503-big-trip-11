import AbstractComponent from "./abstract-component.js";
import Moment from "moment";

const createTripInfoTemplate = (events) => {
  const eventsSort = events.slice().sort((a, b) => a.startTime - b.startTime);
  const startPoint = eventsSort[0];
  const endPoint = eventsSort[eventsSort.length - 1];

  let infoTitleContent;
  if (eventsSort.length === 1) {
    infoTitleContent = startPoint.destination.name;
  } else if (eventsSort.length === 2) {
    infoTitleContent = `${startPoint.destination.name} \u2014 ${endPoint.destination.name}`;
  } else if (eventsSort.length === 3) {
    infoTitleContent = `${startPoint.destination.name} \u2014 ${eventsSort[eventsSort.length - 2].destination.name} \u2014 ${endPoint.destination.name}`;
  } else if (!eventsSort.length) {
    infoTitleContent = ``;
  } else {
    infoTitleContent = `${startPoint.destination.name} \u2014 ... \u2014 ${endPoint.destination.name}`;
  }

  const dateStart = new Moment(startPoint.startTime);
  const dateEnd = new Moment(endPoint.endTime);
  const infoDatesStart = eventsSort.length ? (dateStart.format(`MMM D`)) : ``;

  const formatDatesEnd = eventsSort.length && new Moment(dateStart).isSame(dateEnd, `month`) ? `D` : `MMM D`;
  const infoDatesEnd = eventsSort.length ? dateEnd.format(formatDatesEnd) : ``;

  const infoDates = eventsSort.length ? `${infoDatesStart} \u2014 ${infoDatesEnd}` : ``;

  const infoCost = eventsSort.length ? eventsSort.reduce((acc, it) => acc + it.price, 0) : 0;

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${infoTitleContent}</h1>

        <p class="trip-info__dates">${infoDates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${infoCost}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
