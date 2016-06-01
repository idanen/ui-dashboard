(function () {
  'use strict';

  angular.module('ci-site')
      .filter('stabilityFilter', function () {
        return function (tests, limit) {
          let idxToRemove = [];

          if (!tests || !Array.isArray(tests) || isNaN(limit) || limit < 0 || limit > 1) {
            return tests;
          }

          return tests.map((test) => {
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

            if (test.methods.length === 0) {
              // TODO idanen: remove nulls in the end (use [].filter(Boolean))
              return null;
            }

            return test;
          });
        };
      });
}());
