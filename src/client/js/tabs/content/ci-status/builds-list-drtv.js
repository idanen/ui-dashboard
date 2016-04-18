(function () {
  'use strict';

  angular.module('tabs')
      .component('buildSelector', {
        controller: BuildSelectorController,
        bindings: {
          builds: '<',
          selected: '<',
          onChange: '&'
        },
        template: `
          <div>
            <label>Select build and number</label>
            <select name="selectedBuildName"
                    ng-model="$ctrl.name"
                    ng-change="$ctrl.onChange({prop: 'name', value: $ctrl.name})">
              <option ng-repeat="(buildId, build) in $ctrl.builds track by buildId" value="{{ buildId }}" ng-bind="buildId"></option>
            </select>
            <span>#</span>
            <select name="selectedBuildNumber"
                    ng-model="$ctrl.number"
                    ng-change="$ctrl.onChange({prop: 'number', value: $ctrl.number})">
              <option ng-repeat="(buildNumber, buildResult) in $ctrl.builds[$ctrl.selected.name].builds track by buildNumber" value="{{ buildNumber }}" ng-bind="buildNumber"></option>
            </select>
          </div>
        `
      });

  BuildSelectorController.$inject = [];
  function BuildSelectorController() {
  }

  BuildSelectorController.prototype = {
    $onInit: function () {
      this.name = this.selected.name;
      this.number = this.selected.number;
    },
    $onChanges: function (changes) {
      if (changes.selected && changes.selected.currentValue.name) {
        this.name = changes.selected.currentValue.name;
      }
      if (changes.selected && changes.selected.currentValue.number) {
        this.number = changes.selected.currentValue.number;
      }
      if (changes.builds && changes.builds.currentValue) {
        let buildId = Object.keys(changes.builds.currentValue)[0],
            buildNumber = Object.keys(changes.builds.currentValue[buildId].builds)[0];
        this.name = buildId;
        this.number = buildNumber;
      }
    }
  };
}());
