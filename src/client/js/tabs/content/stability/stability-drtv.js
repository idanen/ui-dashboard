(function () {
  'use strict';

  angular.module('tabs')
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
    this.tests = [];
    this.stability = {};
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
      this.appendToTests(this.reFormatTestsStructure($stateParams.tests));
    }

    //ciStatusService.getLastBuildNumber('masters', this.build.name).then((lastBuild) => {
    //  this.build.number = lastBuild;
    //  this.fetchFailedOfBuild();
    //});
    $q.all(this.availableBuilds.masters.$loaded(), this.availableBuilds.teams.$loaded())
        .then(this.selectFirstOptions.bind(this))
        .then(this.fetchFailedOfBuild.bind(this));
  }

  CIStabilityController.prototype = {
    fetchFailedOfBuild: function () {
      if (this.build.number) {
        this.buildTestsService.fetch(this.build.name, this.build.number)
            .then(this.reFormatTestsStructure.bind(this))
            .then(this.appendToTests.bind(this))
            .catch(this.handleError);
      }
    },
    reFormatTestsStructure: function (tests) {
      let testsByClass = [], reformated;
      tests.forEach((test) => {
        let testByClass = {};
        testByClass.testClass = test._id.testClassName;
        testByClass.methods = _.map(test.tests, 'testName');
        testsByClass.push(testByClass);
      });
      reformated = _.map(testsByClass, (test) => _.extend({selected: true}, test));
      return reformated;
    },
    appendToTests: function (tests) {
      this.tests = this.tests.concat(tests);
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
      if (prop === 'number') {
        this.fetchFailedOfBuild();
      }
    },
    buildsCountUpdated: function (value) {
      this.$scope.$applyAsync(() => {
        this.buildsCount = value;
      });
    },
    addTest: function () {
      let existing = _.find(this.tests, {testClass: this.newTest.testClass}),
          newMethods = this.newTest.methods.split(/,\s*/);
      if (existing) {
        let toAdd = [];
        _.forEach(newMethods, (method) => {
          if (!_.includes(existing.methods(method))) {
            toAdd.push(method);
          }
        });
        existing.methods = existing.methods.concat(toAdd);
      } else {
        this.tests = this.tests.concat(_.extend({selected: true}, {
          testClass: this.newTest.testClass,
          methods: newMethods
        }));
      }
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
    renderResults: function () {
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
      this.buildTestsService.getStability(this.build.name, _.filter(this.tests, {selected: true}), this.buildsCount)
          .then(stability => this.stability = stability)
          .then(this.renderResults.bind(this))
          .catch(this.handleError);
    },
    handleError: console.error.bind(console)
  };
}());
