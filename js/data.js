'use strict';
(function () {
  var ADS_NUMBER = 8;
  var MIN_X_COORD = 300;
  var MAX_X_COORD = 900;
  var MIN_Y_COORD = 100;
  var MAX_Y_COORD = 500;
  var MIN_OFFER_PRICE = 1000;
  var MAX_OFFER_PRICE = 1000000;
  var MIN_NUMBER_ROOMS = 1;
  var MAX_NUMBER_ROOMS = 5;
  var MIN_NUMBER_GUESTS = 1;
  var MAX_NUMBER_GUESTS = 3;

  var ADDRESS_TEMPLATE = 'img/avatars/user';
  var FORMAT = '.png';
  var offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var offerTypes = ['flat', 'house', 'bungalo'];
  var offerTypesValues = ['Квартира', 'Дом', 'Бунгало'];
  var checkinTimes = ['12:00', '13:00', '14:00'];
  var checkoutTimes = ['12:00', '13:00', '14:00'];
  var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var imageId = 0;
  var similarAds = []; // все похожие объявления

  var countImageId = function () {
    imageId++;
    return imageId < 10 ? '0' + imageId : imageId;
  }

  var getTitle = function (titles) {
    var randomNumber = window.utils.generateNumber(0, titles.length - 1);
    var title = titles[randomNumber];
    titles.splice(randomNumber, 1);
    return title;
  }

  var getFeatures = function (features) {
    var randomNumber;
    var featuresListCopy = featuresList.slice();
    var newFeaturesList = [];
    newFeaturesList.length = window.utils.generateNumber(1, featuresListCopy.length);
    for (var i = 0; i < newFeaturesList.length; i++) {
      randomNumber = window.utils.generateNumber(0, featuresListCopy.length - 1);
      newFeaturesList[i] = featuresListCopy[randomNumber];
      featuresListCopy.splice(randomNumber, 1);
    }
    return newFeaturesList;
  }

  // генерируем данные
  window.data = {
    generateAds: function () {
      var offerTitlesCopy = offerTitles.slice();

      for (var i = 0; i < ADS_NUMBER; i++) {
        var locationX = window.utils.generateNumber(MIN_X_COORD, MAX_X_COORD);
        var locationY = window.utils.generateNumber(MIN_Y_COORD, MAX_Y_COORD);
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
            'price': window.utils.generateNumber(MIN_OFFER_PRICE, MAX_OFFER_PRICE),
            'type': offerTypes[window.utils.generateNumber(0, offerTypes.length - 1)],
            'rooms': window.utils.generateNumber(MIN_NUMBER_ROOMS, MAX_NUMBER_ROOMS),
            'guests': window.utils.generateNumber(MIN_NUMBER_GUESTS, MAX_NUMBER_GUESTS),
            'checkin': checkinTimes[window.utils.generateNumber(0, checkinTimes.length - 1)],
            'checkout': checkoutTimes[window.utils.generateNumber(0, checkoutTimes.length - 1)],
            'features': getFeatures(featuresList),
            'description': '',
            'photos': ''
          }
        };
        similarAds.push(advert);
      }

      return similarAds;
    }
  }
})();
