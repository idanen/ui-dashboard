(function () {
  'use strict';

  angular.module('ci-site')
    .controller('CIStabilityCtrl', CIStabilityController)
    .component('ciStability', {
        controller: CIStabilityController,
        templateUrl: 'js/tabs/content/stability/stability-tmpl.html'
      });

  CIStabilityController.$inject = ['$q', '$scope', '$stateParams', 'buildTestsService', 'ciStatusService', 'build'];
  function CIStabilityController($q, $scope, $stateParams, buildTestsService, ciStatusService, build) {
    this.$scope = $scope;
    this.buildTestsService = buildTestsService;
    this.ciStatusService = ciStatusService;
    this.buildsCount = 10;
    this.filterFailedPercent = 0.09;
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
        .then(this.selectFirstOptions.bind(this));
        //.then(this.fetchFailedOfBuild.bind(this));
  }

  CIStabilityController.prototype = {
    fetchFailedOfBuild: function () {
      if (this.build.number) {
        this.reFetchLoading = true;
        //this.buildTestsService.fetch(this.build.name, this.build.number)
        this.buildTestsService.fetchLastFailedOfBuild(this.build.name, this.build.number, this.buildsCount)
            .then(this.reFormatTestsStructure.bind(this))
            .then(this.appendToTests.bind(this))
            .catch(this.handleError)
            .finally(() => this.reFetchLoading = false);
      }
    },
    reFormatTestsStructure: function (tests) {
      let testsByClass = [], reformated;
      tests.forEach((test) => {
        let testByClass = {};
        testByClass.testClass = test.testClassName || test._id && test._id.testClassName;
        testByClass.methods = _.map(test.tests, 'testName');
        testsByClass.push(testByClass);
      });
      reformated = _.map(testsByClass, (test) => _.extend({selected: true}, test));
      return reformated;
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
            methods: newMethods
          }));
        }
      });
    },
    selectFirstOptions: function () {
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
    renderResults: function () {
      this.clearResults();
      _.forEach(this.tests, (test) => {
        let stability = _.filter(this.stability, (testStability) => {
          return testStability._id.testClassName === test.testClass;
        });
        if (!test.results) {
          test.results = {};
        }
        _.forEach(stability, (results) => {
          test.results[results._id.testName] = {
            testName: results._id.testName,
            stability: results.stability,
            failed: results.failed,
            count: results.buildIds.length
          };
        });
      });
    },
    fetchStability: function () {
      this.goLoading = true;
      this.buildTestsService.getStability(this.build.name, _.filter(this.tests, {selected: true}), this.build.number, this.buildsCount)
          .then(stability => this.stability = stability)
          .then(this.renderResults.bind(this))
          .catch(this.handleError)
          .finally(() => this.goLoading = false);
    },
    handleError: console.error.bind(console)
  };
}());
