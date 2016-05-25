(function (angular) {
    'use strict';

    angular.module('ci-site')
        .directive('uiBranchOwnerQueue', function () {
            return {
                restrict: 'E',
                controllerAs: 'branchOwnersCtrl',
                controller: 'BranchOwnerQueueCtrl',
                templateUrl: 'js/tabs/content/branch-owner-queue/ui-branch-owner-queue-tmpl.html'
            };
        });
})(window.angular);
