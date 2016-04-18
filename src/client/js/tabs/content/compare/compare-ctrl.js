(function () {
  'use strict';
  
  angular.module('tabs')
    .controller('CompareCtrl', CompareController);

  CompareController.$inject = ['build', 'toBuild', 'ciStatusService'];
  function CompareController(build, toBuild, ciStatusService) {
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
    leftSelectionChanged: function (prop, value) {
      console.log('left selection before update: ', this.selectedLeft[prop]);
      this.selectedLeft[prop] = value;
      console.log('left selection after update: ', this.selectedLeft[prop]);
    },
    rightSelectionChanged: function (prop, value) {
      console.log('right selection before update: ', this.selectedRight[prop]);
      this.selectedRight[prop] = value;
      console.log('right selection after update: ', this.selectedRight[prop]);
    },
    triggerChange: function () {
      this.selectedLeft = {name: 'MaaS-SAW-USB-master-SingleNode-Mock', number: '30'};
    }
  };
}());