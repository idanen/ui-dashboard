(function (angular) {
    'use strict';

    angular.module('ci-site')
        .directive('healthReport', function () {
            return {
                restrict: 'E',
                controllerAs: 'healthReportCtrl',
                controller: 'HealthReportCtrl',
                templateUrl: 'js/tabs/content/health-report/health-report-tmpl.html'
            };
        });
})(window.angular);
