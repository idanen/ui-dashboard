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
    this.selected = {
      left: {
        group: 'masters'
      },
      right: {
        group: 'masters'
      }
    };

    this.availableBuilds.masters.$loaded()
      .then(this.selectFirstOptions.bind(this))
      .then(this.getTests.bind(this));
  }

  CompareController.prototype = {
    selectionChanged: function (side, prop, value) {
      this.selected[side][prop] = value;
      this.getTests();
    },
    updateState: function () {
      this.$state.go('compare', {
        buildName: this.selected.left.name,
        buildNumber: this.selected.left.number,
        toBuildName: this.selected.right.name,
        toBuildNumber: this.selected.right.number
      });
    },
    selectFirstOptions: function () {
      if (this.build) {
        this.selected.left = {
          group: 'masters',
          name: this.build.name,
          number: this.build.number
        };
      }
      if (this.toBuild && this.toBuild.name && this.toBuild.number) {
        this.selected.right = {
          group: 'masters',
          name: this.toBuild.name,
          number: this.toBuild.number
        };
      } else {
        this.selected.right = {
          group: 'masters',
          name: this.build.name,
          number: this.build.number - 1
        };
      }
    },
    getTests: function () {
      var promises = [];
      promises.push(this.buildTestsService.fetch(this.selected.left.name, this.selected.left.number, false));
      promises.push(this.buildTestsService.fetch(this.selected.right.name, this.selected.right.number, false));

      this.$q.all(promises).then((tests) => {
        this.leftTests = tests[0];
        this.rightTests = tests[1];

        // Copy missing class between lists
        this.leftTests.forEach((test) => {
          if (!_.contains(this.rightTests, test)) {
            this.rightTests.push(_.extend({}, test, {alien: true, testFailed: false}));
          }
        });
        this.rightTests.forEach((test) => {
          if (!_.contains(this.leftTests, test)) {
            this.leftTests.push(_.extend({}, test, {alien: true, testFailed: false}));
          }
        });
      });
    }
  };
}());