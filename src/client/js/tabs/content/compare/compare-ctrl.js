(function () {
  'use strict';
  
  angular.module('ci-site')
    .controller('CompareCtrl', CompareController);

  CompareController.$inject = ['build', 'toBuild', '$state', '$filter', '$q', 'ciStatusService', 'buildTestsService', 'JENKINS_BASE_URL', 'DEFAULT_JOB_NAME'];
  function CompareController(build, toBuild, $state, $filter, $q, ciStatusService, buildTestsService, JENKINS_BASE_URL, DEFAULT_JOB_NAME) {
    this.build = build;
    this.toBuild = toBuild;
    this.$state = $state;
    this.$filter = $filter;
    this.$q = $q;
    this.JENKINS_BASE_URL = JENKINS_BASE_URL;
    this.DEFAULT_JOB_NAME = DEFAULT_JOB_NAME;
    this.buildTestsService = buildTestsService;
    this.ciStatusService = ciStatusService;
    this.loading = false;
    this.stabilityLoading = false;
    this.title = `Comparing build ${this.build.name}#${this.build.number} and ${this.toBuild.name}#${this.toBuild.number}`;
    this.buildsCount = 10;
    this.totalFailed = {
      left: 0,
      right: 0
    };
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

    this.sortFields = ['category', 'testClassName', 'markedUnstable'];
    this.sortField = this.sortFields[0];

    $q.all(this.availableBuilds.masters.$loaded(), this.availableBuilds.teams.$loaded())
      .then(this.selectDefaultOptions.bind(this))
      .then(this.getAllTests.bind(this));
  }

  CompareController.prototype = {
    selectionChanged: function (side, prop, value) {
      this.selected[side][prop] = value;
      //if (prop === 'number') {
      //  this.getAllTests();
      //}
      this.updateState();
    },
    getAllTests: function () {
      this.loading = true;
      return this.getTests()
          .then(this.assignToViewModel.bind(this))
          .then(this.getTestStability.bind(this))
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
    selectDefaultOptions: function () {
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
          name: this.toBuild.name || this.DEFAULT_JOB_NAME
        };
        this.ciStatusService.getLastBuildNumber()
            .then((lastMasterBuild) => {
              this.selected.right.number = lastMasterBuild;
            });
      }
    },
    selectMasterBuild: function (side) {
      this.ciStatusService.getLastBuildNumber()
          .then((lastMasterBuild) => {
            this.selected[side].group = 'masters';
            this.selected[side].name = this.DEFAULT_JOB_NAME;
            this.selected[side].number = lastMasterBuild;
            this.updateState();
          });
    },
    selectPreviousBuild: function (side) {
      let otherSide = side === 'left' ? 'right' : 'left';
      this.selected[side].group = this.selected[otherSide].group;
      this.selected[side].name = this.selected[otherSide].name;
      this.selected[side].number = parseInt(this.selected[otherSide].number, 10) - 1;
      this.updateState();
    },
    getTests: function () {
      let leftBuildName = this.$filter('releasever')(this.selected.left.name),
          rightBuildName = this.$filter('releasever')(this.selected.right.name);
      return this.buildTestsService.fetchCompare(leftBuildName, this.selected.left.number, rightBuildName, this.selected.right.number);
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
      return testWrap && testWrap.tests.length && !!_.find(testWrap.tests, { alien: true });
    },
    allAliens: function (tests) {
      return tests.every(test => test.alien);
    },
    toggleTestList: function ($event, whichTest) {
      $event.preventDefault();
      this.openTestLists[whichTest] = !this.openTestLists[whichTest];
    },
    assignToViewModel: function (both) {
      var leftGrouped = _.groupBy(both.left, 'testClassName'),
          rightGrouped = _.groupBy(both.right, 'testClassName');

      if (both.left.length && both.left[0].jobName === this.selected.left.name && String(both.left[0].buildId) === this.selected.left.number && !this.allAliens(both.left)) {
        this.leftTests = this._toArray(leftGrouped);
        this.rightTests = this._toArray(rightGrouped);
      } else {
        this.leftTests = this._toArray(rightGrouped);
        this.rightTests = this._toArray(leftGrouped);
      }

      // Sum all failures on each side
      this.totalFailed.left = this.leftTests.reduce((total, testsWrap) => {
        total += _.filter(testsWrap.tests, { testFailed: true }).length;
        return total;
      }, 0);
      this.totalFailed.right = this.rightTests.reduce((total, testsWrap) => {
        total += _.filter(testsWrap.tests, { testFailed: true }).length;
        return total;
      }, 0);
    },
    buildJenkinsLink: function (side) {
      let buildName = this.$filter('releasever')(this.selected[side].name);
      return `${this.JENKINS_BASE_URL}${buildName}/${this.selected[side].number}`;
    },
    getTestStability: function () {
      let leftBuildName = this.$filter('releasever')(this.selected.left.name),
          rightBuildName = this.$filter('releasever')(this.selected.right.name),
          promises = [];

      if (this.buildsCount) {
        this.stabilityLoading = true;

        promises.push(this.buildTestsService.getStability(leftBuildName, this.selected.left.number, this.buildsCount)
            .then(this.addStabilityResultsToTestsList.bind(this, this.leftTests)));
        promises.push(this.buildTestsService.getStability(rightBuildName, this.selected.right.number, this.buildsCount)
            .then(this.addStabilityResultsToTestsList.bind(this, this.rightTests)));

        this.$q.all(promises)
            .finally(() => this.stabilityLoading = false);
      }
    },
    addStabilityResultsToTestsList: function (testsWraps, stabilityResults) {
      let groupedStabilityResults = _.groupBy(stabilityResults, (stabilityResult) => stabilityResult._id.testClassName);
      _.forEach(testsWraps, (testsWrap) => {
        let stabilityResults = _.omit(groupedStabilityResults[testsWrap.testClassName], 'tests');
        testsWrap.tests = testsWrap.tests.map((test) => {
          let stability = _.find(stabilityResults, (result) => result._id.testName === test.testName);
          if (stability) {
            return _.extend({}, test, {
              stabilityResult: {
                testName: stability._id.testName,
                stability: stability.stability,
                failed: stability.failed,
                count: stability.buildIds.length,
                buildIds: stability.buildIds
              }
            });
          }
          return test;
        });
      });
    },
    goToStability: function (side) {
      return this.$state.go('stability', {
        group: this.selected[side].group,
        buildName: this.selected[side].name,
        buildNumber: this.selected[side].number
      });
    },
    hasMarkedUnstable: function (testsList) {
      let unstable = _.find(testsList.tests, { markedUnstable: true });
      return !!unstable;
    },
    buildsCountUpdated: function (value) {
      this.buildsCount = value;
      this.getTestStability();
    },
    toggleLegend: function () {
      this.legendShown = !this.legendShown;
    },
    _toArray: function (tests) {
      var testsByClass = [];
      _.forEach(tests, (tests, testClassName) => {
        testsByClass.push({
          testClassName: testClassName,
          category: tests[0].category,
          markedUnstable: tests[0].markedUnstable,
          tests: tests
        });
      });

      return testsByClass;
    }
  };
}());