/**
 * Created by matarfa on 15/07/2015.
 */

(function () {
    'use strict';

    angular.module('tabs')
        .constant('CiJobsRefreshInterval', 1000 * 60 * 5)
        .constant('ResultsToIconNames', {
          SUCCESS: 'done',
          FAILURE: 'error',
          UNSTABLE: 'warning',
          ABORTED: 'remove-circle-outline',
          UNKNOWN: 'help-outline',
          running: 'alarm'
        })
        //.directive('ciFreezeStateToggle', CiFreezeStateToggleDirectiveFactory)
        .component('ciFreezeStateToggle', {
          controller: CiFreezeStateToggleController,
          transclude: true,
          bindings: {
            freeze: '<',
            onUpdate: '&'
          },
          template: `
            <paper-toggle-button><label>Freeze</label></paper-toggle-button>
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
      this.teamId = 'DevOps';
      this.jobs = {
        masters: this.ciStatusService.getJobs(),
        teams: this.ciStatusService.getJobs('teams', this.teamId)
      };
      //this.listOfJobs = this.ciStatusService.getJobs();
      this.loading = false; // when it true , progress bar enabled and job list disabled..
      this.dataDismiss = ' '; // we change it to keep the modal open until response of the server
      this.validateForm = false; // control visibility of the Error Message in the modal
      this.addJobFormSendBtn = 'btn btn-default'; // 'Add' button style in the 'add job' modal
      this.addJobResultButtonValue = 'Add'; // 'Add' button style in the 'add job' modal
      this.buildsLimit = 3;
      this.newBuild = {};

      //$q.all([this.jobs.masters.$loaded(), this.jobs.teams.$loaded()])
      //  .then(this.determineInitialFreezeState.bind(this));
    }

    CiStatusController.prototype = {
        addJob: function (job) {
            if (this.addJobResultButtonValue === 'Done') {
                this.addJobFormSendBtn = 'btn btn-default';
                this.addJobResultButtonValue = 'Add';
                return;
            }
            var newJob = {
              name: job.name,
              alias: job.alias,
              freeze: false
            };
            this.ciStatusService.addJob(newJob)
                .then((function (res) {
                    // handle response from server
                    if (res === '3') {
                        this.validateForm = true;
                        this.validationErrorMessage = 'Invalid name: Job name required as in Jenkins';
                    } else if (res === '2') {
                        this.validateForm = true;
                        this.validationErrorMessage = 'Job Already Exists..';
                    } else if (res === '1') {
                        this.validateForm = true;
                        this.validationErrorMessage = 'Connection Problem , please try again..';
                    } else {
                        this.validateForm = false;
                        this.dataDismiss = 'modal';
                        this.addJobFormSendBtn = 'btn btn-success';
                        this.addJobResultButtonValue = 'Done';
                        this.updateAllJobs();
                    }
                }).bind(this));
        },
        loadJobs: function () {
            if (!this.loading) {
                this.loading = true;
                this.ciStatusService.getJobs('masters').$loaded()
                    //.then(this.determineInitialFreezeState.bind(this))
                    //.then(this.ciStatusService.getBuildStatus.bind(this.ciStatusService, 'MaaS-SAW-USB-master'))
                    //.then(this.extendResults.bind(this))
                    .catch(this.networkError.bind(this))
                    .finally((function () {
                        this.loading = false;
                    }).bind(this));
            }
        },
        networkError: function () {
            if (this.listOfJobs) {
                angular.forEach(this.listOfJobs, function (job, key) {
                    if (/^\$/g.test(key)) {
                        // Ignore $ properties
                        return;
                    }
                    job.building = false;
                    job.result = 'error';
                });
            }
        },
        addNewBuildNumber: function () {
          this.ciStatusService.addBuildNumber(this.newBuild.name, this.newBuild.number, 'masters').then(() => this.newBuild = {});
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
        extendResults: function (jobsFromFirebase) {
            console.log(jobsFromFirebase);
            if (jobsFromFirebase) {
                //this.listOfJobs = jobsFromFirebase;
                this.animateOnUpdate = 'fadeIn';
            }
        },
        updateAllJobs: function () {
            this.animateOnUpdate = 'fadeOut';
            this.loadJobs();
        },
        freezeState: function (jobName, state, group) {
            if (jobName in this.jobs[group || 'masters']) {
                this.jobs[group || 'masters'][jobName].freeze = state;
            }
        },
        toDisplayArray: function (object) {
          var displayArray = [];
          _.map(object, (value, key) => {
            displayArray.push(angular.extend({}, value, {jobNumber: key}));
          });
          return displayArray;
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
        selectJobImg:function(imgName){
            if(imgName && imgName.indexOf('anime') > -1){
                return '../images/' + imgName + '.gif';
            }
            return '../images/' + imgName + '.png';
        },

        chooseImg: function (job) {
            if (job.building) {
                return "../images/green_anime.gif";
            } else {
                return "../images/" + (job.result && job.result.toLowerCase() || 'unknown') + ".png";
            }
        },
        trStatus: function (job) {
            if (!job) {
              return '';
            }
            if (job.building) {
                return "active";
            } else {
                if (job.result === "SUCCESS") {
                    return "success";
                } else if (job.result === "FAILURE") {
                    return "danger";
                } else if (job.result === "UNSTABLE") {
                    return "warning";
                }
            }
        },
        resultToIconName: function (buildResult) {
          return this.ResultsToIconNames[buildResult] || '';
        },
        /**
         * update the class value of the table rows , depending on trStatus() and 'animateOnUpdate' to make it fade if reuqired
         * @param {object} job the job
         */
        styleJobRow: function (job) {
            return this.trStatus(job);
        },
        setNewBuildName: function (value) {
          this.newBuild.name = value;
        }
    };

    CiFreezeStateToggleDirectiveFactory.$inject = ['$parse'];
    function CiFreezeStateToggleDirectiveFactory($parse) {
        var ddo = {
            restrict: 'A',
            link: postLinkFn
        };

        function postLinkFn($scope, $element, $attrs) {
            $element.on('iron-change', function (ev) {
                $scope.$applyAsync(function () {
                    $parse($attrs.ciFreezeStateToggle).assign($scope, ev.target.checked);
                });
            });

            $element.on('$destroy', function () {
                $element.off();
            });

            $scope.$watch($attrs.ciFreezeStateToggle, freezeStateToView, true);

            function freezeStateToView(modelValue) {
                $element[0].checked = modelValue;
            }
        }

        return ddo;
    }

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
