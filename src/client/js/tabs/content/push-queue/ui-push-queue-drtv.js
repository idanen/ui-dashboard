(function (angular) {
    'use strict';

    angular.module('tabs').directive('uiPushQueue', ['PushQueueService', 'TeamMembersService', 'FirebaseService', 'NotificationService',
        function (PushQueueService, TeamMembersService, FirebaseService, NotificationService) {
            return {
                restrict: 'E',
                controllerAs: 'pushQueueCtrl',
                controller: [function () {

                    var ctrl = this;
                    this.queue = PushQueueService.getQueue();
                    this.members = TeamMembersService.getMembers();
                    this.empty = '';

                    this.addToQueue = function () {
                        PushQueueService.addToQueue(this.selected.memberId);
                        ctrl.empty = '';
                    };

                    this.removeFromQueue = function (id) {
                        PushQueueService.removeFromQueue(id).then(function (isEmpty) {
                            if (isEmpty) {
                                ctrl.empty = 'Queue is Empty';
                            }
                        }).catch(function () {
                            console.log();
                        });
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
                }],
                templateUrl: 'js/tabs/content/push-queue/ui-push-queue-tmpl.html',
                link: function ($scope, element, attributes, controller) {
                    controller.queue.$loaded(function () {
                        if (controller.queue.length === 0) {
                            controller.empty = 'Queue is Empty';
                        }
                    });
                }
            };
        }])
    ;
})
(window.angular);
