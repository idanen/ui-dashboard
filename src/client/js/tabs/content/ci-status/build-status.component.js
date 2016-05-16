(function () {
  'use strict';

  angular.module('tabs')
    .component('buildStatus', {
        controller: BuildStatusController,
        templateUrl: 'js/tabs/content/ci-status/build-status-tmpl.html',
        bindings: {
          buildName: '<',
          buildsHidden: '<?',
          group: '<?',
          jobsLimit: '<?',
          changeLimit: '&'
        }
      });

  BuildStatusController.$inject = ['ciStatusService', '$state', 'ResultsToIconNames', 'JENKINS_BASE_URL'];
  function BuildStatusController(ciStatusService, $state, ResultsToIconNames, JENKINS_BASE_URL) {
    this.ciStatusService = ciStatusService;
    this.$state = $state;
    this.ResultsToIconNames = ResultsToIconNames;
    this.JENKINS_BASE_URL = JENKINS_BASE_URL;

    this._resultToClass = {
      SUCCESS: 'success',
      FAILURE: 'danger',
      UNSTABLE: 'warning'
    };
  }

  BuildStatusController.prototype = {
    $onInit: function () {
      this.build = this.ciStatusService.getJob(this.buildName, this.group);
      this.buildResults = this.ciStatusService.getJobBuilds(this.buildName, this.group, this.jobsLimit);

      this.build.$loaded()
          .then((job) => this.determineInitialFreezeState(job));
    },
    buildJenkinsLink: function (buildNumber) {
      return `${this.JENKINS_BASE_URL}${this.buildName}/${buildNumber}`;
    },
    buildCompareLink: function (buildNumber) {
      return this.$state.href('compare', {
        group: this.group,
        buildName: this.buildName,
        buildNumber: buildNumber,
        toGroup: this.group,
        toBuildName: this.buildName,
        toBuildNumber: (parseInt(buildNumber, 10) - 1)
      });
    },
    resultToClass: function (job) {
      if (!job) {
        return '';
      }
      if (job.building) {
        return 'active';
      }

      return this._resultToClass[job.result] || '';
    },
    resultToIconName: function (buildResult) {
      return this.ResultsToIconNames[buildResult] || '';
    },
    determineInitialFreezeState: function (job) {
      this.build.freeze = Boolean(job.freeze);
    },
    freezeState: function (state) {
      this.build.freeze = state;
      this.build.$save();
    },
    buildsHiddenToggle: function () {
      this.buildsHidden = !this.buildsHidden;
    },
    onLimitChange: function () {
      if (this.buildResults && this.buildResults.$destroy) {
        this.buildResults.$destroy();
      }
      this.buildResults = this.ciStatusService.getJobBuilds(this.buildName, this.group, this.jobsLimit);
    }
  };
}());
