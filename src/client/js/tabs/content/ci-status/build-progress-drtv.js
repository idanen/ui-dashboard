(function () {
  'use strict';

  angular.module('tabs')
      .component('buildProgress', {
        controller: BuildProgressController,
        bindings: {
          buildName: '<',
          buildNumber: '<'
        },
        template: `
          <div class="build-progress">
            <div class="sub-build slide-in" ng-repeat="(subBuildName, subBuild) in $ctrl.subBuilds" title="{{ subBuildName }}" ng-class="$ctrl.determineClass(subBuild)"></div>
          </div>
        `
      })
      .controller('BuildProgressCtrl', BuildProgressController);

  BuildProgressController.$inject = ['ciStatusService'];
  function BuildProgressController(ciStatusService) {
    this.statusService = ciStatusService;
  }

  BuildProgressController.prototype = {
    $onInit: function () {
      this.getSubBuilds();
    },
    $onChanges: function (changes) {
      if (changes && changes.buildNumber) {
        this.getSubBuilds();
      }
    },
    getSubBuilds: function () {
      if (this.buildName && this.buildNumber) {
        this.subBuilds = this.statusService.getJobSubBuilds(this.buildName, this.buildNumber, 'teams');
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