'use strict';

(function () {
  var TIMEOUT = 500;
  var mapFilters = document.querySelector('.map__filters');
  var housingTypeSelect = mapFilters.querySelector('#housing-type');
  var housingPriceSelect = mapFilters.querySelector('#housing-price');
  var housingRoomsSelect = mapFilters.querySelector('#housing-rooms');
  var housingGuestsSelect = mapFilters.querySelector('#housing-guests');
  var housingFeaturesElement = mapFilters.querySelector('#housing-features');
  var featuresCheckboxes = housingFeaturesElement.querySelectorAll('input[name="features"]');

  var similarAds = [];
  var similarAdsCopy;

  var PriceLimit = {
    'low': {
      MAX: 10000
    },

    'middle': {
      MIN: 10000,
      MAX: 50000
    },

    'high': {
      MIN: 50000
    }
  }

  var filtrateHousing = function (target, item) {
    similarAdsCopy = similarAdsCopy.filter(function (it) {
      if (target.value === 'any') {
        return true;
      }
      return it.offer[item] + '' === target.value;
    });
  }

  var filtrateHousingPrice = function (target) {
    similarAdsCopy = similarAdsCopy.filter(function (it) {
      switch (target.value) {
        case 'low':
          return it.offer.price <= PriceLimit.low.MAX;
          break;

        case 'middle':
          return it.offer.price < PriceLimit.middle.MAX && it.offer.price > PriceLimit.middle.MIN;
          break;

        case 'high':
          return it.offer.price >= PriceLimit.high.MIN;
          break;

        default:
          return true;
      }
    });
  }

  var filtrateFeatures = function () {
    [].forEach.call(featuresCheckboxes, function (checkbox) {
      if (checkbox.checked) {
        similarAdsCopy = similarAdsCopy.filter(function (it) {
          return it.offer.features.indexOf(checkbox.value) >= 0;
        });
      }
    });
  }

  var startFiltering = function () {
    similarAdsCopy = similarAds.slice();
    filtrateHousing(housingTypeSelect, 'type');
    filtrateHousingPrice(housingPriceSelect);
    filtrateHousing(housingRoomsSelect, 'rooms');
    filtrateHousing(housingGuestsSelect, 'guests');
    filtrateFeatures();
    window.map.updatePins(similarAdsCopy);
  }

  var onMapFiltersChange = function () {
    window.utils.stopDebounce(startFiltering, TIMEOUT);
  }

  mapFilters.addEventListener('change', onMapFiltersChange);

  window.filters = {
    transferData: function (data) {
      similarAds = data;
    }
  }
})();
