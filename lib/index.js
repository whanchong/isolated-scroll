'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var lastY = void 0;

var calculateHeight = function calculateHeight(el) {
  // Source adapted from: http://youmightnotneedjquery.com/#outer_height_with_margin
  var height = el.offsetHeight;

  var _getComputedStyle = getComputedStyle(el),
      marginTop = _getComputedStyle.marginTop,
      marginBottom = _getComputedStyle.marginBottom;

  height += parseInt(marginTop, 10) + parseInt(marginBottom, 10);
  return height;
};

var prevent = function prevent(event) {
  if (!event.cancelable) return;
  event.stopPropagation();
  event.preventDefault();
  event.returnValue = false;
  return false;
};

var getEventCoordinates = function getEventCoordinates(event) {
  var moveEvent = event.touches && event.touches[0] || event;
  return {
    clientX: moveEvent.clientX,
    clientY: moveEvent.clientY
  };
};

var getDelta = function getDelta(event) {
  var type = event.type,
      detail = event.detail,
      wheelDelta = event.wheelDelta;


  if (type === 'DOMMouseScroll') {
    return detail * -40;
  } else if (type === 'mousewheel') {
    return wheelDelta;
  } else {
    var clientY = getEventCoordinates(event).clientY;
    return clientY - lastY;
  }
};

// Source adapted from: http://stackoverflow.com/a/16324762
var makeHandler = function makeHandler(el) {
  return function (event) {
    var type = event.type;


    if (type === 'touchstart' || type === 'pointerdown') {
      lastY = getEventCoordinates(event).clientY;
      return;
    }

    var scrollTop = el.scrollTop,
        scrollHeight = el.scrollHeight;

    var height = calculateHeight(el);
    var delta = getDelta(event);
    var up = delta > 0;

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
};

exports.default = function (el) {
  var handler = makeHandler(el);

  var addEvent = (el.addEventListener || el.attachEvent).bind(el);
  var removeEvent = (el.removeEventListener || el.detachEvent).bind(el);

  addEvent('mousewheel', handler);
  addEvent('DOMMouseScroll', handler);
  addEvent('touchstart', handler);
  addEvent('touchmove', handler);
  addEvent('pointerdown', handler);
  addEvent('pointermove', handler);

  return function () {
    removeEvent('mousewheel', handler);
    removeEvent('DOMMouseScroll', handler);
    removeEvent('touchstart', handler);
    removeEvent('touchmove', handler);
    removeEvent('pointerdown', handler);
    removeEvent('pointermove', handler);
  };
};

module.exports = exports['default'];