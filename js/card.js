'use strict';

(function () {
  var map = document.querySelector('.map');
  var pinTemplate = document.querySelector('template').content;
  var mapFiltersContainer = map.querySelector('.map__filters-container');

  var offerTypeToValue = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
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
    window.utils.removeAllElements(featuresElements);
    return availableFeaturesFragment;
  }

  var onCloseBtnClick = function (evt) {
    evt.preventDefault();
    window.togglePopup.close();
  }

  window.card = {
    add: function (ads, elements) {
      var mapCard = pinTemplate.querySelector('.map__card');

      for (var i = 0; i < ads.length; i++) {
        var similarAd = ads[i];
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
  }
})();
