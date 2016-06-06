(function () {
  'use strict';

  angular.module('ci-site.filters')
      .filter('duration', function () {
        return function (duration, format) {
          if (angular.isNumber(duration)) {
            return moment.duration(duration).format(format || 'hh:mm:ss');
          }
          return duration;
        };
      });
}());
