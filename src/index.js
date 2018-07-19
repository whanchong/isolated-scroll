let lastY;

const calculateHeight = el => {
  // Source adapted from: http://youmightnotneedjquery.com/#outer_height_with_margin
  let height = el.offsetHeight;
  const { marginTop, marginBottom } = getComputedStyle(el);

  height += parseInt(marginTop, 10) + parseInt(marginBottom, 10);
  return height;
};

const prevent = (event) => {
  if (!event.cancelable) return;
  event.stopPropagation();
  event.preventDefault();
  event.returnValue = false;
  return false;
};

const getEventCoordinates = (event) => {
  const moveEvent = (event.touches && event.touches[0]) || event;
  return {
    clientX: moveEvent.clientX,
    clientY: moveEvent.clientY
  };
};

const getDelta = (event) => {
  const { type, detail, wheelDelta } = event;

  if (type === 'DOMMouseScroll') {
    return detail * -40;
  } else if (type === 'mousewheel') {
    return wheelDelta;
  } else {
    const clientY = getEventCoordinates(event).clientY;
    return clientY - lastY;
  }
};

// Source adapted from: http://stackoverflow.com/a/16324762
const makeHandler = el => event => {
  const { type } = event;

  if (type === 'touchstart' || type === 'pointerdown') {
    lastY = getEventCoordinates(event).clientY;
    return;
  }

  const { scrollTop, scrollHeight } = el;
  const height = calculateHeight(el);
  const delta = getDelta(event);
  const up = delta > 0;

  if (type === 'touchmove' || type === 'pointermove') {
    lastY = getEventCoordinates(event).clientY;
  }

  if (delta) {
    if (!up && -delta > scrollHeight - height - scrollTop) {
      el.scrollTop = scrollHeight;
      return prevent(event);
    } else if (up && delta > scrollTop) {
      el.scrollTop = 0;
      return prevent(event);
    }
  }
};

export default el => {
  const handler = makeHandler(el);

  const addEvent = (el.addEventListener || el.attachEvent).bind(el);
  const removeEvent = (el.removeEventListener || el.detachEvent).bind(el);

  addEvent('mousewheel', handler);
  addEvent('DOMMouseScroll', handler);
  addEvent('touchstart', handler);
  addEvent('touchmove', handler);
  addEvent('pointerdown', handler);
  addEvent('pointermove', handler);

  return () => {
    removeEvent('mousewheel', handler);
    removeEvent('DOMMouseScroll', handler);
    removeEvent('touchstart', handler);
    removeEvent('touchmove', handler);
    removeEvent('pointerdown', handler);
    removeEvent('pointermove', handler);
  };
};
