(function () {
    'use strict';

    angular.module('ci-site')
        .controller('PushQueueCtrl', PushQueueController);

    PushQueueController.$inject = ['PushQueueService', 'teamsService', 'TeamMembersService', 'branchesUpdates', 'DATE_FORMAT', 'globalConfig', 'NotificationService', '$scope', 'NotificationTags', 'firebaseDestroy'];
    function PushQueueController(pushQueueService, teamsService, TeamMembersService, branchesUpdates, DATE_FORMAT, globalConfig, notificationService, $scope, NotificationTags, firebaseDestroy) {
        var vm = this;

        vm.dateFormat = DATE_FORMAT;
        vm.pushQueueService = pushQueueService;
        vm.queue = pushQueueService.getQueue();
        vm.members = TeamMembersService.getMembers();
        vm.teams = teamsService.getTeams();
        vm.branchesUpdates = branchesUpdates;
        vm.lastMasterMerge = branchesUpdates.getLastUpdate();
        vm.pushEnabled = globalConfig.getGlobalConfig();
        vm.notificationService = notificationService;
        vm.NotificationTags = NotificationTags;
        vm.firebaseDestroy = firebaseDestroy;
        vm.selected = {
          member: null,
          team: null
        };

        $scope.$on('$destroy', function () {
          vm.firebaseDestroy.destroy([vm.queue, vm.members, vm.teams]);
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
    removeFromQueue: function (id) {
      this.queue.$remove(id).then(this.notifyQueueChanged.bind(this));
    },
    getFirstName: function (memberId) {
      return this.pushQueueService.getFirstName(memberId);
    },
    getMemberByID: function (memberId) {
      return this.pushQueueService.getMemberByID(memberId);
    },
    notifyQueueChanged: function () {
      if (this.queue.length > 0) {
        const first = this.queue[this.queue.length - 1];
        this.notificationService.notifyQueueChanged(first.name, first.img);
      }
    },
    updateMergedToMaster: function () {
      this.branchesUpdates.setUpdated();
    },
    setPriority: function (enqueued) {
      let toUpdate = this.queue.$getRecord(enqueued.$id);
      if (toUpdate) {
        this.pushQueueService.upgradePriority(toUpdate);
      }
    }
  };
})();
