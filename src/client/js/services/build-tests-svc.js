(function () {
  'use strict';

  angular.module('ci-site')
    .service('buildTestsService', BuildTestsService);

  BuildTestsService.$inject = ['$resource', 'ENV'];
  function BuildTestsService($resource, ENV) {
    this.BuildTests = $resource(`${ENV.PROTOCOL}://${ENV.HOST}:${ENV.PORT}/buildTests/:buildName/:buildNumber/:onlyFailed`, {}, {
      specific: {
        method: 'POST',
        isArray: true
      }
    });
    this.LastFailedTests = $resource(`${ENV.PROTOCOL}://${ENV.HOST}:${ENV.PORT}/failedOfLastBuilds/:buildName/:buildCount/:startFromNumber`, {}, {
      specific: {
        method: 'GET',
        isArray: true
      }
    });
    this.Stability = $resource(`${ENV.PROTOCOL}://${ENV.HOST}:${ENV.PORT}/stability/:buildName/:buildCount/:startFromNumber`, {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
    this.Compare = $resource(`${ENV.PROTOCOL}://${ENV.HOST}:${ENV.PORT}/compareBuildTests/:buildName/:buildNumber/:toBuildName/:toBuildNumber`, {}, {
      get: {
        method: 'GET',
        isArray: false
      }
    });
  }

  BuildTestsService.prototype = {
    fetch: function (buildName, buildNumber, onlyFailed = true) {
      return this.BuildTests.query({buildName, buildNumber, onlyFailed}).$promise;
    },
    fetchCompare: function (buildName, buildNumber, toBuildName, toBuildNumber) {
      return this.Compare.get({buildName, buildNumber, toBuildName, toBuildNumber}).$promise;
    },
    fetchSpecific: function (buildName, buildNumber, tests) {
      // console.log('sending request to get tests ', tests);
      return this.BuildTests.specific({buildName, buildNumber}, tests).$promise;
    },
    fetchLastFailedOfBuild: function (buildName, startFromNumber, buildCount = 10) {
      return this.LastFailedTests.query({buildName, buildCount, startFromNumber}).$promise;
    },
    getStability: function (buildName, startFromNumber, buildCount = 10) {
      return this.Stability.query({buildName, buildCount, startFromNumber}).$promise;
    },
    prepareTestsForSending: function (tests) {
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
