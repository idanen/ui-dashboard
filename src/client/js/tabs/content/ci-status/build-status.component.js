(function () {
  'use strict';

  angular.module('ci-site')
    .component('buildStatus', {
        controller: BuildStatusController,
        templateUrl: 'js/tabs/content/ci-status/build-status-tmpl.html',
        bindings: {
          buildName: '<',
          buildsHidden: '<?',
          group: '<?',
          jobsLimit: '<?',
          branchName: '<?',
          limitChanged: '&',
          branchNameChanged: '&'
        }
      });

  BuildStatusController.$inject = ['ciStatusService', '$state', 'ResultsToIconNames', '$filter', 'JENKINS_BASE_URL'];
  function BuildStatusController(ciStatusService, $state, ResultsToIconNames, $filter, JENKINS_BASE_URL) {
    this.ciStatusService = ciStatusService;
    this.$state = $state;
    this.ResultsToIconNames = ResultsToIconNames;
    this.$filter = $filter;
    this.JENKINS_BASE_URL = JENKINS_BASE_URL;
    
    this.loadingBuildResults = true;
    this.config = {
      buildTooLong: 1000 * 60 * 60 * 3
    };

    this.possibleResults = Object.keys(ResultsToIconNames);

    this._resultToClass = {
      SUCCESS: 'success',
      FAILURE: 'danger',
      UNSTABLE: 'warning'
    };
  }

  BuildStatusController.prototype = {
    $onInit: function () {
      this.build = this.ciStatusService.getJob(this.buildName, this.group);
      this.buildResults = this.ciStatusService.getJobBuilds(this.buildName, this.group, this.branchName, this.jobsLimit);

      this.build.$loaded()
          .then((job) => this.determineInitialFreezeState(job));
      this.buildResults.$loaded()
          .then(() => this.loadingBuildResults = false);
    },
    $onDestroy: function () {
      if (this.buildResults && _.isFunction(this.buildResults.$destroy)) {
        this.buildResults.$destroy();
      }
    },
    buildJenkinsLink: function (buildNumber) {
      let buildName = this.$filter('releasever')(this.buildName);
      return `${this.JENKINS_BASE_URL}${buildName}/${buildNumber}`;
    },
    buildCompareLink: function (buildNumber) {
      return this.$state.href('compare', {
        group: this.group,
        buildName: this.buildName,
        buildNumber: buildNumber
      });
    },
    resultToIconName: function (buildResult) {
      return this.ResultsToIconNames[buildResult] || '';
    },
    determineInitialFreezeState: function (job) {
      if (Boolean(job.freeze) !== this.build.freeze) {
        this.build.freeze = Boolean(job.freeze);
      }
    },
    freezeState: function (state) {
      this.build.freeze = state;
      this.build.$save();
    },
    buildsHiddenToggle: function () {
      this.buildsHidden = !this.buildsHidden;
    },
    isBuildTooLong: function (build) {
      return build.result === 'running' && (Date.now() - build.lastUpdate) > this.config.buildTooLong;
    },
    setBuildResult: function (build, result) {
      if (build) {
        let boundBuild = this.buildResults.$getRecord(build.$id);
        if (boundBuild) {
          let subBuilds = this.ciStatusService.getRunningSubBuilds(this.buildName, build.$id, this.group);
          boundBuild.result = result;
          boundBuild.phase = 'FINISHED';
          this.buildResults.$save(boundBuild);
          subBuilds.$loaded().then(() => {
            subBuilds.forEach((subBuild) => {
              let bound = subBuilds.$getRecord(subBuild.$id);
              bound.phase = 'FINISHED';
              bound.result = result;
              subBuilds.$save(bound);
            });
          });
        }
      }
    },
    toggleBranchNameEdit: function () {
      this.editingBranchName = !this.editingBranchName;
    },
    reFetch: function () {
      if (this.buildResults && this.buildResults.$destroy) {
        this.buildResults.$destroy();
      }
      this.buildResults = this.ciStatusService.getJobBuilds(this.buildName, this.group, this.branchName, this.jobsLimit);
      this.editingBranchName = false;
    },
    setBranchFilter: function (branchName) {
      this.branchName = branchName;
      this.reFetch();
      this.branchNameChanged(this.branchName);
    },
    clearBranchFilter: function () {
      this.branchName = '';
      this.reFetch();
      this.branchNameChanged(this.branchName);
    },
    onBranchNameChange: function () {
      if (this.buildResults && this.buildResults.$destroy) {
        this.buildResults.$destroy();
      }
      this.buildResults = this.ciStatusService.getJobBuilds(this.buildName, this.group, this.branchName, this.jobsLimit);
    },
    onLimitChange: function () {
      if (this.buildResults && this.buildResults.$destroy) {
        this.buildResults.$destroy();
      }
      this.buildResults = this.ciStatusService.getJobBuilds(this.buildName, this.group, this.branchName, this.jobsLimit);
      this.limitChanged({$event: this.jobsLimit});
    }
  };
}());
