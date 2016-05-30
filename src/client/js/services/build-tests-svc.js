(function () {
  'use strict';

  angular.module('ci-site')
    .service('buildTestsService', BuildTestsService);

  BuildTestsService.$inject = ['$resource', 'ENV'];
  function BuildTestsService($resource, ENV) {
    this.BuildTests = $resource(`http://${ENV.HOST}:${ENV.PORT}/buildTests/:buildName/:buildNumber/:onlyFailed`, {}, {
      specific: {
        method: 'POST',
        isArray: true
      }
    });
    this.Stability = $resource(`http://${ENV.HOST}:${ENV.PORT}/stability/:buildName/:buildCount/:startFromNumber`, {}, {
      query: {
        method: 'POST',
        isArray: true
      }
    });
    this.Compare = $resource(`http://${ENV.HOST}:${ENV.PORT}/compareBuildTests/:buildName/:buildNumber/:toBuildName/:toBuildNumber`, {}, {
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
    getStability: function (buildName, tests, startFromNumber, buildCount = 10) {
      return this.Stability.query({buildName, buildCount, startFromNumber}, tests).$promise;
    }
  };
}());
