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
          ABORTED: 'block',
          UNKNOWN: 'help-outline'
        })
        .directive('ciFreezeStateToggle', CiFreezeStateToggleDirectiveFactory)
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

    CiStatusController.$inject = ['$scope', '$state', 'ciStatusService', 'JENKINS_BASE_URL', 'ResultsToIconNames'];
    function CiStatusController($scope, $state, ciStatusService, JENKINS_BASE_URL, ResultsToIconNames) {
      this.$state = $state;
      this.ciStatusService = ciStatusService;
      this.JENKINS_BASE_URL = JENKINS_BASE_URL;
      this.ResultsToIconNames = ResultsToIconNames;
      this.listOfJobs = {}; // the list of jobs we get from server and use in ng-repeat
      // This assumes the controller's name is `ciJobsCtrl`
      this.ciStatusService.getJobs().$bindTo($scope, 'ciJobsCtrl.listOfJobs');
      this.animateOnUpdate = 'fadeOut'; // ng-class fading for refreshing data
      this.loading = false; // when it true , progress bar enabled and job list disabled..
      this.dataDismiss = ' '; // we change it to keep the modal open until response of the server
      this.validateForm = false; // control visibility of the Error Message in the modal
      this.validationErrorMessage = ''; // Error Message to show in the modal if input is invalid
      this.addJobFormSendBtn = 'btn btn-default'; // 'Add' button style in the 'add job' modal
      this.addJobResultButtonValue = 'Add'; // 'Add' button style in the 'add job' modal

      this.ciStatusService.getJobs().$loaded()
          .then(this.determineInitialFreezeState.bind(this));
    }

    CiStatusController.prototype = {
        addJob: function (job) {
            if (this.addJobResultButtonValue === 'Done') {
                this.addJobFormSendBtn = 'btn btn-default';
                this.addJobResultButtonValue = 'Add';
                return;
            }
            var newJob = {
                name: job.name, alias: job.alias, freeze: {
                    state: false
                }
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
                    .then(this.determineInitialFreezeState.bind(this))
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
        freezeState: function (jobName, state) {
            if (jobName in this.listOfJobs) {
                this.listOfJobs[jobName].freeze = state;
            }
        },
        /**
         * Displays the alias, if it doesn't exist we will show the job name.
         * @param {object} job the job
         * @returns {string} the job's display name
         */
        displayName: function (job) {
            if (job.alias) {
                return job.alias;
            } else {
                return job.name;
            }
        },
        status: function (job) {
            if (job.building === true) {
                return "Running";
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
            if (job.building === true) {
                return "../images/green_anime.gif";
            } else {
                return "../images/" + (job.result && job.result.toLowerCase() || 'unknown') + ".png";
            }
        },
        trStatus: function (job) {
            if (job.building === true) {
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
})();
