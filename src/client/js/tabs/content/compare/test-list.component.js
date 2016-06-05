(function () {
  'use strict';

  angular.module('ci-site')
      .component('testList', {
        controller: TestListController,
        templateUrl: 'js/tabs/content/compare/test-list-tmpl.html',
        bindings: {
          tests: '<'
        }
      });

  function TestListController() {}
}());
