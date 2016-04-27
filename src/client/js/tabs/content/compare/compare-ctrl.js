(function () {
  'use strict';
  
  angular.module('tabs')
    .controller('CompareCtrl', CompareController);

  CompareController.$inject = ['build', 'toBuild', '$state', 'ciStatusService'];
  function CompareController(build, toBuild, $state, ciStatusService) {
    this.build = build;
    this.toBuild = toBuild;
    this.$state = $state;
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
      this.updateState();
    },
    rightSelectionChanged: function (prop, value) {
      this.selectedRight[prop] = value;
      this.updateState();
    },
    updateState: function () {
      this.$state.go('compare', {
        buildName: this.selectedLeft.name,
        buildNumber: this.selectedLeft.number,
        toBuildName: this.selectedRight.name,
        toBuildNumber: this.selectedRight.number
      });
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