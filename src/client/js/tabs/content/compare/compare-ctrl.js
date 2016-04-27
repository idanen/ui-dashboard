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

    this.availableBuilds.masters.$loaded()
      .then(this.selectFirstOptions.bind(this));
  }

  CompareController.prototype = {
    leftSelectionChanged: function (prop, value) {
      this.selectedLeft[prop] = value;
    },
    rightSelectionChanged: function (prop, value) {
      this.selectedRight[prop] = value;
    },
    selectFirstOptions: function () {
      if (this.build) {
        this.selectedLeft = {
          name: this.build.name,
          number: this.build.number
        };
      }
      if (this.toBuild && this.toBuild.name && this.toBuild.number) {
        this.selectedRight = {
          name: this.toBuild.name,
          number: this.toBuild.number
        };
      } else {
        this.selectedRight = {
          name: this.build.name,
          number: this.build.number - 1
        };
      }
    }
  };
}());