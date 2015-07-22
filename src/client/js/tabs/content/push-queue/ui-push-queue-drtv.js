(function (angular) {
    'use strict';

    angular.module('tabs').directive('uiPushQueue', ['TeamMembersService', 'FirebaseService', 'NotificationService',
        function (TeamMembersService, FirebaseService, NotificationService) {
            return {
                restrict: 'E',
                controllerAs: 'pushQueueCtrl',
                controller: [function () {

                    var ctrl = this;
                    this.queue = FirebaseService.getQueue();
                    this.members = TeamMembersService.getMembers();
                    this.empty = '';

                    this.queue.$watch(function (event) {
                        if (event.event == 'child_removed') {
                            if (ctrl.queue.length > 0) {
                                ctrl.fireNotification();
                            }
                        }
                    });

                    this.addToQueue = function () {
                        ctrl.queue.$add({
                            id: this.selected.memberId
                        });
                        ctrl.empty = '';
                    };
                    this.removeFromQueue = function (id) {
                        ctrl.queue.$remove(id).then(function () {
                            if (ctrl.queue.length === 0) {
                                ctrl.empty = 'Queue is Empty';
                            }
                        });
                    };

                    this.getFirstName = function (memberId) {
                        return ctrl.getMemberByID(memberId).fname;
                    };

                    this.getMemberByID = function (memberId) {
                        return TeamMembersService.getMemberByID(memberId);
                    };

                    this.fireNotification = function () {
                        NotificationService.notifyQueueChanged(ctrl.getMemberByID(ctrl.queue[0].id).fname, ctrl.getMemberByID(ctrl.queue[0].id).img);
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
