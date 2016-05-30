(function () {
  'use strict';

  angular.module('ci-site.filters')
    .filter('className', function () {
        return function (fullQuallifiedName) {
          if (!fullQuallifiedName) {
            return '';
          }
          var index = fullQuallifiedName.lastIndexOf('.');
          if (index > -1) {
            return fullQuallifiedName.substring(index + 1);
          }
          return fullQuallifiedName;
        };
      });
}());

