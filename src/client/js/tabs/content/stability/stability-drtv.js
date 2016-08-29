(function () {
  'use strict';

  angular.module('ci-site')
    .controller('CIStabilityCtrl', CIStabilityController)
    .component('ciStability', {
        controller: CIStabilityController,
        templateUrl: 'js/tabs/content/stability/stability-tmpl.html'
      });

  CIStabilityController.$inject = ['$q', '$stateParams', 'buildTestsService', 'ciStatusService', 'build', 'downloadService', '$filter', 'DEFAULT_JOB_NAME', 'GENERIC_JOB_NAME', 'DEFAULT_BUILDS_COUNT'];
  function CIStabilityController($q, $stateParams, buildTestsService, ciStatusService, build, downloadService, $filter, DEFAULT_JOB_NAME, GENERIC_JOB_NAME, DEFAULT_BUILDS_COUNT) {
    this.buildTestsService = buildTestsService;
    this.ciStatusService = ciStatusService;
    this.downloadService = downloadService;
    this.$filter = $filter;
    this.DEFAULT_JOB_NAME = DEFAULT_JOB_NAME;
    this.GENERIC_JOB_NAME = GENERIC_JOB_NAME;
    this.buildsCount = DEFAULT_BUILDS_COUNT;
    this.filterFailedPercent = 0.0;
    this.tests = [];
    this.stability = {};
    this.legendShown = false;
    this.goLoading = false;
    this.reFetchLoading = false;
    this.availableBuilds = {
      masters: ciStatusService.getJobs(),
      teams: ciStatusService.getJobs('teams')
    };
    this.availableGroups = Object.keys(this.availableBuilds);
    this.build = {
      group: build.group || 'masters',
      name: build.name || this.DEFAULT_JOB_NAME,
      number: build.number || ''
    };

    if ($stateParams.tests) {
      let testsFromState = $stateParams.tests;
      if (!Array.isArray(testsFromState)) {
        testsFromState = [testsFromState];
      }
      this.appendToTests(this.reFormatTestsStructure(testsFromState));
    }

    $q.all([this.availableBuilds.masters.$loaded(), this.availableBuilds.teams.$loaded()])
        .then(this.selectDefaultOptions.bind(this));
        //.then(this.fetchFailedOfBuild.bind(this));
  }

  CIStabilityController.prototype = {
    fetchFailedOfBuild: function () {
      if (this.build.number) {
        this.reFetchLoading = true;
        this.fetchStability()
            .finally(() => this.reFetchLoading = false);
      }
    },
    reFormatTestsStructure: function (tests) {
      let testsByClass, selected;
      testsByClass = this.buildTestsService.prepareTestsForSending(tests);
      selected = _.map(testsByClass, (test) => _.extend({selected: true}, test));
      return selected;
    },
    toggleLegend: function () {
      this.legendShown = !this.legendShown;
    },
    appendToTests: function (tests) {
      if (!tests) {
        return;
      }
      if (!Array.isArray(tests)) {
        tests = [tests];
      }
      _.forEach(tests, (test) => {
        let existing = _.find(this.tests, {testClass: test.testClass}),
            newMethods = Array.isArray(test.methods) ? test.methods : test.methods.split(/,\s*/);
        if (existing) {
          let methodsToAdd = [];
          _.forEach(newMethods, (method) => {
            if (!_.includes(existing.methods, method)) {
              methodsToAdd.push(method);
            }
          });
          existing.methods = existing.methods.concat(methodsToAdd);
        } else {
          this.tests = this.tests.concat(_.extend({selected: true}, {
            testClass: test.testClass,
            testJustClass: this.$filter('className')(test.testClass),
            methods: newMethods
          }));
        }
      });
    },
    selectDefaultOptions: function () {
      if (this.build) {
        let selectedBuild = _.find(this.availableBuilds[this.build.group], {$id: this.build.name});
        if (selectedBuild && !this.build.number) {
          this.build.number = selectedBuild.builds[0].buildId;
        }
        this.selectedBuildsBranch();
      }
    },
    selectionChanged: function (prop, value) {
      this.build[prop] = value;
      this.selectedBuildsBranch();
      //if (prop === 'number') {
      //  this.fetchFailedOfBuild();
      //}
    },
    buildsCountUpdated: function (value) {
      this.buildsCount = value;
    },
    filterFailedPercentChanged: function (value) {
      this.filterFailedPercent = value;
    },
    addNewTest: function () {
      this.appendToTests(this.newTest);
      this.newTest = {
        testClass: '',
        methods: ''
      };
    },
    selectAll: function () {
      this.tests.forEach((test) => test.selected = true);
    },
    selectNone: function () {
      this.tests.forEach((test) => test.selected = false);
    },
    clearResults: function () {
      this.tests.forEach((test) => test.results = {});
    },
    clearAll: function () {
      this.tests = [];
    },
    removeTest: function (testClass) {
      this.tests = _.filter(this.tests, test => test.testClass !== testClass);
    },
    fetchStability: function () {
      this.goLoading = true;
      this.testWraps = [];
      return this.buildTestsService.getStability(this.build.name, this.build.number, this.buildsCount, this.branchOfSelected)
          .then(this.renderResults.bind(this))
          .finally(() => this.goLoading = false);
    },
    renderResults: function (stabilityResults) {
      this.testWraps = stabilityResults.map(testWrap => this.countTotalFails(testWrap));
      return this.testWraps;
    },
    exportCSV: function () {
      let csvPrefix = `data:text/csv;charset=utf-8,`,
          headers = `Class Name,Test Name,Failed Count,Failed Builds,Profile`;

      let csvData = this.testWraps.reduce((data, testWrap) => {
        let rows = testWrap.tests.reduce((rows, test) => {
          const profileRegex = /\/([\w\-]+)$/i;
          let failedBuilds = _.map(_.filter(test.stabilityResult.trends, {testFailed: true}), 'buildId').join(' '),
              profile = profileRegex.test(test.category) ? profileRegex.exec(test.category)[1] : '';

          return `${rows}\n${test.testClassName},${test.testName},${test.stabilityResult.failed},${failedBuilds},${profile}`;
        }, '');

        return `${data}${rows}`;
      }, '');

      this.downloadService.download({data: `${csvPrefix}${headers}${csvData}`, filename: `${this.build.name}_${this.build.number}_${this.buildsCount}.csv`});
    },
    countTotalFails: function (testWrap) {
      testWrap.totalFailed = testWrap.tests.reduce((count, test) => {
        return count + (test.stabilityResult.failed);
      }, 0);

      return testWrap;
    },
    selectedBuildsBranch: function () {
      let selectedBuild = _.find(this.availableBuilds[this.build.group], {$id: this.build.name});
      if (selectedBuild) {
        this.branchOfSelected = selectedBuild.builds[this.build.number].branchName;
        return this.branchOfSelected;
      }
      return null;
    },
    handleError: console.error.bind(console)
  };
}());
