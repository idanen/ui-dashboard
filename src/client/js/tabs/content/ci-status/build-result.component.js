(function () {
  'use strict';

  angular.module('ci-site')
    .component('buildResult', {
        controller: BuildResultController,
        bindings: {
          result: '<'
        },
        template: `
        <span>
          <iron-icon class="job-result-icon" icon="{{ $ctrl.resultToIconName() }}"
                     ng-class="'job-result-icon-' + $ctrl.resultToIconName()"></iron-icon>
          <span>{{ $ctrl.result }}</span>
        </span>
        `
      });

  BuildResultController.$inject = ['ResultsToIconNames'];
  function BuildResultController(ResultsToIconNames) {
    this.ResultsToIconNames = ResultsToIconNames;
  }

  BuildResultController.prototype = {
    resultToIconName: function () {
      return this.ResultsToIconNames[this.result] || '';
    }
  };
}());
