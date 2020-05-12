const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : `${value}`;
};

export const timeDisplay = (date) => {
  const hours = castTimeFormat(new Date(date).getHours());
  const minutes = castTimeFormat(new Date(date).getMinutes());

  return `${hours}:${minutes}`;
};