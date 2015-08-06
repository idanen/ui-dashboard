(function () {
    'use strict';

    angular.module('tabs')
        .controller('PushQueueCtrl', PushQueueController);

    PushQueueController.$inject = ['PushQueueService', 'TeamMembersService', 'DATE_FORMAT'];

    function PushQueueController(PushQueueService, TeamMembersService, DATE_FORMAT) {
        var vm = this;

        vm.dateFormat = DATE_FORMAT;
        vm.queue = PushQueueService.getQueue();
        vm.members = TeamMembersService.getMembers();
        // TODO : move this to firebase
        vm.lastMasterMerge = new Date(1970, 0, 1);

        vm.addToQueue = function () {
            PushQueueService.addToQueue(vm.selected.memberId);
        };

        vm.removeFromQueue = function (id) {
            PushQueueService.removeFromQueue(id);
        };

        vm.getFirstName = function (memberId) {
            return PushQueueService.getFirstName(memberId);
        };

        vm.getMemberByID = function (memberId) {
            return PushQueueService.getMemberByID(memberId);
        };

        vm.fireNotification = function () {
            PushQueueService.fireNotification();
        };

        vm.updateMergedToMaster = function () {
            vm.lastMasterMerge = new Date();
            PushQueueService.masterUpdateNotification(vm.lastMasterMerge);
        };
    }
})();
