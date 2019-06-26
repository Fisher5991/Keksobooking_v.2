'use strict';

var ADS_NUMBER = 8;
var ADDRESS_TEMPLATE = 'img/avatars/user';
var FORMAT = '.png';
var MIN_OFFER_PRICE = 1000;
var MAX_OFFER_PRICE = 1000000;
var MIN_NUMBER_ROOMS = 1;
var MAX_NUMBER_ROOMS = 5;
var MIN_NUMBER_GUESTS = 1;
var MAX_NUMBER_GUESTS = 3;
var MIN_X_COORD = 300;
var MAX_X_COORD = 900;
var MIN_Y_COORD = 100;
var MAX_Y_COORD = 500;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 62;
var PIN_WIDTH = 46;
var PIN_HEIGHT = 46;
var MAIN_SHIFT_X = MAIN_PIN_WIDTH / 2;
var MAIN_SHIFT_Y = MAIN_PIN_HEIGHT;
var SHIFT_X = PIN_WIDTH / 2;
var SHIFT_Y = PIN_HEIGHT;
var MEASURE = 'px';
var POINTER_HEIGHT = 16; // высота указателя пина
var PIN_MAIN_HEIGHT;
var imageId = 0;
var ESC_KEYCODE = 27;
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

var MAX_ROOMS = 100;

var offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var offerTypes = ['flat', 'house', 'bungalo'];
var offerTypesValues = ['Квартира', 'Дом', 'Бунгало']
var offerTypeToValue = {
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
}
var offerValueToMinPrice = {
  'Лачуга': 0,
  'Квартира': 1000,
  'Дом': 5000,
  'Дворец': 10000
}
var checkinTimes = ['12:00', '13:00', '14:00'];
var checkoutTimes = ['12:00', '13:00', '14:00'];
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var pinActive;
var similarAds = []; // все похожие объявления
var DOMElement = {}; // объект с массивом всех пинов и попапов

// -------------------
  var mapFilterElements = document.querySelectorAll('.map__filter');
  var mapFilterSet = document.querySelector('.map__filter-set');

  [].forEach.call(mapFilterElements, function (filter) {
    filter.disabled = true;
  });

  mapFilterSet.disabled = true;

// -------------------

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('template').content;
var mapPin = pinTemplate.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var noticeFormElement = document.querySelector('.notice__form');
var noticeFormFieldsets = noticeFormElement.querySelectorAll('fieldset');
var inputAddress = noticeFormElement.querySelector('#address');
PIN_MAIN_HEIGHT = mapPinMain.offsetHeight; // высота главного пина
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

var onMapPinClick = function (evt) {
  var activeIndex;
  var currentPin = evt.currentTarget;
  hidePopup();
  pinActive = currentPin;
  pinActive.classList.add('map__pin--active');
  activeIndex = getIndex(pinActive);
  showPopup(activeIndex); // показываем попап с индексом равным активному пину
}

var getIndex = function (element) {
  for (var i = 0; i < DOMElement.mapPinElements.length; i++) { // находим среди найденных DOM-элементов текущий активный пин
    if (DOMElement.mapPinElements[i] === element) {
      return i; // возвращаем index активного пина
    }
  }
  return -1;
}

window.util = {
  isEscEvent: function (evt, cb) {
    if (evt.keyCode === ESC_KEYCODE) {
      cb();
    }
  }
}

var onCloseBtnClick = function (evt) {
  evt.preventDefault();
  hidePopup();
}

var onPopupEscPress = function (evt) {
  window.util.isEscEvent(evt, hidePopup);
}

var showPopup = function (id) {
  DOMElement.popupElements[id].classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
}

var hidePopup = function () {
  DOMElement.popupElements.forEach(function (item) {
    item.classList.add('hidden');
  });
  if (pinActive) {
    pinActive.classList.remove('map__pin--active');
  }
  document.removeEventListener('keydown', onPopupEscPress);
}
// ---------------------
var generateNumber = function (minNumber, maxNumber) {
  return Math.round(Math.random() * (maxNumber - minNumber)) + minNumber;
};

//------------------

var countImageId = function () {
  imageId++;
  return imageId < 10 ? '0' + imageId : imageId;
}

var getTitle = function (titles) {
  var randomNumber = generateNumber(0, titles.length - 1);
  var title = titles[randomNumber];
  titles.splice(randomNumber, 1);
  return title;
}

var getFeatures = function (features) {
  var randomNumber;
  var featuresListCopy = featuresList.slice();
  var newFeaturesList = [];
  newFeaturesList.length = generateNumber(1, featuresListCopy.length);
  for (var i = 0; i < newFeaturesList.length; i++) {
    randomNumber = generateNumber(0, featuresListCopy.length - 1);
    newFeaturesList[i] = featuresListCopy[randomNumber];
    featuresListCopy.splice(randomNumber, 1);
  }
  return newFeaturesList;
}

