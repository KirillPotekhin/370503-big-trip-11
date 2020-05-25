import {TYPES} from "../const.js";

const mockStorage = {
  cities: [
    `Rome`,
    `Madrid`,
    `Paris`,
    `Amsterdam`,
    `Berlin`,
    `Prague`,
    `Stockholm`
  ],
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
  getPictures(i) {
    return [
      {
        src: `http://picsum.photos/248/152?r=${Math.random()}`,
        description: `${this.cities[i]} parliament building`,
      }, {
        src: `http://picsum.photos/248/152?r=${Math.random()}`,
        description: `${this.cities[i]} parliament building`,
      }, {
        src: `http://picsum.photos/248/152?r=${Math.random()}`,
        description: `${this.cities[i]} parliament building`,
      }, {
        src: `http://picsum.photos/248/152?r=${Math.random()}`,
        description: `${this.cities[i]} parliament building`,
      }, {
        src: `http://picsum.photos/248/152?r=${Math.random()}`,
        description: `${this.cities[i]} parliament building`,
      }
    ];
  },
};

const destinations = [];
for (let i = 0; i < mockStorage.cities.length; i++) {
  const destination = {
    description: mockStorage.description.split(`. `, Math.ceil(Math.random() * 6)),
    pictures: mockStorage.getPictures(i),
    name: mockStorage.cities.slice().splice(i, 1)[0],
  };
  destinations.push(destination);
}

const createOffers = (arr) => {
  const options = [];
  arr.forEach((it) => {
    const option = {
      type: it,
      offers: [],
    };
    for (let i = 0; i < Math.floor(Math.random() * 6); i++) {
      option.offers.push(
          {
            titile: [
              `Add luggage`,
              `Switch to comfort class`,
              `Add meal`,
              `Choose seats`,
              `Travel by train`
            ][Math.floor(Math.random() * 5)],
            price: Math.floor(Math.random() * 50),
          }
      );
    }
    options.push(option);
  }
  );
  return options;
};

const offersList = createOffers(TYPES);

const generateEvent = () => {
  const typeChoice = [
    `taxi`,
    `bus`,
    `train`,
    `ship`,
    `transport`,
    `drive`,
    `flight`,
    `check-in`,
    `sightseeing`,
    `restaurant`
  ][Math.floor(Math.random() * 10)];
  const optionChoice = offersList.filter((it) => it.type === typeChoice);
  const startTimeValue = Date.now() - 24 * 60 * 60 * 1000 * 2 + 24 * 60 * Math.floor(Math.random() * 300) * 1000;
  return {
    type: typeChoice,
    startTime: startTimeValue,
    id: String(new Date() + Math.random()),
    endTime: startTimeValue + 24 * Math.floor(Math.random() * 100) * 60 * 1000,
    destination: destinations[Math.ceil(Math.random() * (destinations.length - 1))],
    price: Math.floor(Math.random() * 250),
    offers: optionChoice[0].offers.slice(0, [Math.ceil(Math.random() * (optionChoice[0].offers.length - 1))]),
    isFavorite: Boolean(Math.round(Math.random())),
  };
};

const generateEvents = (count) => {
  return Array.from({length: count}, () => generateEvent());
};

export {generateEvent, generateEvents, destinations, offersList};
