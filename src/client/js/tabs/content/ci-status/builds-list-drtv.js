(function () {
  'use strict';

  angular.module('tabs')
      .directive('buildSelector', buildSelectorFactory)
      .controller('BuildSelectorCtrl', BuildSelectorController);

  function buildSelectorFactory() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        builds: '<',
        selected: '<',
        onChange: '&'
      },
      controller: 'BuildSelectorCtrl',
      controllerAs: 'buildSelector',
      link: linkFn,
      template: `
        <div>
          <label>Select build and number</label>
          <select name="selectedBuildName" ng-model="buildSelector.selected.name" ng-options="buildId as buildId for (buildId, build) in buildSelector.builds track by buildId" ng-change="buildSelector.onChange(buildSelector.selected)"></select>
          <span>#</span>
          <select name="selectedBuildName" ng-model="buildSelector.selected.number" ng-options="buildNumber as buildNumber for (buildNumber, buildResult) in buildSelector.builds[buildSelector.selected.name].builds" ng-change="buildSelector.onChange(buildSelector.selected)"></select>
        </div>
      `
    };

    function linkFn($scope, $element, $attrs, $ctrl) {
      $element.find('paper-listbox').on('iron-select', function (evt) {
        var currentElement = evt.target;
        if (evt.target.classList.contains('build-name-selector')) {
          $ctrl.selectedName = currentElement.selectedItem;
        } else if (evt.target.classList.contains('build-number-selector')) {
          $ctrl.selectedBuild = $ctrl.builds[$ctrl.selectedName].builds[currentElement.selectedItem];
        }
      });
    }
  }

  BuildSelectorController.$inject = ['ciStatusService'];
  function BuildSelectorController(ciStatusService) {
    this.displayBuilds = [];
    this.ciStatusService = ciStatusService;
  }

  BuildSelectorController.prototype = {
    init: function () {

    }
  };
}());
