'use strict';

(function () {
  var MAX_ROOMS = 100;
  var map = document.querySelector('.map');
  var pinTemplate = document.querySelector('template').content;
  var mapPin = pinTemplate.querySelector('.map__pin');
  var mapPinMain = map.querySelector('.map__pin--main');
  var noticeFormElement = document.querySelector('.notice__form');
  var noticeFormFieldsets = noticeFormElement.querySelectorAll('fieldset');
  var addressInput = noticeFormElement.querySelector('#address');
  var titleInput = noticeFormElement.querySelector('#title');
  var priceInput = noticeFormElement.querySelector('#price');
  var timeInSelect = noticeFormElement.querySelector('#timein');
  var timeOutSelect = noticeFormElement.querySelector('#timeout');
  var typeSelect = noticeFormElement.querySelector('#type');
  var roomNumberSelect = noticeFormElement.querySelector('#room_number');
  var capacitySelect = noticeFormElement.querySelector('#capacity');
  var capacityOptions = capacitySelect.querySelectorAll('option');
  var invalidFlag = 0;

  var mapFilterElements = document.querySelectorAll('.map__filter');
  var mapFilterSet = document.querySelector('.map__filter-set');

  var offerValueToMinPrice = {
    'Лачуга': 0,
    'Квартира': 1000,
    'Дом': 5000,
    'Дворец': 10000
  }

  var LimitationInput = {
    'title': {
      'MIN_LENGTH': 30,
      'MAX_LENGTH': 100
    },

    'price': {
      'MIN': 0,
      'DEFAULT': 1000,
      'MAX': 1000000
    }
  }

  var onFieldInput = function (evt) {
    if (evt.target.validity.valid) {
      evt.target.style.border = '1px solid #d9d9d3';
    } else {
      evt.target.style.border = '1px solid red';
    }
  }

  var onFieldInvalid = function (evt) {
    evt.target.style.border = '1px solid red';
    if (!invalidFlag) {
      invalidFlag = 1;
      noticeFormElement.addEventListener('input', onFieldInput, true);
    }
  }

  var onNoticeFormSubmit = function (evt) {
    if (!checkTitleMinLength()) {
      evt.preventDefault();
    }
  }

  var checkTitleMinLength = function () {
    if (+titleInput.value.length < +titleInput.minLength) {
      titleInput.style.border = '1px solid red';
      titleInput.setCustomValidity('Имя короткое: оно должно состоять минимум из' + titleInput.minLength + ' символов');
      return false;
    } else {
      titleInput.style.border = '1px solid #d9d9d3';
      titleInput.setCustomValidity('');
      return true;
    }
  }

  var onSelectTimeInChange = function (evt) {
    var selectedValue = evt.target.value;
    var dependentElement = timeOutSelect.querySelector('[value="' + selectedValue + '"]');
    dependentElement.selected = true;
  }

  var onSelectTimeOutChange = function (evt) {
    var selectedValue = evt.target.value;
    var dependentElement = timeInSelect.querySelector('[value="' + selectedValue + '"]');
    dependentElement.selected = true;
  }

  var onSelectTypeChange = function (evt) {
    var selectedText = evt.target.selectedOptions[0].textContent;
    priceInput.min = offerValueToMinPrice[selectedText];
  }

  var actualizeRoomNumberSelectOption = function (selectedValue) {
    [].forEach.call(capacityOptions, function (option) {
      if ((+selectedValue < +option.value) || ((+selectedValue === MAX_ROOMS) && (+option.value !== 0)) || ((+selectedValue !== MAX_ROOMS) && (+option.value === 0))) {
        option.disabled = true;
        option.selected = false;
      } else {
        option.disabled = false;
        option.selected = true;
      }
    });
  }

  var onSelectRoomNumberChange = function (evt) {
    var selectedValue = evt.target.value;
    actualizeRoomNumberSelectOption(selectedValue);
  }

  var synchronizeSelect = function () {
    var initialSelectedTypeText = typeSelect.selectedOptions[0].textContent;
    var initialSelectedRoomNumber = roomNumberSelect.selectedOptions[0].value;
    priceInput.min = offerValueToMinPrice[initialSelectedTypeText];
    actualizeRoomNumberSelectOption(initialSelectedRoomNumber);
    timeInSelect.addEventListener('change', onSelectTimeInChange);
    timeOutSelect.addEventListener('change', onSelectTimeOutChange);
    typeSelect.addEventListener('change', onSelectTypeChange);
    roomNumberSelect.addEventListener('change', onSelectRoomNumberChange);
  }

  window.form = {
    makeAvailable: function () {
      noticeFormElement.classList.remove('notice__form--disabled');
      noticeFormFieldsets.forEach(function (fieldset) {
        fieldset.disabled = false;
      });
      [].forEach.call(mapFilterElements, function (filter) {
        filter.disabled = false;
      });
      mapFilterSet.disabled = false;
      addressInput.readOnly = true;
      addressInput.required = true;
      titleInput.minLength = '' + LimitationInput.title.MIN_LENGTH;
      titleInput.maxLength = '' + LimitationInput.title.MAX_LENGTH;
      titleInput.required = true;
      priceInput.type = 'number';
      priceInput.min = '' + LimitationInput.price.MIN;
      priceInput.max = '' + LimitationInput.price.MAX;
      priceInput.value = '' + LimitationInput.price.DEFAULT;
      priceInput.required = true;
      synchronizeSelect();
      noticeFormElement.action = 'https://js.dump.academy/keksobooking';
      noticeFormElement.method = 'post';
      noticeFormElement.enctype = 'multipart/form-data';
    },

    setDefaultSettings: function () {
      [].forEach.call(mapFilterElements, function (filter) {
        filter.disabled = true;
      });

      mapFilterSet.disabled = true;

      // блокируем поля формы
      noticeFormFieldsets.forEach(function (fieldset) {
        fieldset.disabled = true;
      });

      noticeFormElement.addEventListener('invalid', onFieldInvalid, true);
      noticeFormElement.addEventListener('submit', onNoticeFormSubmit);
    }
  }
})();
