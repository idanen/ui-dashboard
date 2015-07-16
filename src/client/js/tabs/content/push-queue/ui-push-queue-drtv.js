'use strict';

angular.module('tabs').directive('uiPushQueue', ['PushQueueService', 'TeamMembersService', 'QueueService', function (PushQueueService, TeamMembersService, QueueService) {
    return {
        restrict: 'E',
        controllerAs: 'pushQueueCtrl',
        controller: [function () {
            var ctrl = this;
            this.queue = QueueService;
            this.addToQueue = function () {
                // $add on a synchronized array is like Array.push() except it saves to the database!
                if (!ctrl.name == '') {
                    ctrl.queue.$add({
                        content: ctrl.name,
                        timestamp: Firebase.ServerValue.TIMESTAMP
                    });
                    ctrl.empty = '';
                    ctrl.name = '';
                }
            };
            this.removeFromQueue = function (name) {
                ctrl.queue.$remove(name);
                if (ctrl.queue.length-1 === 0) {
                    ctrl.empty = 'Queue is Empty';
                }
            }
            var nameField = $('#nameField');
            nameField.keypress(function (e) {
                if (e.keyCode == 13) {
                    ctrl.addToQueue();
                }
            });
        }],

        templateUrl: 'js/tabs/content/push-queue/ui-push-queue-tmpl.html',
        link: function ($scope, element, attributes, controller) {
            controller.queue.$loaded(function () {
                if (controller.queue.length === 0) {
                    controller.empty = 'Queue is Empty';
                }
            });

        }
    }
}]);