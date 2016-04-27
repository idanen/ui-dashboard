(function () {
  'use strict';
  
  angular.module('tabs')
    .controller('CompareCtrl', CompareController);

  CompareController.$inject = ['build', 'toBuild', '$state', '$q', 'ciStatusService', 'buildTestsService'];
  function CompareController(build, toBuild, $state, $q, ciStatusService, buildTestsService) {
    this.build = build;
    this.toBuild = toBuild;
    this.$state = $state;
    this.$q = $q;
    this.buildTestsService = buildTestsService;
    this.title = `Comparing build ${this.build.name}#${this.build.number} and ${this.toBuild.name}#${this.toBuild.number}`;
    this.availableBuilds = {
      masters: ciStatusService.getJobs(),
      team: []
    };
    this.selectedLeft = {};
    this.selectedRight = {};

    this.availableBuilds.masters.$loaded()
      .then(this.selectFirstOptions.bind(this))
      .then(this.getTests.bind(this));
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
    },
    getTests: function () {
      var promises = [];
      promises.push(this.buildTestsService.fetch(this.build.name, this.build.number));
      promises.push(this.buildTestsService.fetch(this.toBuild.name, this.toBuild.number));

      this.$q.all(promises).then((tests) => {
        this.leftTests = tests[0];
        this.rightTests = tests[1];
      });
    }
  };
}());