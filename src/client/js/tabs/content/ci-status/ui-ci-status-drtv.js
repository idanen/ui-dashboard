/**
 * Created by matarfa on 15/07/2015.
 */

(function () {
    'use strict';

    angular.module('tabs')
        .constant('CiJobsRefreshInterval', 1000 * 60 * 10)
        .directive('ciFreezeStateToggle', CiFreezeStateToggleDirectiveFactory)
        .directive('uiCiStatus', [function () {
            return {
                restrict: 'E',
                controller: 'ciStatusController',
                controllerAs: 'ciJobsCtrl',
                templateUrl: 'js/tabs/content/ci-status/ui-ci-status-tmpl.html'
            };
        }])
        .controller('ciStatusController', CiStatusController);

    CiStatusController.$inject = ['$scope', '$interval', 'ciStatusService', 'CiJobsRefreshInterval'];
    function CiStatusController($scope, $interval, ciStatusService, CiJobsRefreshInterval) {
        this.ciStatusService = ciStatusService;
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

        this.intervalPromise = $interval(this.loadJobs, CiJobsRefreshInterval);

        $scope.$on('$destroy', (function () {
            $interval.cancel(this.intervalPromise);
        }).bind(this));
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
                    if (res === "3") {
                        this.validateForm = true;
                        this.validationErrorMessage = "Invalid name: Job name required as in Jenkins";
                    } else if (res === "2") {
                        this.validateForm = true;
                        this.validationErrorMessage = "Job Already Exists..";
                    } else if (res === "1") {
                        this.validateForm = true;
                        this.validationErrorMessage = "Connection Problem , please try again..";
                    } else {
                        this.validateForm = false;
                        this.dataDismiss = "modal";
                        this.addJobFormSendBtn = "btn btn-success";
                        this.addJobResultButtonValue = "Done";
                        this.updateAllJobs();
                    }
                }).bind(this));
        },
        loadJobs: function () {
            if (!this.loading) {
                this.loading = true;
                this.ciStatusService.getJobs().$loaded()
                    .then(this.determineInitialFreezeState.bind(this))
                    .then(this.ciStatusService.loadJobs.bind(this.ciStatusService))
                    .then(this.extendResults.bind(this))
                    .finally((function () {
                        this.loading = false;
                    }).bind(this));
            }
        },
        determineInitialFreezeState: function (jobs) {
            angular.forEach(jobs, (function (job, jobName) {
                this.freezeState(jobName, job.freeze.state);
            }).bind(this));

            return jobs;
        },
        extendResults: function (jobsFromFirebase) {
            if (jobsFromFirebase) {
                jobsFromFirebase.forEach(function (job) {
                    if (job.name in this.listOfJobs) {
                        this.listOfJobs[job.name].building = job.building;
                        this.listOfJobs[job.name].result = job.result;
                    }
                }, this);
                this.animateOnUpdate = 'fadeIn';
            }
        },
        updateAllJobs: function () {
            this.animateOnUpdate = 'fadeOut';
            this.loadJobs();
        },
        freezeState: function (jobName, state) {
            if (jobName in this.listOfJobs) {
                this.listOfJobs[jobName].freeze.state = state;
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
