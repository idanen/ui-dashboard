(function (angular) {
    'use strict';

    angular.module('ci-site').service('PushQueueService', PushQueueService);

    PushQueueService.$inject = ['TeamMembersService', 'FirebaseService', 'NotificationService'];

    function PushQueueService(TeamMembersService, FirebaseService, NotificationService) {
        var svc = this,
            unwatchQueueChanges;
        svc.queue = FirebaseService.getQueue();

        svc.addToQueue = addToQueue;
        svc.removeFromQueue = removeFromQueue;
        svc.getQueue = getQueue;
        svc.getFirstName = getFirstName;
        svc.getMemberByID = getMemberByID;
        svc.fireNotification = fireNotification;
        svc.unwatchDataChanges = unwatchDataChanges;

        unwatchQueueChanges = svc.queue.$watch(function (event) {
            if (event.event === 'child_removed') {
                if (svc.queue.length > 0) {
                    svc.fireNotification();
                }
            }
        });

        function addToQueue(memberId) {
            svc.queue.$add({
                id: memberId
            });
        }

        function removeFromQueue(id) {
            return svc.queue.$remove(id).then(function () {
                return (svc.queue.length === 0);
            });
        }

        function getQueue(){
            return svc.queue;
        }

        function getFirstName(memberId) {
            return svc.getMemberByID(memberId).fname;
        }

        function getMemberByID(memberId) {
            return TeamMembersService.getMemberByID(memberId);
        }

        function fireNotification() {
            var memberByID = svc.getMemberByID(svc.queue[0].id);
            NotificationService.notifyQueueChanged(memberByID.fname, memberByID.img);
        }

        function unwatchDataChanges() {
            // TODO (idan): just reduce watchers count here, call unwatch when all stopped watching
            if (typeof unwatchQueueChanges === 'function') {
                unwatchQueueChanges();
            }
        }
    }
})(window.angular);
