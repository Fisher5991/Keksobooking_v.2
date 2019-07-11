'use strict';

(function () {
  var pinActive;

  var onPopupEscPress = function (evt) {
    window.utils.isEscEvent(evt, window.togglePopup.close);
  }

  window.togglePopup = {
    close: function () {
      window.map.DOMElements.popup.forEach(function (item) {
        item.classList.add('hidden');
      });
      if (pinActive) {
        pinActive.classList.remove('map__pin--active');
      }
      document.removeEventListener('keydown', onPopupEscPress);
    },

    open: function (id) {
      window.map.DOMElements.popup[id].classList.remove('hidden');
      document.addEventListener('keydown', onPopupEscPress);
    }
  }
})();
