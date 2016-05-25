(function (angular) {
    'use strict';

    angular.module('ci-site').service('HealthReportService', HealthReportService);

    HealthReportService.$inject = ['JenkinsService'];

    function HealthReportService(JenkinsService) {
        this.jobs = [];
        this.JenkinsService = JenkinsService;
    }

    HealthReportService.prototype = {
        getReport: function () {
            return this.jobs;
        }
    };
})(window.angular);
