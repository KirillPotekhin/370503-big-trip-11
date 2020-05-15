import AbstractComponent from "./abstract-component.js";

const createTripInfoTemplate = (events) => {
  const eventsSort = events.slice().sort((a, b) => a.startTime - b.startTime);
  const startPoint = eventsSort[0];
  const endPoint = eventsSort[eventsSort.length - 1];

  let infoTitleContent;
  if (eventsSort.length === 1) {
    infoTitleContent = startPoint.city;
  } else if (eventsSort.length === 2) {
    infoTitleContent = `${startPoint.city} \u2014 ${endPoint.city}`;
  } else if (eventsSort.length === 3) {
    infoTitleContent = `${startPoint.city} \u2014 ${eventsSort[eventsSort.length - 2].city} \u2014 ${endPoint.city}`;
  } else if (!eventsSort.length) {
    infoTitleContent = ``;
  } else {
    infoTitleContent = `${startPoint.city} \u2014 ... \u2014 ${endPoint.city}`;
  }

  const infoDatesStart = eventsSort.length ? (new Date(startPoint.startTime).toLocaleDateString(`en-US`, {month: `short`, day: `numeric`})) : ``;

  const formatDatesEnd = eventsSort.length && new Date(startPoint.startTime).getMonth() === new Date(endPoint.endTime).getMonth() ? {day: `numeric`} : {month: `short`, day: `numeric`};
  const infoDatesEnd = eventsSort.length ? new Date(endPoint.endTime).toLocaleDateString(`en-US`, formatDatesEnd) : ``;

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
