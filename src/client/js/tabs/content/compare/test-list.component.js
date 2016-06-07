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

  TestListController.$inject = ['$filter', '$element', 'JENKINS_BASE_URL'];
  function TestListController($filter, $element, JENKINS_BASE_URL) {
    this.openedTests = {};
    this.$filter = $filter;
    this.$element = $element;
    this.JENKINS_BASE_URL = JENKINS_BASE_URL;
  }

  TestListController.prototype = {
    toggleOpen: function (testName) {
      this.openedTests[testName] = !this.openedTests[testName];
    },
    buildJenkinsLink: function (buildName, buildNumber) {
      let buildNameFiltered = this.$filter('releasever')(buildName);
      return `${this.JENKINS_BASE_URL}${buildNameFiltered}/${buildNumber}`;
    }
  };
}());