var generateAds = function (quantity) {
  var offerTitlesCopy = offerTitles.slice();

  for (var i = 0; i < quantity; i++) {
    var locationX = generateNumber(MIN_X_COORD, MAX_X_COORD);
    var locationY = generateNumber(MIN_Y_COORD, MAX_Y_COORD);
    var advert = {
      'author': {
        'avatar': ADDRESS_TEMPLATE + countImageId() + FORMAT
      },
      'location': {
        'x': locationX,
        'y': locationY
      },
      'offer': {
        'title': getTitle(offerTitlesCopy),
        'address': locationX + ', ' + locationY,
        'price': generateNumber(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
        'type': offerTypes[generateNumber(0, offerTypes.length - 1)],
        'rooms': generateNumber(MIN_NUMBER_ROOMS, MAX_NUMBER_ROOMS),
        'guests': generateNumber(MIN_NUMBER_GUESTS, MAX_NUMBER_GUESTS),
        'checkin': checkinTimes[generateNumber(0, checkinTimes.length - 1)],
        'checkout': checkoutTimes[generateNumber(0, checkoutTimes.length - 1)],
        'features': getFeatures(featuresList),
        'description': '',
        'photos': ''
      }
    };
    similarAds.push(advert);
  }
}

var addPins = function () {
  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < similarAds.length; i++) {
    var pin = mapPin.cloneNode(true);
    var pinPicture = pin.querySelector('img');
    pin.style.left = similarAds[i].location.x - PIN_WIDTH / 2 + MEASURE;
    pin.style.top = similarAds[i].location.y - PIN_HEIGHT + MEASURE;
    pinPicture.src = similarAds[i].author.avatar;

    pinsFragment.appendChild(pin);
  }
  mapPins.appendChild(pinsFragment);
}

var removeAllElements = function (items) {
  items.forEach(function (item) {
    item.remove();
  });
}

var addAds = function () {
  var mapCard = pinTemplate.querySelector('.map__card');
  for (var i = 0; i < similarAds.length; i++) {
    var similarAd = similarAds[i];
    var newCard = mapCard.cloneNode(true);
    var popupFeatures = newCard.querySelector('.popup__features');
    var allFeaturesElements = popupFeatures.querySelectorAll('.feature');
    var availableFeatures = createFeaturesFragment(similarAd.offer.features, popupFeatures, allFeaturesElements);
    var cardCloseBtn = newCard.querySelector('.popup__close');
    newCard.querySelector('.popup__title').textContent = similarAd.offer.title;
    newCard.querySelector('.popup__text--address').textContent = similarAd.offer.address;
    newCard.querySelector('.popup__text--price').innerHTML = similarAd.offer.price + ' &#x20bd;/ночь';
    newCard.querySelector('.popup__type').textContent = offerTypeToValue[similarAd.offer.type] || 'Неизвестно';
    newCard.querySelector('.popup__text--capacity').textContent = similarAd.offer.rooms + ' комнаты для ' + similarAd.offer.guests + ' гостей';
    newCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + similarAd.offer.checkin + ', выезд до ' + similarAd.offer.checkout;
    popupFeatures.appendChild(availableFeatures);
    newCard.querySelector('.popup__description').textContent = similarAd.offer.description;
    newCard.querySelector('.popup__avatar').src = similarAd.author.avatar;
    cardCloseBtn.addEventListener('click', onCloseBtnClick);
    map.insertBefore(newCard, mapFiltersContainer);
  }
}

var createFeaturesFragment = function (features, featuresParent, featuresElements) {
  var availableFeaturesFragment = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    for (var j = 0; j < featuresElements.length; j++) {
      if (featuresElements[j].classList.contains('feature--' + features[i])) {
        availableFeaturesFragment.appendChild(featuresElements[j].cloneNode());
      }
    }
  }
  removeAllElements(featuresElements);
  return availableFeaturesFragment;
}

var findPinAndPopupElements = function () {
  DOMElement.mapPinElements = map.querySelectorAll('.map__pin:not(.map__pin--main');
  DOMElement.popupElements = map.querySelectorAll('.popup');
};

var addHandler = function (collection) {
  collection.forEach(function (item) {
    item.addEventListener('click', onMapPinClick);
  });
};

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

var setDefaultSettings = function () {
  addHandler(DOMElement.mapPinElements);
  noticeFormElement.classList.remove('notice__form--disabled');
  noticeFormFieldsets.forEach(function (fieldset) {
    fieldset.disabled = false;
  });
  [].forEach.call(mapFilterElements, function (filter) {
    filter.disabled = false;
  });
  mapFilterSet.disabled = false;
  hidePopup();
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
};

var changeLocation = function () {
  inputAddress.value = Math.floor(mapPinMain.offsetLeft + MAIN_SHIFT_X) + ', ' + Math.floor(mapPinMain.offsetTop + MAIN_SHIFT_Y + POINTER_HEIGHT);
}

// первое нажатие на главный пин

var onMapPinMainFirstMouseup = function () {
  map.classList.remove('map--faded');
  changeLocation(); // ставим текущие координаты
  addPins(); // добавляем все элементы в разметку
  addAds();
  findPinAndPopupElements(); // находим их в DOM
  setDefaultSettings();
  mapPinMain.removeEventListener('mouseup', onMapPinMainFirstMouseup);
  noticeFormElement.addEventListener('invalid', onFieldInvalid, true);
  noticeFormElement.addEventListener('submit', onNoticeFormSubmit);
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

mapPinMain.addEventListener('mouseup', onMapPinMainFirstMouseup);

// блокируем поля формы
noticeFormFieldsets.forEach(function (fieldset) {
  fieldset.disabled = true;
});

// изначальные координаты главного пина (без указателя)
inputAddress.value = Math.ceil(mapPinMain.offsetLeft + MAIN_SHIFT_X) + ', ' + Math.ceil(mapPinMain.offsetTop + MAIN_SHIFT_Y);

// генерируем данные
generateAds(ADS_NUMBER);
