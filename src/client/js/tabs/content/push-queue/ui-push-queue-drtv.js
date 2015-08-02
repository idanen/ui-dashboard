(function (angular) {
    'use strict';

    angular.module('tabs')
        .directive('uiPushQueue', function () {
            return {
                restrict: 'E',
                controllerAs: 'pushQueueCtrl',
                controller: 'PushQueueCtrl',
                templateUrl: 'js/tabs/content/push-queue/ui-push-queue-tmpl.html'
            };
        })
        .controller('PushQueueCtrl', PushQueueController);

    PushQueueController.$inject = ['PushQueueService', 'TeamMembersService'];

    function PushQueueController(PushQueueService, TeamMembersService) {

        this.queue = PushQueueService.getQueue();
        this.members = TeamMembersService.getMembers();

        this.addToQueue = function () {
            PushQueueService.addToQueue(this.selected.memberId);
        };

        this.removeFromQueue = function (id) {
            PushQueueService.removeFromQueue(id);
        };

        this.getFirstName = function (memberId) {
            return PushQueueService.getFirstName(memberId);
        };

        this.getMemberByID = function (memberId) {
            return PushQueueService.getMemberByID(memberId);
        };

        this.fireNotification = function () {
            PushQueueService.fireNotification();
        };
    }
})(window.angular);
