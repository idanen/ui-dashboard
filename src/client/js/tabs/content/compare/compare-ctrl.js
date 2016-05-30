(function () {
  'use strict';
  
  angular.module('ci-site')
    .controller('CompareCtrl', CompareController);

  CompareController.$inject = ['build', 'toBuild', '$state', '$q', 'ciStatusService', 'buildTestsService'];
  function CompareController(build, toBuild, $state, $q, ciStatusService, buildTestsService) {
    this.build = build;
    this.toBuild = toBuild;
    this.$state = $state;
    this.$q = $q;
    this.buildTestsService = buildTestsService;
    this.loading = false;
    this.title = `Comparing build ${this.build.name}#${this.build.number} and ${this.toBuild.name}#${this.toBuild.number}`;
    this.availableBuilds = {
      masters: ciStatusService.getJobs(),
      teams: ciStatusService.getJobs('teams')
    };
    this.availableGroups = Object.keys(this.availableBuilds);
    this.selected = {
      left: {
      },
      right: {
      }
    };
    this.openTestLists = {};
    this.legendShown = false;

    if (!this.build.number) {
      this.build.number = '1370';
    }

    this.sortFields = ['category', 'testClassName', 'markedUnstable', 'insertionTime'];
    this.sortField = this.sortFields[0];

    $q.all(this.availableBuilds.masters.$loaded(), this.availableBuilds.teams.$loaded())
      .then(this.selectFirstOptions.bind(this))
      .then(this.getAllTests.bind(this));
  }

  CompareController.prototype = {
    selectionChanged: function (side, prop, value) {
      this.selected[side][prop] = value;
      if (prop === 'number') {
        this.getAllTests();
      }
    },
    getAllTests: function () {
      this.loading = true;
      return this.getTests()
          .then(this.assignToViewModel.bind(this))
          .finally(() => this.loading = false);
    },
    updateState: function () {
      this.$state.go('compare', {
        group: this.selected.left.group,
        buildName: this.selected.left.name,
        buildNumber: this.selected.left.number,
        toGroup: this.selected.right.group,
        toBuildName: this.selected.right.name,
        toBuildNumber: this.selected.right.number
      });
    },
    selectFirstOptions: function () {
      if (this.build) {
        this.selected.left = {
          group: this.selected.left.group || this.build.group || 'masters',
          name: this.build.name,
          number: this.build.number
        };
      }
      if (this.toBuild && this.toBuild.name && this.toBuild.number) {
        this.selected.right = {
          group: this.selected.right.group || this.toBuild.group || 'masters',
          name: this.toBuild.name,
          number: this.toBuild.number
        };
      } else {
        this.selected.right = {
          group: this.selected.right.group || this.toBuild.group || 'masters',
          name: this.build.name,
          number: this.build.number - 1
        };
      }
    },
    getTests: function () {
      return this.buildTestsService.fetchCompare(this.selected.left.name, this.selected.left.number, this.selected.right.name, this.selected.right.number);
    },
    panelClass: function (aTest) {
      if (this.hasAliens(aTest)) {
        return '';
      }
      return aTest.tests.some((test) => test.testFailed) ? 'panel-danger' : 'panel-success';
    },
    testIcon: function (aTest) {
      if (this.hasAliens(aTest)) {
        return 'help-outline';
      }
      return aTest.tests.some((test) => test.testFailed) ? 'error-outline' : 'check';
    },
    testIconClass: function (aTest) {
      if (this.hasAliens(aTest)) {
        return 'text-muted';
      }
      return aTest.tests.some((test) => test.testFailed)  ? 'text-danger' : 'text-success';
    },
    hasAliens: function (testWrap) {
      return testWrap && testWrap.tests.length && _.find(testWrap.tests, { alien: true });
    },
    toggleTestList: function ($event, whichTest) {
      $event.preventDefault();
      this.openTestLists[whichTest] = !this.openTestLists[whichTest];
    },
    assignToViewModel: function (both) {
      var leftGrouped = _.groupBy(both.left, 'testClassName'),
          rightGrouped = _.groupBy(both.right, 'testClassName');

      if (both.left[0].jobName === this.selected.left.name && both.left[0].buildId === this.selected.left.number) {
        this.leftTests = this._toArray(leftGrouped);
        this.rightTests = this._toArray(rightGrouped);
      } else {
        this.leftTests = this._toArray(rightGrouped);
        this.rightTests = this._toArray(leftGrouped);
      }
    },
    goToStability: function (testsList, side) {
      return this.$state.go('stability', {
        group: this.selected[side].group,
        buildName: testsList.tests[0].jobName,
        buildNumber: testsList.tests[0].buildId,
        tests: testsList
      });
    },
    hasMarkedUnstable: function (testsList) {
      let unstable = _.find(testsList.tests, { markedUnstable: true });
      return !!unstable;
    },
    toggleLegend: function () {
      this.legendShown = !this.legendShown;
    },
    _toArray: function (tests) {
      var testsByClass = [];
      _.forEach(tests, (tests, testClassName) => {
        testsByClass.push({
          testClassName: testClassName,
          tests: tests
        });
      });

      return testsByClass;
    }
  };
}());