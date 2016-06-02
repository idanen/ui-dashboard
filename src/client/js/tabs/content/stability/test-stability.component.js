(function () {
  'use strict';

  angular.module('ci-site')
      .component('testStability', {
        controller: TestStabilityController,
        templateUrl: 'js/tabs/content/stability/test-stability-tmpl.html',
        bindings: {
          testResults: '<'
        }
      });

  function TestStabilityController() {

  }
}());
