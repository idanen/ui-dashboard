(function () {
    'use strict';

    angular.module('ci-site')
        .controller('PushQueueCtrl', PushQueueController);

    PushQueueController.$inject = ['PushQueueService', 'TeamMembersService', 'MasterStatusService', 'DATE_FORMAT', '$scope'];

    function PushQueueController(PushQueueService, TeamMembersService, MasterStatusService, DATE_FORMAT, $scope) {
        var vm = this;

        vm.dateFormat = DATE_FORMAT;
        vm.queue = PushQueueService.getQueue();
        vm.members = TeamMembersService.getMembers();
        vm.lastMasterMerge = MasterStatusService.getLastUpdateTime;

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
            MasterStatusService.setUpdated(new Date());
        };

        $scope.$on('$destroy', function () {
            MasterStatusService.unwatchDataChanges();
            PushQueueService.unwatchDataChanges();
        });
    }
})();
