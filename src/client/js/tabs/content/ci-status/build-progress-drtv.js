(function () {
  'use strict';

  angular.module('tabs')
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
            <div class="sub-build slide-in" ng-repeat="subBuild in $ctrl.subBuilds" uib-tooltip="{{ subBuild.$id }}" ng-class="$ctrl.determineClass(subBuild)">
              <span class="sub-build-result">{{ subBuild.result }}</span>
            </div>
          </div>
        `
      })
      .controller('BuildProgressCtrl', BuildProgressController);

  BuildProgressController.$inject = ['$element', '$timeout', 'ciStatusService'];
  function BuildProgressController($element, $timeout, ciStatusService) {
    this.$element = $element;
    this.$timeout = $timeout;
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
    $onDestroy: function () {
      if (this.subBuilds && _.isFunction(this.subBuilds.$destroy)) {
        this.subBuilds.$destroy();
      }
    },
    getSubBuilds: function () {
      if (this.buildName && this.buildNumber) {
        let unwatch = angular.noop;
        if (this.subBuilds && _.isFunction(this.subBuilds.$destroy)) {
          unwatch();
          this.subBuilds.$destroy();
        }

        this.subBuilds = this.statusService.getJobSubBuilds(this.buildName, this.buildNumber, this.buildGroup);
        unwatch = this.subBuilds.$watch(this.updateSubBuildsSizes.bind(this));
        this.$element.on('$destroy', unwatch);
      }
    },
    updateSubBuildsSizes: function () {
      // TODO (idan): find a better way (the timeout is used just because the DOM elements are rendered (a tick) after the data arrives)
      this.$timeout(() => {
        return this.$element.find('.sub-build').length;
      }, 50)
          .then((length) => {
            this.$element.find('.sub-build').css('width', (100 / length) + '%');
          });
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