(function () {
  'use strict';

  angular.module('ci-site')
      .filter('classNameOrder', classNameOrderFactory);

  classNameOrderFactory.$inject = ['$filter'];
  function classNameOrderFactory($filter) {
    return function (tests) {
      return _.sortBy(tests, (test) => {
        return $filter('className')(test.testClassName || test._id.testClassName);
      });
    };
  }
}());
