import {FilterTypes} from "../const.js";

export const getFutureEvents = (events, date) => {
  return events.filter((event) => {
    const startTime = new Date(event.startTime);
    return startTime > date;
  });
};

export const getPastEvents = (events, date) => {
  return events.filter((event) => {
    const endTime = new Date(event.endTime);
    return endTime < date;
  });
};

export const getEventsByFilter = (events, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterTypes.EVERYTHING:
      return events;
    case FilterTypes.FUTURE:
      return getFutureEvents(events, nowDate);
    case FilterTypes.PAST:
      return getPastEvents(events, nowDate);
  }
  return events;
};
