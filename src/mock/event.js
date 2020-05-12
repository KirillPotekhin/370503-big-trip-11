import {TYPES} from "../const.js";

const createOptions = (arr) => {
  const options = [];
  arr.forEach((it) => {
    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
      options.push(
          {
            type: it,
            titile: [
              `Add luggage`,
              `Switch to comfort class`,
              `Add meal`,
              `Choose seats`,
              `Travel by train`
            ][Math.floor(Math.random() * 5)],
            name: [
              `luggage`,
              `comfort`,
              `meal`,
              `seats`,
              `train`
            ][Math.floor(Math.random() * 5)],
            price: Math.floor(Math.random() * 50),
            isOption: Boolean(Math.round(Math.random())),
          }
      );
    }
  }
  );
  return options;
};

const generateEvent = () => {
  const options = createOptions(TYPES);
  const typeChoice = [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`,
    `Check-in`,
    `Sightseeing`,
    `Restaurant`
  ][Math.floor(Math.random() * 10)];
  const optionChoice = () => options.filter((it) => it.type === typeChoice);
  const startTimeValue = Date.now() - 24 * 60 * 60 * 1000 * 2 + 24 * 60 * Math.floor(Math.random() * 300) * 1000;
  return {
    type: typeChoice,
    city: [
      `Rome`,
      `Madrid`,
      `Paris`,
      `Amsterdam`,
      `Berlin`,
      `Prague`,
      `Stockholm`
    ][Math.floor(Math.random() * 7)],
    startTime: startTimeValue,
    endTime: startTimeValue + 24 * Math.floor(Math.random() * 100) * 60 * 1000,
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `, Math.floor(Math.random() * 7)),
    photos: [
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
    ],
    price: Math.floor(Math.random() * 250),
    optionAll: optionChoice(),
    isFavorite: Boolean(Math.round(Math.random())),
  };
};

const generateEvents = (count) => {
  return Array.from({length: count}, () => generateEvent());
};

export {generateEvent, generateEvents};
