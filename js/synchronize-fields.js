'use strict';

(function () {
  window.synchronizeFields = function (target, dependent, sync, extra) {
    sync(target, dependent, extra);
  }
})();
