(function () {
  'use strict';

  angular.module('ci-site')
      .filter('orderByFailed', orderByFailedFactory);

  orderByFailedFactory.$inject = ['$filter'];
  function orderByFailedFactory($filter) {
    return (testWraps, descending) => {
      if (!testWraps) {
        return [];
      }
      // Using `concat()` to create a new array instead of mutating the existing
      let descendingStr = descending ? '-' : '+';
      return $filter('orderBy')(testWraps, `${descendingStr}totalFailed`);
    };
  }
}());
