(function () {
  'use strict';

  angular.module('ci-site')
    .controller('CIStabilityCtrl', CIStabilityController)
    .component('ciStability', {
        controller: CIStabilityController,
        templateUrl: 'js/tabs/content/stability/stability-tmpl.html'
      });

  CIStabilityController.$inject = ['$q', '$scope', '$stateParams', 'buildTestsService', 'ciStatusService', 'build', '$filter'];
  function CIStabilityController($q, $scope, $stateParams, buildTestsService, ciStatusService, build, $filter) {
    this.$scope = $scope;
    this.buildTestsService = buildTestsService;
    this.ciStatusService = ciStatusService;
    this.$filter = $filter;
    this.buildsCount = 10;
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
      name: build.name || 'MaaS-SAW-USB-master',
      number: build.number || ''
    };

    if ($stateParams.tests) {
      let testsFromState = $stateParams.tests;
      if (!Array.isArray(testsFromState)) {
        testsFromState = [testsFromState];
      }
      this.appendToTests(this.reFormatTestsStructure(testsFromState));
    }

    //ciStatusService.getLastBuildNumber('masters', this.build.name).then((lastBuild) => {
    //  this.build.number = lastBuild;
    //  this.fetchFailedOfBuild();
    //});
    $q.all(this.availableBuilds.masters.$loaded(), this.availableBuilds.teams.$loaded())
        .then(this.selectDefaultOptions.bind(this));
        //.then(this.fetchFailedOfBuild.bind(this));
  }

  CIStabilityController.prototype = {
    fetchFailedOfBuild: function () {
      if (this.build.number) {
        this.reFetchLoading = true;
        this.fetchStability()
            .finally(() => this.reFetchLoading = false);
        //this.buildTestsService.fetch(this.build.name, this.build.number)
        //this.buildTestsService.fetchLastFailedOfBuild(this.build.name, this.build.number, this.buildsCount)
        //    .then(this.reFormatTestsStructure.bind(this))
        //    .then(this.appendToTests.bind(this))
        //    //.then(this.fetchStability.bind(this))
        //    .catch(this.handleError)
        //    .finally(() => this.reFetchLoading = false);
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
        let selectedBuild = _.find(this.availableBuilds[this.build.group], this.build.name);
        if (selectedBuild && !this.build.number) {
          this.build.number = selectedBuild.builds[0].buildId;
        }
      }
    },
    selectionChanged: function (prop, value) {
      this.build[prop] = value;
      //if (prop === 'number') {
      //  this.fetchFailedOfBuild();
      //}
    },
    buildsCountUpdated: function (value) {
      this.$scope.$applyAsync(() => {
        this.buildsCount = value;
      });
    },
    filterFailedPercentChanged: function (value) {
      this.$scope.$applyAsync(() => {
        this.filterFailedPercent = value;
      });
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
    renderResults: function (stabilityResults) {
      this.testWraps = [];
      _.forEach(stabilityResults, ((stabilityResult) => {
        let testWrap = _.find(this.testWraps, (testWrap) => testWrap.testClassName === stabilityResult._id.testClassName);
        let testData = _.extend(stabilityResult.tests[0], {
          stabilityResult: {
            testName: stabilityResult._id.testName,
            stability: stabilityResult.stability,
            failed: stabilityResult.failed,
            count: stabilityResult.buildIds.length,
            buildIds: stabilityResult.buildIds
          }
        });
        if (!testWrap) {
          this.testWraps.push({
            testClassName: stabilityResult._id.testClassName,
            tests: [testData]
          });
        } else {
          testWrap.tests.push(testData);
        }
      }));

      return this.testWraps;
    },
    fetchStability: function () {
      this.goLoading = true;
      return this.buildTestsService.getStability(this.build.name, this.build.number, this.buildsCount)
          .then(this.renderResults.bind(this))
          .finally(() => this.goLoading = false);
    },
    handleError: console.error.bind(console)
  };
}());
