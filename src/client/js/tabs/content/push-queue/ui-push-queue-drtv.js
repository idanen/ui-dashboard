(function (angular) {
    'use strict';

    angular.module('tabs').directive('uiPushQueue', ['TeamMembersService', 'QueueService', 'NotificationService',
        function (TeamMembersService, QueueService, NotificationService) {
            return {
                restrict: 'E',
                controllerAs: 'pushQueueCtrl',
                controller: [function () {

                    var ctrl = this;
                    this.queue = QueueService;
                    this.members = TeamMembersService.members;
                    this.empty = '';

                    this.getMemberByID = function (memberId) {
                        return TeamMembersService.getMemberByID(memberId);
                    };
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
                    controller.queue.$watch(function (event) {
                            if (event.event == 'child_removed') {
                                if (controller.queue.length > 0) {
                                    controller.fireNotification();
                                }
                            }
                        }
                    );
                }
            };
        }]);
})(window.angular);
