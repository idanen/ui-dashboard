(function () {
  'use strict';

  angular.module('ui-dash.filters', [])
      .filter('releasever', function () {
        return function (releaseVer) {
          if (releaseVer && _.isString(releaseVer) && /release-\d+_\d+/.test(releaseVer)) {
            return releaseVer.replace(/(.*release-\d+)_(\d+.*)/g, '$1.$2');
          }

          return releaseVer;
        };
      });
}());

