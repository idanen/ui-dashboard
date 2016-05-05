(function () {
  'use strict';

  angular.module('tabs')
    .component('ciStability', {
        controller: CIStabilityController,
        templateUrl: 'js/tabs/content/stability/stability-tmpl.html'
      });

  CIStabilityController.$inject = ['buildTestsService', 'ciStatusService'];
  function CIStabilityController(buildTestsService, ciStatusService) {
    this.buildTestsService = buildTestsService;
    this.ciStatusService = ciStatusService;
    this.tests = [];
    this.selectedTests = [];
    this.stability = {};
    this.build = {
      name: 'MaaS-SAW-USB-master',
      number: ''
    };

    ciStatusService.getLastBuildNumber('masters', this.build.name).then((lastBuild) => {
      this.build.number = lastBuild;
      this.fetchFailedOfBuild();
    });
  }

  CIStabilityController.prototype = {
    fetchFailedOfBuild: function () {
      this.buildTestsService.fetch(this.build.name, this.build.number)
        .then(tests => {
            var testsByClass = [];
            tests.forEach((test) => {
              var testByClass = {};
              testByClass.testClass = test._id.testClassName;
              testByClass.methods = _.map(test.tests, 'testName');
              testsByClass.push(testByClass);
            });
            this.tests = testsByClass;
          })
        .catch(this.handleError);
    },
    fetchStability: function () {
      this.buildTestsService.getStability(this.build.name, _.filter(this.tests, {selected: true}))
          .then(stability => this.stability = stability)
          .catch(this.handleError);
    },
    handleError: console.error.bind(console)
  };
}());
