'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var lastTimeout;

  window.utils = {
    generateNumber: function (minNumber, maxNumber) {
      return Math.round(Math.random() * (maxNumber - minNumber)) + minNumber;
    },

    removeAllElements: function (items) {
      [].forEach.call(items, function (item) {
        item.remove();
      });
    },

    isEscEvent: function (evt, cb) {
      if (evt.keyCode === ESC_KEYCODE) {
        cb();
      }
    },

    getCurrentCoords: function (element) {
      var box = element.getBoundingClientRect();

      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
        right: box.right + pageXOffset,
        bottom: box.bottom + pageYOffset
      }
    },

    stopDebounce: function (cb, time, arg) {
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }

      lastTimeout = setTimeout(function () {
        cb(arg);
      }, time);
    }
  }
})();
