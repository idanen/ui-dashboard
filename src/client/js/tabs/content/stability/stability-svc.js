(function () {
  'use strict';

  angular.module('ci-site')
      .service('stabilityService', StabilityService);

  function StabilityService() {
  }

  StabilityService.prototype = {
    reFormatTestsStructure: function (tests) {
      let testsByClass = [];
      tests.forEach((test) => {
        let testByClass = {};
        testByClass.testClass = test.testClassName || test._id && test._id.testClassName;
        testByClass.methods = _.map(test.tests, 'testName');
        testsByClass.push(testByClass);
      });
      return testsByClass;
    }
  };
}());
