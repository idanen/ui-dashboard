(function () {
  'use strict';
  
  angular.module('tabs')
    .controller('CompareCtrl', CompareController);

  CompareController.$inject = ['build', 'toBuild', '$scope', 'ciStatusService'];
  function CompareController(build, toBuild, $scope, ciStatusService) {
    this.build = build;
    this.toBuild = toBuild;
    this.title = `Comparing build ${this.build.name}#${this.build.number} and ${this.toBuild.name}#${this.toBuild.number}`;
    this.availableBuilds = {
      masters: ciStatusService.getJobs(),
      team: []
    };
    this.selectedLeft = {};
    this.selectedRight = {};
  }

  CompareController.prototype = {
    leftSelectionChanged: function (selected) {
      console.log('new left selection: ', selected);
    },
    rightSelectionChanged: function (selected) {
      console.log('new right selection: ', selected);
    }
  };
}());