(function () {
  'use strict';

  angular.module('ci-site')
      .component('testList', {
        controller: TestListController,
        templateUrl: 'js/tabs/content/compare/test-list-tmpl.html',
        bindings: {
          tests: '<',
          stabilityCount: '<'
        }
      });

  function TestListController() {
    this.openedTests = {};
  }

  TestListController.prototype = {
    toggleOpen: function (testName) {
      this.openedTests[testName] = !this.openedTests[testName];
    }
  };
}());
