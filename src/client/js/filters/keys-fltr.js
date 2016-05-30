(function () {
  'use strict';

  angular.module('ci-site.filters')
      .filter('keys', function () {
        return function (object) {
          if (!_.isObject(object)) {
            return [];
          }

          return Object.keys(object).join(', ');
        };
      });
}());
