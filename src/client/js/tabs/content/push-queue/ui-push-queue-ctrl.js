(function () {
    'use strict';

    angular.module('ci-site')
        .controller('PushQueueCtrl', PushQueueController);

    PushQueueController.$inject = ['PushQueueService', 'teamsService', 'TeamMembersService', 'MasterStatusService', 'DATE_FORMAT', 'Ref', '$firebaseObject', '$scope', 'NotificationTags'];

    function PushQueueController(pushQueueService, teamsService, TeamMembersService, MasterStatusService, DATE_FORMAT, Ref, $firebaseObject, $scope, NotificationTags) {
        var vm = this;

        vm.dateFormat = DATE_FORMAT;
        vm.pushQueueService = pushQueueService;
        vm.queue = pushQueueService.getQueue();
        vm.members = TeamMembersService.getMembers();
        vm.teams = teamsService.getTeams();
        vm.lastMasterMerge = MasterStatusService.getLastUpdateTime;
        vm.membersMetadata = {};
        vm.pushEnabled = $firebaseObject(Ref.child('config/global'));
        vm.NotificationTags = NotificationTags;
        vm.selected = {
          member: null,
          team: null
        };

        vm.removeFromQueue = function (id) {
            pushQueueService.removeFromQueue(id);
        };

        vm.getFirstName = function (memberId) {
            return pushQueueService.getFirstName(memberId);
        };

        vm.getMemberByID = function (memberId) {
            return pushQueueService.getMemberByID(memberId);
        };

        vm.fireNotification = function () {
            pushQueueService.fireNotification();
        };

        vm.updateMergedToMaster = function () {
            MasterStatusService.setUpdated(new Date());
        };

        $scope.$on('$destroy', function () {
          vm.queue.$destroy();
          vm.members.$destroy();
          vm.teams.$destroy();
          MasterStatusService.unwatchDataChanges();
          pushQueueService.unwatchDataChanges();
        });
    }
  
  PushQueueController.prototype = {
    addToQueue: function (memberOrTeam) {
      this.pushQueueService.addToQueue(this.selected[memberOrTeam]);
    },
    updatePushStatus: function (state) {
      this.pushEnabled[this.NotificationTags.PUSH_Q] = state;
      this.pushEnabled.$save();
    },
    setPriority: function (enqueued) {
      let toUpdate = this.queue.$getRecord(enqueued.$id);
      if (toUpdate) {
        this.pushQueueService.upgradePriority(toUpdate);
        // toUpdate.$priority = (toUpdate.$priority || 1) + 1;
        // this.queue.$save(toUpdate);
      }
    }
  };
})();
