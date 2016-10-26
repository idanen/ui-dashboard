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

      this.loading = false;
      this.newBuild = {};
      this.legendShown = false;
      this.jobs = {
        masters: [],
        teams: []
      };

      this.userConfigs.registerForConfigsChanges(this.configsChanged.bind(this));
      this.filterConfig = this.userConfigs.getUserConfig('statusFilter');
      this.listenToFilterConfigChanges();

      this.ciStatusService.getJobsIds()
          .then(mastersIds => this.jobs.masters = Object.keys(mastersIds));
      this.ciStatusService.getJobsIds('teams')
          .then(teamsIds => this.jobs.teams = Object.keys(teamsIds));
    }

    CiStatusController.prototype = {
      filterJob: function (group, jobId) {
        if (!this.filtered[group][jobId]) {
          this.filtered[group][jobId] = {
            show: true,
            limit: 3
          };
        } else {
          this.filtered[group][jobId].show = !this.filtered[group][jobId].show;
        }
        this.saveConfigChanges();
      },
      unfilter: function (group, jobId) {
        this.filtered[group][jobId].show = false;
        this.saveConfigChanges();
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
          this.userConfigs.getUnboundConfig('statusFilter')
              .then((globalStatusFilter) => {
                if (_.isEmpty(this.filtered.masters) && _.isEmpty(this.filtered.teams)) {
                  this.filtered = _.extend({masters: {}, teams: {}}, globalStatusFilter);
                }
              });
        }
      },
      saveConfigChanges: function () {
        this.filterConfig.masters = this.filtered.masters;
        this.filterConfig.teams = this.filtered.teams;
        this.filterConfig.$save();
      },
      limitChanged: function ($event, group, jobId) {
        if (!this.filtered[group][jobId]) {
          this.filtered[group][jobId] = {
            limit: $event,
            show: true
          };
        } else {
          this.filtered[group][jobId].limit = $event;
        }
        this.saveConfigChanges();
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
