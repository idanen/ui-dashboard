(function (angular) {
    'use strict';

    angular.module('tabs').service('PushQueueService', PushQueueService);

    PushQueueService.$inject = ['TeamMembersService', 'FirebaseService', 'NotificationService', '$filter', 'DATE_FORMAT'];

    function PushQueueService(TeamMembersService, FirebaseService, NotificationService, $filter, DATE_FORMAT) {
        var svc = this;
        svc.queue = FirebaseService.getQueue();

        svc.addToQueue = addToQueue;
        svc.removeFromQueue = removeFromQueue;
        svc.getQueue = getQueue;
        svc.getFirstName = getFirstName;
        svc.getMemberByID = getMemberByID;
        svc.fireNotification = fireNotification;
        svc.masterUpdateNotification = masterUpdateNotification;

        svc.queue.$watch(function (event) {
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
            NotificationService.notifyQueueChanged(svc.getMemberByID(svc.queue[0].id).fname, svc.getMemberByID(svc.queue[0].id).img);
        }

        function masterUpdateNotification(date) {
            NotificationService.notify('Last update: ' + $filter('date')(date, DATE_FORMAT), 'Team branch merged to master', '/images/git-icon-black.png', 'NotificationTagMasterMerge', 1000 * 60 * 60 * 30);
        }
    }
})(window.angular);
