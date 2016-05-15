(function () {
  'use strict';

  angular.module('tabs')
    .component('ciStability', {
        controller: CIStabilityController,
        templateUrl: 'js/tabs/content/stability/stability-tmpl.html'
      });

  CIStabilityController.$inject = ['$q', 'buildTestsService', 'ciStatusService'];
  function CIStabilityController($q, buildTestsService, ciStatusService) {
    this.buildTestsService = buildTestsService;
    this.ciStatusService = ciStatusService;
    this.teamId = 'DevOps';
    this.buildsCount = 10;
    this.tests = [];
    this.stability = {};
    this.availableBuilds = {
      masters: ciStatusService.getJobs(),
      teams: ciStatusService.getJobs('teams', this.teamId)
    };
    this.availableGroups = Object.keys(this.availableBuilds);
    this.build = {
      group: 'masters',
      name: 'MaaS-SAW-USB-master',
      number: ''
    };

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
            .then(tests => {
              var testsByClass = [];
              tests.forEach((test) => {
                var testByClass = {};
                testByClass.testClass = test._id.testClassName;
                testByClass.methods = _.map(test.tests, 'testName');
                testsByClass.push(testByClass);
              });
              this.tests = _.map(testsByClass, (test) => _.extend({selected: true}, test));

            })
            .catch(this.handleError);
      }
    },
    selectFirstOptions: function () {
      if (this.build) {
        let selectedBuild = _.find(this.availableBuilds[this.build.group], this.build.name);
        if (selectedBuild) {
          this.build.number = selectedBuild.builds[0].buildId;
        }
      }
    },
    selectionChanged: function (prop, value) {
      this.build[prop] = value;
      this.fetchFailedOfBuild();
    },
    addTest: function () {
      this.tests = this.tests.concat(_.extend({selected: true}, {testClass: this.newTest.testClass, methods: this.newTest.methods.split(/,\s*/)}));
      this.newTest = {
        testClass: '',
        methods: ''
      };
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
