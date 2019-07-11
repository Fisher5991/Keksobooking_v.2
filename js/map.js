'use strict';

(function () {
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

  // первое нажатие на главный пин

  var onMapPinMainFirstMouseup = function () {
    map.classList.remove('map--faded');
    window.form.changeLocation(); // ставим текущие координаты
    window.pin.add(similarAds); // добавляем все элементы в разметку
    window.card.add(similarAds);
    findPinAndPopup(); // находим их в DOM
    window.pin.addHandler();
    window.form.makeAvailable();
    window.togglePopup.close();
    mapPinMain.removeEventListener('mouseup', onMapPinMainFirstMouseup);
  }

  var similarAds = window.data.generateAds();
  window.map = {}; // объект с массивом всех пинов и попапов
  window.map.DOMElements = {}

  mapPinMain.addEventListener('mouseup', onMapPinMainFirstMouseup);

  window.form.setDefaultSettings();
})();
