(function () {
  'use strict';

  angular.module('tabs')
      .directive('buildsList', buildsListFactory)
      .controller('BuildsListCtrl', BuildsListController);

  function buildsListFactory() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        parentName: '<',
        builds: '<'
      },
      controller: 'BuildsListCtrl',
      controllerAs: 'buildsList',
      template: `
        <ul class="builds-list" ng-init="buildsList.init()">
          <li ng-repeat="build in buildsList.displayBuilds">
            <a ng-href="http://mydtbld0022.hpeswlab.net:8080/jenkins/job/MaaS-SAW-USB-master-SingleNode-Mock/{{build.buildNumber}}/" target="_blank">{{build.buildNumber}}</a>
            <build-progress build-name="buildsList.parentName" build-number="build.buildNumber" sub-builds="build.subBuilds"></build-progress>
          </li>
        </ul>
      `
    };
  }

  function BuildsListController() {
    this.displayBuilds = [];
  }

  BuildsListController.prototype = {
    init: function () {
      if (this.builds) {
        this.displayBuilds = [];
        _.forEach(this.builds, (build, buildNumber) => {
          this.displayBuilds.push(_.extend({}, build, {buildNumber: buildNumber}));
        });
        this.displayBuilds = _.sortByOrder(this.displayBuilds, ['buildNumber'], ['desc']);
      }
    }
  };
}());
