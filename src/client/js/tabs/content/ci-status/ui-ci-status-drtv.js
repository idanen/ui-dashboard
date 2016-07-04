/**
 * Created by matarfa on 15/07/2015.
 */

(function () {
    'use strict';

    angular.module('ci-site')
        .constant('CiJobsRefreshInterval', 1000 * 60 * 5)
        .constant('ResultsToIconNames', {
          SUCCESS: 'done',
          FAILURE: 'error',
          UNSTABLE: 'warning',
          ABORTED: 'remove-circle-outline',
          UNKNOWN: 'help-outline',
          running: 'alarm'
        })
        .directive('uiCiStatus', [function () {
            return {
                restrict: 'E',
                controller: 'ciStatusController',
                // If you change this, be sure to change also in the controller where we $bind to the controller's property
                controllerAs: 'ciJobsCtrl',
                templateUrl: 'js/tabs/content/ci-status/ui-ci-status-tmpl.html'
            };
        }])
        .controller('ciStatusController', CiStatusController);

    CiStatusController.$inject = ['$element', '$state', 'ciStatusService', 'userConfigs', 'JENKINS_BASE_URL', 'ResultsToIconNames', 'DEFAULT_JOB_NAME'];
    function CiStatusController($element, $state, ciStatusService, userConfigs, JENKINS_BASE_URL, ResultsToIconNames, DEFAULT_JOB_NAME) {
      this.$state = $state;
      this.$element = $element;
      this.ciStatusService = ciStatusService;
      this.JENKINS_BASE_URL = JENKINS_BASE_URL;
      this.ResultsToIconNames = ResultsToIconNames;
      this.DEFAULT_JOB_NAME = DEFAULT_JOB_NAME;
      this.userConfigs = userConfigs;
      this.jobs = {
        masters: this.ciStatusService.getJobs(),
        teams: this.ciStatusService.getJobs('teams')
      };
      this.loading = false; // when it true , progress bar enabled and job list disabled..
      this.buildsLimit = 3;
      this.newBuild = {};
      this.legendShown = false;

      this.userConfigs.registerForConfigsChanges(this.configsChanged.bind(this));

      this.filterConfig = this.userConfigs.getUserConfig('statusFilter');
      this.listenToFilterConfigChanges();
    }

    CiStatusController.prototype = {
      filterJob: function (group, job) {
        this.filtered[group][job.$id] = !this.filtered[group][job.$id];
        this.configFilterChanged();
      },
      unfilter: function (group, jobId) {
        this.filtered[group][jobId] = false;
        this.configFilterChanged();
      },
      clearAll: function (group) {
        this.filtered[group] = {};
      },
      configsChanged: function (uid) {
        if (!uid) {
          return;
        }

        if (this.configsUnwatcher) {
          this.configsUnwatcher();
        }
        if (this.filterConfig) {
          this.filterConfig.$destroy();
        }

        this.filterConfig = this.userConfigs.getUserConfig('statusFilter');
        this.listenToFilterConfigChanges();
      },
      listenToFilterConfigChanges: function () {
        if (this.filterConfig) {
          if (this.configsUnwatcher) {
            this.configsUnwatcher();
          }

          this.configsUnwatcher = this.filterConfig.$watch(() => {
            this.filtered = _.extend({masters: {}, teams: {}}, this.filterConfig);
          });
        } else {
          this.filtered = {
            masters: {},
            teams: {}
          };
          this.filtered.masters[this.DEFAULT_JOB_NAME] = true;
        }
      },
      configFilterChanged: function () {
        this.filterConfig.masters = this.filtered.masters;
        this.filterConfig.teams = this.filtered.teams;
        this.filterConfig.$save();
      },
        addNewBuildNumber: function () {
          this.ciStatusService.addBuildNumber(this.newBuild.name, this.newBuild.number, 'masters').then(() => this.newBuild = {});
        },
        toggleLegend: function () {
          this.legendShown = !this.legendShown;
        },
        setNewBuildName: function (value) {
          this.newBuild.name = value;
        }
    };
})();
