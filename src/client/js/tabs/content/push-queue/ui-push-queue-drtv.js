'use strict';

angular.module('tabs').directive('uiPushQueue', ['PushQueueService', 'TeamMembersService', 'QueueService', function (PushQueueService, TeamMembersService, QueueService) {
    return {
        restrict: 'E',
        controllerAs: 'pushQueueCtrl',
        controller: [function () {

            var ctrl = this;
            this.queue = QueueService;
            this.members = TeamMembersService.members;
            this.selected = this.members[0];
            this.empty = '';

            this.getMemberByID = function (memberId) {
                return TeamMembersService.getMemberByID(memberId);
            }
            this.addToQueue = function () {
                ctrl.queue.$add({
                    id: this.selected.memberId
                });
                ctrl.empty = '';
            };
            this.removeFromQueue = function (id) {
                ctrl.queue.$remove(id).then(function(ref) {
                if (ctrl.queue.length === 0) {
                    ctrl.empty = 'Queue is Empty';
                }});
            }
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

