(function (angular) {
    'use strict';

    angular.module('tabs').service('BranchOwnerQueueService', BranchOwnerQueueService);

    BranchOwnerQueueService.$inject = ['TeamMembersService', 'FirebaseService', 'NotificationService', 'NotificationTags'];
    function BranchOwnerQueueService(TeamMembersService, FirebaseService, NotificationService, NotificationTags) {
        var svc = this,
            unwatchQueueChanges;
        svc.queue = FirebaseService.getBranchOwnerQ();

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

        function getQueue() {
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
            NotificationService.notify(memberByID.fname + ', good luck ;)', 'New Branch Owner', memberByID.img, NotificationTags.BRANCH_OWNER_Q, 1000 * 60 * 60 * 30);
        }

        function unwatchDataChanges() {
            // TODO (idan): just reduce watchers count here, call unwatch when all stopped watching
            if (typeof unwatchQueueChanges === 'function') {
                unwatchQueueChanges();
            }
        }
    }
})(window.angular);
