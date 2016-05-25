(function () {
    'use strict';

    angular.module('ci-site').controller('HealthReportCtrl', HealthReportCtrl);

    HealthReportCtrl.$inject = ['JenkinsService'];

    function HealthReportCtrl(JenkinsService) {
        this.jobs = {};
        this.newLink = {
            name: '',
            href: ''
        };

        this.filter = '';

        this.JenkinsService = JenkinsService;

        this.init();
    }

    HealthReportCtrl.prototype = {
        add: function () {
            if (this.newLink) {
                this.links.$add(this.newLink).then((function () {
                    this.newLink = {
                        name: '',
                        href: ''
                    };
                }).bind(this));
            }
        },
        init: function () {
            this.JenkinsService.getHealthReport().then(function (jobs) {
                this.jobs = jobs;
            }.bind(this));
        }
    };
})();
