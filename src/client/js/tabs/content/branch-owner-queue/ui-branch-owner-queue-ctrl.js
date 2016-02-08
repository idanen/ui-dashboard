(function () {
    'use strict';

    angular.module('tabs')
        .controller('BranchOwnerQueueCtrl', BranchOwnerQueueController);

    BranchOwnerQueueController.$inject = ['BranchOwnerQueueService', 'TeamMembersService', 'DATE_FORMAT', '$scope'];

    function BranchOwnerQueueController(BranchOwnerQueueService, TeamMembersService, DATE_FORMAT, $scope) {
        var vm = this;

        vm.dateFormat = DATE_FORMAT;
        vm.queue = BranchOwnerQueueService.getQueue();
        vm.members = TeamMembersService.getMembers();

        vm.addToQueue = function () {
            BranchOwnerQueueService.addToQueue(vm.selected.memberId);
        };

        vm.removeFromQueue = function (id) {
            BranchOwnerQueueService.removeFromQueue(id);
        };

        vm.getFirstName = function (memberId) {
            return BranchOwnerQueueService.getFirstName(memberId);
        };

        vm.getMemberByID = function (memberId) {
            return BranchOwnerQueueService.getMemberByID(memberId);
        };

        vm.fireNotification = function () {
            BranchOwnerQueueService.fireNotification();
        };

        $scope.$on('$destroy', function () {
            BranchOwnerQueueService.unwatchDataChanges();
        });
    }
})();
