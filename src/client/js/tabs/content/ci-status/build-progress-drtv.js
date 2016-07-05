(function () {
  'use strict';

  angular.module('ci-site')
      .component('buildProgress', {
        controller: BuildProgressController,
        bindings: {
          buildName: '<',
          buildNumber: '<',
          buildGroup: '<',
          buildResult: '<'
        },
        template: `
          <div class="build-progress" ng-class="$ctrl.buildResult === 'running' && 'build-progress-running'">
            <div class="sub-build slide-in" ng-repeat="subBuild in $ctrl.subBuilds | orderBy:$ctrl.resultToOrder" uib-tooltip="{{ subBuild.$id }} ({{ subBuild.result }})" ng-class="$ctrl.determineClass(subBuild)">
            </div>
          </div>
        `
      })
      .controller('BuildProgressCtrl', BuildProgressController);

  BuildProgressController.$inject = ['$element', '$timeout', 'ciStatusService', 'firebaseDestroy'];
  function BuildProgressController($element, $timeout, ciStatusService, firebaseDestroy) {
    this.$element = $element;
    this.$timeout = $timeout;
    this.statusService = ciStatusService;
    this.firebaseDestroy = firebaseDestroy;

    this.$element.on('$destroy', () => this.firebaseDestroy.destroy(this.subBuilds));
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
    $onDestroy: function () {
      if (this.subBuilds && _.isFunction(this.subBuilds.$destroy)) {
        this.subBuilds.$destroy();
      }
    },
    getSubBuilds: function () {
      if (this.buildName && this.buildNumber) {
        this.firebaseDestroy.destroy(this.subBuilds);

        this.subBuilds = this.statusService.getJobSubBuilds(this.buildName, this.buildNumber, this.buildGroup);
      }
    },
    resultToOrder: function (subBuild) {
      if (subBuild.result === 'running') {
        return 1;
      }
      return 0;
    },
    determineClass: function (subBuild) {
      var status = {
            SUCCESS: 'build-state-success',
            UNSTABLE: 'build-state-unstable',
            FAILURE: 'build-state-failure',
            ABORTED: 'build-state-aborted'
          }[subBuild.result] || 'build-state-unknown',
          running = subBuild.result === 'running' ? ' build-state-running' : '';
      return `${status}${running}`;
    }
  };
}());