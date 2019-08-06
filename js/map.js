'use strict';

(function () {
  var MAX_ADS = 5;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var mapPinsElement = document.querySelector('.map__pins');
  var mapWidth = window.utils.getCurrentCoords(mapPinsElement).right - window.utils.getCurrentCoords(mapPinsElement).left;
  var mapHeight = window.utils.getCurrentCoords(mapPinsElement).bottom - window.utils.getCurrentCoords(mapPinsElement).top;
  var MAIN_SHIFT_X = MAIN_PIN_WIDTH / 2;
  var MAIN_SHIFT_Y = MAIN_PIN_HEIGHT;
  var POINTER_HEIGHT = 17; // высота указателя пина
  var FILTERS_ELEMENT_HEIGHT = 50;
  var BOUND_X_MIN = 0;
  var BOUND_X_MAX = mapWidth;
  var BOUND_Y_MIN = 100;
  var BOUND_Y_MAX = mapHeight - FILTERS_ELEMENT_HEIGHT;
  var map = document.querySelector('.map');
  var pinTemplate = document.querySelector('template').content;
  var mapPin = pinTemplate.querySelector('.map__pin');
  var mapPinMain = map.querySelector('.map__pin--main');
  var noticeFormElement = document.querySelector('.notice__form');
  var noticeFormFieldsets = noticeFormElement.querySelectorAll('fieldset');
  var addressInput = noticeFormElement.querySelector('#address');

  //------------------

  var findPinAndPopup = function () {
    window.map.DOMElements.mapPin = map.querySelectorAll('.map__pin:not(.map__pin--main');
    window.map.DOMElements.popup = map.querySelectorAll('.popup');
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  }

  var saveData = function (data) {
    var similarAdsCopy;
    window.filters.transferData(data);
    similarAdsCopy = data.slice();
    window.map.updatePins(similarAdsCopy);
  }

  // первое нажатие на главный пин

  var onMapPinMainFirstMouseup = function () {
    map.classList.remove('map--faded');
    window.backend.load(saveData, errorHandler);
    window.form.makeAvailable();
    mapPinMain.removeEventListener('mouseup', onMapPinMainFirstMouseup);
  }

  var onMapPinMainMousedown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    }

    var offsetX;
    var offsetY;
    var xValue;
    var yValue;

    var onMapPinMainMousemove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: moveEvt.clientX - startCoords.x,
        y: moveEvt.clientY - startCoords.y
      }

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      }

      offsetX = window.utils.getCurrentCoords(mapPinMain).left + shift.x + MAIN_SHIFT_X - window.utils.getCurrentCoords(mapPinsElement).left;
      offsetY = window.utils.getCurrentCoords(mapPinMain).top + shift.y + MAIN_SHIFT_Y / 2;

      if (offsetX >= BOUND_X_MIN && offsetX <= BOUND_X_MAX) {
        xValue = Math.floor(mapPinMain.offsetLeft);
        mapPinMain.style.left = offsetX + 'px';
      }

      if (offsetY >= BOUND_Y_MIN && offsetY <= BOUND_Y_MAX) {
        yValue = Math.ceil(mapPinMain.offsetTop + MAIN_SHIFT_Y / 2 + POINTER_HEIGHT);
        mapPinMain.style.top = offsetY + 'px';
      }

      window.form.changeLocation(xValue, yValue);
    }

    var onMapPinMainMouseup = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMapPinMainMousemove);
      document.removeEventListener('mouseup', onMapPinMainMouseup);
    }

    document.addEventListener('mousemove', onMapPinMainMousemove);
    document.addEventListener('mouseup', onMapPinMainMouseup);
  }

  window.map = {
    DOMElements: {},

    updatePins: function (similarAds) {
      if (similarAds.length > MAX_ADS) {
        similarAds.length = MAX_ADS;
      }
      window.pin.add(similarAds); // добавляем все элементы в разметку
      window.card.add(similarAds);
      findPinAndPopup(); // находим их в DOM
      window.pin.addHandler();
      window.togglePopup.close();
    }
  }

  mapPinMain.addEventListener('mouseup', onMapPinMainFirstMouseup);

  window.form.changeLocation(Math.ceil(mapPinMain.offsetLeft + MAIN_SHIFT_X), Math.ceil(mapPinMain.offsetTop + MAIN_SHIFT_Y));
  window.form.setDefaultSettings();

  mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);
})();
