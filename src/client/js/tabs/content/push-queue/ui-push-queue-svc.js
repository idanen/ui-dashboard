(function (angular) {
    'use strict';

    angular.module('tabs').service('PushQueueService', PushQueueService);

    PushQueueService.$inject = ['TeamMembersService', 'FirebaseService', 'NotificationService'];

    function PushQueueService(TeamMembersService, FirebaseService, NotificationService) {
        var svc = this;
        svc.queue = FirebaseService.getQueue();

        svc.queue.$watch(function (event) {
            if (event.event === 'child_removed') {
                if (svc.queue.length > 0) {
                    svc.fireNotification();
                }
            }
        });

        svc.addToQueue = function (memberId) {
            svc.queue.$add({
                id: memberId
            });
        };
        svc.removeFromQueue = function (id) {
            return svc.queue.$remove(id).then(function () {
                return (svc.queue.length === 0);
            });
        };

        svc.getQueue = function(){
            return svc.queue;
        };
        svc.getFirstName = function (memberId) {
            return svc.getMemberByID(memberId).fname;
        };

        svc.getMemberByID = function (memberId) {
            return TeamMembersService.getMemberByID(memberId);
        };

        svc.fireNotification = function () {
            NotificationService.notifyQueueChanged(svc.getMemberByID(svc.queue[0].id).fname, svc.getMemberByID(svc.queue[0].id).img);
        };
    }
})(window.angular);
