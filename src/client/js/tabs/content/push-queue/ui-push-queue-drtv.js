
'use strict';

angular.module('tabs').directive('uiPushQueue', ['PushQueueService', 'TeamMembersService', function (PushQueueService, TeamMembersService) {
    return {
        restrict: 'E',
        controllerAs: 'pushQueueCtrl',
        controller: [function () {
            var ctrl = this;
            this.invalidateHead = function () {
                var userId = PushQueueService.invalidateHead();

            };

        }],
        templateUrl: 'js/tabs/content/push-queue/ui-push-queue-tmpl.html',
        link: function ($scope) {
            $scope.pushQueueCtrl.invalidateHead();
        }
    }
}]);