/**
 * Created by matarfa on 15/07/2015.
 */


'use strict';

angular.module('tabs').directive('uiCiStatus', ['CiStatusService', 'TeamMembersService', function (CiStatusService, TeamMembersService) {
    return {
        restrict: 'E',
        controllerAs: 'pushQueueCtrl',
        controller: [function () {
            var ctrl = this;
            this.invalidateHead = function () {
                var userId = CiStatusService.invalidateHead();

            };

        }],
        templateUrl: 'js/tabs/content/push-queue/ui-push-queue-tmpl.html',
        link: function ($scope) {
            $scope.CiStatusService.invalidateHead();
        }
    }
}]);