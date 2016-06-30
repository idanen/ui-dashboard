(function () {
  'use strict';

  angular.module('ci-site')
      .service('firebaseDestroy', FirebaseDestroy);

  function FirebaseDestroy() {}

  FirebaseDestroy.prototype = {
    destroySingle: function (toDestroy) {
      if (_.isObject(toDestroy) && _.isFunction(toDestroy.$destroy)) {
        toDestroy.$destroy();
        return true;
      }
      return false;
    },
    /**
     * Destroys a `$firebaseObject` or `$firebaseArray` using angularfire's `$destroy`.
     * Use this as a safety method when destructing a directive/component for example.
     * @param {Object|Array} toDestroy The Firebase object/array to destroy. Can receive an array of such also.
     * @param {boolean} [multi] Send `true` if the input is an array of $firebaseObject/$firebaseArray.
     * @return {boolean} `true` if the object was destroyed, `false` otherwise
     */
    destroy: function (toDestroy, multi) {
      let result = true;
      if (multi && !Array.isArray(toDestroy)) {
        throw new Error('Received multi but the object to destroy is not an array. Did you mean `destroySingle`?');
      }
      if (multi) {
        toDestroy.forEach((destructCandidate) => {
          result = result && this.destroySingle(destructCandidate);
        });
        return result;
      }

      return this.destroySingle(toDestroy);
    }
  };
}());
