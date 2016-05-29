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
          changeLimit: '&'
        }
      });

  BuildStatusController.$inject = ['ciStatusService', '$state', 'ResultsToIconNames', '$filter', 'JENKINS_BASE_URL'];
  function BuildStatusController(ciStatusService, $state, ResultsToIconNames, $filter, JENKINS_BASE_URL) {
    this.ciStatusService = ciStatusService;
    this.$state = $state;
    this.ResultsToIconNames = ResultsToIconNames;
    this.$filter = $filter;
    this.JENKINS_BASE_URL = JENKINS_BASE_URL;
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
      this.buildResults = this.ciStatusService.getJobBuilds(this.buildName, this.group, this.jobsLimit);

      this.build.$loaded()
          .then((job) => this.determineInitialFreezeState(job));
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
    onLimitChange: function () {
      if (this.buildResults && this.buildResults.$destroy) {
        this.buildResults.$destroy();
      }
      this.buildResults = this.ciStatusService.getJobBuilds(this.buildName, this.group, this.jobsLimit);
    }
  };
}());
