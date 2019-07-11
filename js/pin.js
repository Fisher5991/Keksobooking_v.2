'use strict';

(function () {
  var PIN_WIDTH = 46;
  var PIN_HEIGHT = 46;
  var SHIFT_X = PIN_WIDTH / 2;
  var SHIFT_Y = PIN_HEIGHT;
  var MEASURE = 'px';
  var pinTemplate = document.querySelector('template').content;
  var mapPin = pinTemplate.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var pinActive;

  var getIndex = function (element) {
    for (var i = 0; i < window.map.DOMElements.mapPin.length; i++) { // находим среди найденных DOM-элементов текущий активный пин
      if (window.map.DOMElements.mapPin[i] === element) {
        return i; // возвращаем index активного пина
      }
    }
    return -1;
  }

  var onMapPinClick = function (evt) {
    var activeIndex;
    var currentPin = evt.currentTarget;
    window.togglePopup.close();
    pinActive = currentPin;
    pinActive.classList.add('map__pin--active');
    activeIndex = getIndex(pinActive);
    window.togglePopup.open(activeIndex); // показываем попап с индексом равным активному пину
  }

  window.pin = {
    add: function (ads) {
      var pinsFragment = document.createDocumentFragment();

      for (var i = 0; i < ads.length; i++) {
        var pin = mapPin.cloneNode(true);
        var pinPicture = pin.querySelector('img');
        pin.style.left = ads[i].location.x - SHIFT_X + MEASURE;
        pin.style.top = ads[i].location.y - SHIFT_Y + MEASURE;
        pinPicture.src = ads[i].author.avatar;

        pinsFragment.appendChild(pin);
      }
      mapPins.appendChild(pinsFragment);
    },

    addHandler: function () {
      window.map.DOMElements.mapPin.forEach(function (item) {
        item.addEventListener('click', onMapPinClick);
      });
    }
  }
})();
