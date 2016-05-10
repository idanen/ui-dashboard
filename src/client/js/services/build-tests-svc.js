(function () {
  'use strict';

  angular.module('tabs')
    .service('buildTestsService', BuildTestsService);

  BuildTestsService.$inject = ['$resource', 'ENV'];
  function BuildTestsService($resource, ENV) {
    this.BuildTests = $resource(`http://${ENV.HOST}:${ENV.PORT}/buildTests/:buildName/:buildNumber/:onlyFailed`, {}, {
      specific: {
        method: 'POST',
        isArray: true
      }
    });
    this.Stability = $resource(`http://${ENV.HOST}:${ENV.PORT}/stability/:buildName/:buildCount`, {}, {
      query: {
        method: 'POST',
        isArray: true
      }
    });
  }

  BuildTestsService.prototype = {
    fetch: function (buildName, buildNumber, onlyFailed = true) {
      return this.BuildTests.query({buildName, buildNumber, onlyFailed}).$promise;
    },
    fetchSpecific: function (buildName, buildNumber, tests) {
      console.log('sending request to get tests ', tests);
      return this.BuildTests.specific({buildName, buildNumber}, tests).$promise;
    },
    getStability: function (buildName, tests, buildCount = 10) {
      return this.Stability.query({buildName, buildCount}, tests).$promise;
    }
  };
}());
