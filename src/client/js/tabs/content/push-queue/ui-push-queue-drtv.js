
'use strict';

angular.module('tabs').directive('uiPushQueue', ['PushQueueService', 'TeamMembersService', function (PushQueueService, TeamMembersService) {
    return {
        restrict: 'E',
        controllerAs: 'pushQueueCtrl',
        controller: [function () {

            this.invalidateHead = function () {
                var userId = PushQueueService.invalidateHead();
                this.head = TeamMembersService.getUserNameById(userId);
            };

        }],
        templateUrl: 'js/tabs/content/push-queue/ui-push-queue-tmpl.html',
        link: function ($scope) {
            $scope.pushQueueCtrl.invalidateHead();
        }
    }
}]);