export const createTripDayTemplate = (dateValue, number = 1) => {
  const date = new Date(dateValue).toLocaleDateString(`en-US`, {day: `numeric`, month: `short`});
  const dateTime = new Date().toLocaleDateString(`nl`, {year: `numeric`, month: `2-digit`, day: `2-digit`});
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${number}</span>
        <time class="day__date" datetime="${dateTime}">${date}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};
