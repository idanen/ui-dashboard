(function (angular) {
    'use strict';

    angular.module('tabs').service('PushQueueService', ['TeamMembersService', 'FirebaseService', 'NotificationService',
        function (TeamMembersService, FirebaseService, NotificationService) {

            var svc = this;
            this.queue = FirebaseService.getQueue();

            this.queue.$watch(function (event) {
                if (event.event == 'child_removed') {
                    if (svc.queue.length > 0) {
                        svc.fireNotification();
                    }
                }
            });

            this.addToQueue = function (memberId) {
                svc.queue.$add({
                    id: memberId
                });
            };
            this.removeFromQueue = function (id) {
                return svc.queue.$remove(id).then(function () {
                    return (svc.queue.length === 0);
                });
            };

            this.getQueue = function(){
                return this.queue;
            };
            this.getFirstName = function (memberId) {
                return svc.getMemberByID(memberId).fname;
            };

            this.getMemberByID = function (memberId) {
                return TeamMembersService.getMemberByID(memberId);
            };

            this.fireNotification = function () {
                NotificationService.notifyQueueChanged(svc.getMemberByID(svc.queue[0].id).fname, svc.getMemberByID(svc.queue[0].id).img);
            };

        }]);
})(window.angular);
