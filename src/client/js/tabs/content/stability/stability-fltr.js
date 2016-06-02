(function () {
  'use strict';

  angular.module('ci-site')
      .filter('stabilityFilter', function () {
        return function stabilityFilter(tests, limit) {
          let mapped;

          if (!tests || !Array.isArray(tests) || isNaN(limit) || limit < 0 || limit > 1) {
            console.log('filter aborted', tests, limit);
            return tests;
          }

          mapped = tests.map((test) => {
            let testsToFilter = [];
            if (!test.results) {
              return test;
            }

            _.forEach(test.results, (result) => {
              if (result.stability < limit) {
                testsToFilter.push(result.testName);
              }
            });

            testsToFilter.forEach((testToFilter) => {
              var idx = test.methods.indexOf(testToFilter);
              test.methods = test.methods.slice(idx, idx + 1);
              delete test.results[testToFilter];
            });

            if (_.isEmpty(test.results)) {
              return null;
            }

            return test;
          });

          return mapped.filter(Boolean);
        };
      });
}());
