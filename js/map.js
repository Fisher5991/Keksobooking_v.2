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
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var SHIFT_X = PIN_WIDTH / 2;
var SHIFT_Y = PIN_HEIGHT;
var MEASURE = 'px';
var imageId = 0;

var offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var offerTypes = ['flat', 'house', 'bungalo'];
var offerTypesValues = ['Квартира', 'Дом', 'Бунгало']
var checkinTimes = ['12:00', '13:00', '14:00'];
var checkoutTimes = ['12:00', '13:00', '14:00'];
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var similarAds = [];

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('template').content;
var pin = pinTemplate.querySelector('.map__pin');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapPins = document.querySelector('.map__pins');

var generateNumber = function (minNumber, maxNumber) {
  return Math.round(Math.random() * (maxNumber - minNumber)) + minNumber;
};

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
  var newFeaturesList = [];
  newFeaturesList.length = generateNumber(1, featuresList.length);
  for (var i = 0; i < newFeaturesList.length; i++) {
    randomNumber = generateNumber(0, features.length - 1);
    newFeaturesList[i] = features[randomNumber];
    features.splice(randomNumber, 1);
  }
  return newFeaturesList;
}

var generateAds = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    var offerTitlesCopy = offerTitles.slice();
    var featuresListCopy = featuresList.slice();
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
        'features': getFeatures(featuresListCopy),
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
    var mapPin = pin.cloneNode(true);
    var pinPicture = mapPin.querySelector('img');
    console.log(similarAds[i].location.x, similarAds[i].location.y);
    mapPin.style.left = similarAds[i].location.x - PIN_WIDTH / 2 + MEASURE;
    mapPin.style.top = similarAds[i].location.y - PIN_HEIGHT + MEASURE;
    console.log(mapPin.style.left, mapPin.style.top);
    pinPicture.src = similarAds[i].author.avatar;

    pinsFragment.appendChild(mapPin);
  }
  mapPins.appendChild(pinsFragment);
}

var getHousingType = function (offerType) {
  switch (offerType) {
    case offerTypes[0]:
      return offerTypesValues[0];
    case offerTypes[1]:
      return offerTypesValues[1];
    case offerTypes[2]:
      return offerTypesValues[2];
    default:
      return 'Неизвестно';
  }
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
    var allFeaturesElements = popupFeatures.querySelectorAll('.popup__feature');
    var availableFeatures = createFeaturesFragment(similarAd.offer.features, popupFeatures, allFeaturesElements);
    newCard.querySelector('.popup__title').textContent = similarAd.offer.title;
    newCard.querySelector('.popup__text--address').textContent = similarAd.offer.address;
    newCard.querySelector('.popup__text--price').innerHTML = similarAd.offer.price + ' &#x20bd;/ночь';
    newCard.querySelector('.popup__type').textContent = getHousingType(similarAd.offer.type);
    newCard.querySelector('.popup__text--capacity').textContent = similarAd.offer.rooms + ' комнаты для ' + similarAd.offer.guests + ' гостей';
    newCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + similarAd.offer.checkin + ', выезд до ' + similarAd.offer.checkout;
    popupFeatures.appendChild(availableFeatures);
    newCard.querySelector('.popup__description').textContent = similarAd.offer.description;
    newCard.querySelector('.popup__avatar').src = similarAd.author.avatar;
    map.insertBefore(newCard, mapFiltersContainer);
  }
}

var createFeaturesFragment = function (features, featuresParent, featuresElements) {
  var availableFeaturesFragment = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    for (var j = 0; j < featuresElements.length; j++) {
      if (featuresElements[j].classList.contains('popup__feature--' + features[i])) {
        availableFeaturesFragment.appendChild(featuresElements[j].cloneNode());
      }
    }
  }
  removeAllElements(featuresElements);
  return availableFeaturesFragment;
}

generateAds(ADS_NUMBER);
addPins();
addAds();

map.classList.remove('map--faded');
