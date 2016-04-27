(function () {
  'use strict';

  angular.module('tabs')
    .service('buildTestsService', BuildTestsService);

  BuildTestsService.$inject = ['$resource', 'ENV'];
  function BuildTestsService($resource, ENV) {
    this.BuildTests = $resource(`http://${ENV.HOST}:${ENV.PORT}/buildTests/:buildName/:buildNumber`);
  }

  BuildTestsService.prototype = {
    fetch: function (buildName, buildNumber) {
      return this.BuildTests.query({buildName, buildNumber}).$promise;
    }
  };
}());
