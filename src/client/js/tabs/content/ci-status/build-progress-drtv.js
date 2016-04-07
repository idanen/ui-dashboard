(function () {
  'use strict';

  angular.module('tabs')
      .directive('buildProgress', buildProgressFactory)
      .controller('BuildProgressCtrl', BuildProgressController);

  function buildProgressFactory() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'BuildProgressCtrl',
      controllerAs: 'buildProgress',
      bindToController: {
        buildName: '<',
        buildNumber: '<',
        subBuilds: '<',
        teamId: '<?'
      },
      template: `
      <div class="build-progress">
        <div class="sub-build" ng-repeat="(subBuildName, subBuild) in buildProgress.subBuilds" title="{{ subBuildName }}" ng-class="buildProgress.determineClass(subBuild)"></div>
      </div>`
    };
  }

  BuildProgressController.$inject = ['ciStatusService', '$scope'];
  function BuildProgressController(ciStatusService, $scope) {
    this.statusService = ciStatusService;

    $scope.$watch(() => {
      return this.buildName;
    }, this.getSubBuilds.bind(this));
  }

  BuildProgressController.prototype = {
    getSubBuilds: function () {
      if (this.buildName && this.buildNumber) {
        this.subBuilds = this.statusService.getJobSubBuilds(this.buildName, this.buildNumber, this.teamId);
      }
    },
    determineClass: function (subBuild) {
      var status = {
            SUCCESS: 'build-state-success',
            UNSTABLE: 'build-state-unstable',
            FAILURE: 'build-state-failure',
            ABORTED: 'build-state-aborted'
          }[subBuild.result] || 'build-state-unknown',
          running = subBuild.phase !== 'FINISHED' ? ' build-state-running' : '';
      return `${status}${running}`;
    }
  };
}());