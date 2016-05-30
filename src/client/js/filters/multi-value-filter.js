(function () {
  'use strict';

  angular.module('ci-site.filters')
      .filter('multivalue', function () {
        return function (arr, fieldName, values) {
          if (!Array.isArray(arr) || !fieldName || !values) {
            return arr;
          }

          return _.filter(arr, (item) => {
            if (Array.isArray(values)) {
              return _.includes(values, item[fieldName]);
            }
            if (_.isObject(values)) {
              return values[item[fieldName]];
            }
          });
        };
      });
}());
