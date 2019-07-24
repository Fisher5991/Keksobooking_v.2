'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var SUCCESS_CODE = 200;

  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest;
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onSuccess(xhr.response);
      } else {
        onError('Неизвестный статус ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс')
    });

    xhr.timeout = 10000;

    return xhr;
  }

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = setup(onLoad, onError);
      xhr.open('GET', URL + '/data');
      xhr.send();
    },

    upload: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);
      xhr.open('POST', URL);
      xhr.send(data);
    },

    getJSONP: function (cbName) {
      var loader = document.createElement('script');
      loader.src = URL + '/data?callback=' + cbName;
      document.body.appendChild(loader);
    }
  }
})();
