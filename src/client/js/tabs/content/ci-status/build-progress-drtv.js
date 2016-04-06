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

  BuildProgressController.$inject = ['ciStatusService'];
  function BuildProgressController(ciStatusService) {
    this.statusService = ciStatusService;
  }

  BuildProgressController.prototype = {
    getSubBuilds: function () {
      if (this.buildName && this.buildNumber) {
        this.statusService.getJob(this.buildName, this.teamId)
            .then((parentBuild) => {
              this.subBuilds = parentBuild.builds[this.buildNumber].subBuilds;
            });
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