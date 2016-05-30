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
        .component('ciFreezeStateToggle', {
          controller: CiFreezeStateToggleController,
          transclude: true,
          bindings: {
            freeze: '<',
            onUpdate: '&'
          },
          template: `
            <label><paper-toggle-button></paper-toggle-button><span>Freeze</span></label>
          `
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

    CiStatusController.$inject = ['$q', '$element', '$state', 'ciStatusService', 'JENKINS_BASE_URL', 'ResultsToIconNames'];
    function CiStatusController($q, $element, $state, ciStatusService, JENKINS_BASE_URL, ResultsToIconNames) {
      this.$state = $state;
      this.$element = $element;
      this.ciStatusService = ciStatusService;
      this.JENKINS_BASE_URL = JENKINS_BASE_URL;
      this.ResultsToIconNames = ResultsToIconNames;
      this.jobs = {
        masters: this.ciStatusService.getJobs(),
        teams: this.ciStatusService.getJobs('teams')
      };
      this.filtered = {
        masters: {},
        teams: {}
      };
      this.loading = false; // when it true , progress bar enabled and job list disabled..
      this.buildsLimit = 3;
      this.newBuild = {};
      this.legendShown = false;

      //$q.all([this.jobs.masters.$loaded(), this.jobs.teams.$loaded()])
      //  .then(this.determineInitialFreezeState.bind(this));
      this.jobs.masters.$loaded()
        .then(() => {
            this.jobs.masters.forEach((job) => {
              if (job.alias === 'master') {
                //job.filtered = true;
                this.filtered.masters[job.$id] = true;
              }
            });
          });
      this.jobs.teams.$loaded()
          .then(() => {
            this.jobs.teams.forEach(job => this.filtered.teams[job.$id] = true);
          });
      //$q.all([this.jobs.masters.$loaded(), this.jobs.teams.$loaded()])
      //    .then(() => {
      //      this.jobs.masters.forEach(job => this.filtered.masters[job.$id] = true);
      //      this.jobs.teams.forEach(job => this.filtered.teams[job.$id] = true);
      //    });
    }

    CiStatusController.prototype = {
      filterJob: function (group, job) {
        this.filtered[group][job.$id] = !this.filtered[group][job.$id];
      },
      unfilter: function (group, jobId) {
        this.filtered[group][jobId] = false;
      },
        addNewBuildNumber: function () {
          this.ciStatusService.addBuildNumber(this.newBuild.name, this.newBuild.number, 'masters').then(() => this.newBuild = {});
        },
        toggleLegend: function () {
          this.legendShown = !this.legendShown;
        },
        determineInitialFreezeState: function (jobs) {
            angular.forEach(jobs, (function (job, jobId) {
                if (/^\$/.test(jobId)) {
                    return;
                }
                this.freezeState(jobId, job.freeze);
            }).bind(this));

            return jobs;
        },
        freezeState: function (jobName, state, group) {
            if (jobName in this.jobs[group || 'masters']) {
                this.jobs[group || 'masters'][jobName].freeze = state;
            }
        },
        getBuilds: function (job) {
          return this.ciStatusService.getJobBuilds(job.$id, false, 3);
        },
        /**
         * Displays the alias, if it doesn't exist we will show the job name.
         * @param {object} job the job
         * @returns {string} the job's display name
         */
        displayName: function (job) {
          if (!job) {
            return '';
          }
          if (job.alias) {
            return job.alias;
          }
          return job.name;
        },
        status: function (job) {
          if (!job) {
            return '';
          }
            if (job.building) {
                return 'Running';
            } else {
                return job.result;
            }
        },
        buildJenkinsLink: function (jobName, jobNumber) {
            return `${this.JENKINS_BASE_URL}${jobName}/${jobNumber}`;
        },
        buildCompareLink: function (jobName, jobNumber) {
          return this.$state.href('compare', {
            buildName: jobName,
            buildNumber: jobNumber,
            toBuildName: jobName,
            toBuildNumber: (parseInt(jobNumber, 10) - 1)
          });
        },
        resultToIconName: function (buildResult) {
          return this.ResultsToIconNames[buildResult] || '';
        },
        setNewBuildName: function (value) {
          this.newBuild.name = value;
        }
    };

    CiFreezeStateToggleController.$inject = ['$element'];
    function CiFreezeStateToggleController($element) {
      this.$element = $element;
    }

    CiFreezeStateToggleController.prototype = {
      $onInit: function () {
        this.$element.find('paper-toggle-button')[0].checked = this.freeze;
      },
      $postLink: function () {
        var $toggler = this.$element.find('paper-toggle-button');
        $toggler.on('iron-change', (ev) => {
          this.onUpdate({freeze: ev.target.checked});
        });

        this.$element.on('$destroy', () => {
          $toggler.off();
        });
      },
      $onChanges: function (changes) {
        if (changes && changes.freeze) {
          this.$element.find('paper-toggle-button')[0].checked = changes.freeze.currentValue;
        }
      }
    };
})();
