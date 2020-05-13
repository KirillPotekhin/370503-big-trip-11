const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : `${value}`;
};

export const timeDisplay = (date) => {
  const hours = castTimeFormat(new Date(date).getHours());
  const minutes = castTimeFormat(new Date(date).getMinutes());

  return `${hours}:${minutes}`;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `after`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};
