(function () {
  'use strict';

  angular.module('ci-site.filters')
      .filter('multivalue', function () {
        return function (arr, fieldName, values) {
          if (!Array.isArray(arr) || !fieldName || !values) {
            return arr;
          }

          return _.filter(arr, (item) => {
            let itemValue = (fieldName === '.') ? item : item[fieldName];
            if (Array.isArray(values)) {
              return _.includes(values, itemValue);
            }
            if (_.isObject(values)) {
              return values[itemValue];
            }
          });
        };
      });
}());
