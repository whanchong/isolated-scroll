'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var calculateHeight = function calculateHeight(el) {
  // Source adapted from: http://youmightnotneedjquery.com/#outer_height_with_margin
  var height = el.offsetHeight;

  var _getComputedStyle = getComputedStyle(el),
      marginTop = _getComputedStyle.marginTop,
      marginBottom = _getComputedStyle.marginBottom;

  height += parseInt(marginTop, 10) + parseInt(marginBottom, 10);
  return height;
};

// Source adapted from: http://stackoverflow.com/a/16324762
var makeHandler = function makeHandler(el) {
  return function (event) {
    var scrollTop = el.scrollTop,
        scrollHeight = el.scrollHeight;
    var type = event.type,
        detail = event.detail,
        wheelDelta = event.wheelDelta;

    var height = calculateHeight(el);
    var delta = type === 'DOMMouseScroll' ? detail * -40 : wheelDelta;
    var up = delta > 0;

    var prevent = function prevent() {
      event.stopPropagation();
      event.preventDefault();
      event.returnValue = false;

      return false;
    };

    if (!up && -delta > scrollHeight - height - scrollTop) {
      el.scrollTop = scrollHeight;
      return prevent();
    } else if (up && delta > scrollTop) {
      el.scrollTop = 0;
      return prevent();
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
  addEvent('pointerdown', handler);

  return function () {
    removeEvent('mousewheel', handler);
    removeEvent('DOMMouseScroll', handler);
    removeEvent('touchstart', handler);
    removeEvent('pointerdown', handler);
  };
};

module.exports = exports['default'];