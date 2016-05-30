(function () {
  'use strict';

  angular.module('ci-site.filters')
      .filter('percentage', ['$filter', function ($filter) {
        return function (input, decimals) {
          return $filter('number')(input * 100, decimals) + '%';
        };
      }]);
}());

