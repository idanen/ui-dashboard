(function () {
  'use strict';

  angular.module('ci-site')
    .component('buildResult', {
        controller: BuildResultController,
        bindings: {
          result: '<',
          showLabel: '<?'
        },
        template: `
        <span>
          <iron-icon class="job-result-icon" icon="{{ $ctrl.resultToIconName() }}"
                     ng-class="'job-result-icon-' + $ctrl.resultToIconName()"
                     uib-tooltip="{{ $ctrl.result }}"></iron-icon>
          <span ng-show="$ctrl.showLabel">{{ $ctrl.result }}</span>
        </span>
        `
      });

  BuildResultController.$inject = ['ResultsToIconNames'];
  function BuildResultController(ResultsToIconNames) {
    this.ResultsToIconNames = ResultsToIconNames;
  }

  BuildResultController.prototype = {
    resultToIconName: function () {
      return this.ResultsToIconNames[this.result] || 'Unknown';
    }
  };
}());
