(function () {
  'use strict';

  angular.module('ci-site')
      .filter('stabilityFilter', function () {
        return function stabilityFilter(testWraps, limit) {
          if (!testWraps || !Array.isArray(testWraps) || isNaN(limit) || limit < 0 || limit > 1) {
            console.log('filter aborted', testWraps, limit);
            return testWraps;
          }

          return _.filter(testWraps, (testWrap) => {
            return testWrap.tests.every((test) => test.stabilityResult && test.stabilityResult.stability >= limit);
          });
        };
      });
}());
