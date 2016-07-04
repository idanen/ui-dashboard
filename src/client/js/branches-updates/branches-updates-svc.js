(function () {
  'use strict';

  angular.module('ci-site')
      .service('branchesUpdates', BranchesUpdatesService);

  BranchesUpdatesService.$inject = ['Ref', '$firebaseArray', '$firebaseObject', 'NotificationService', '$filter', 'NotificationTags', 'DATE_FORMAT', '$firebaseAuth'];
  function BranchesUpdatesService(Ref, $firebaseArray, $firebaseObject, notificationService, $filter, NotificationTags, DATE_FORMAT, $firebaseAuth) {
    this.updatesRef = Ref.child('branches_updates');
    this.$firebaseArray = $firebaseArray;
    this.$firebaseObject = $firebaseObject;
    this.notificationService = notificationService;
    this.$filter = $filter;
    this.DATE_FORMAT = DATE_FORMAT;
    this.NotificationTags = NotificationTags;

    $firebaseAuth().$onAuthStateChanged(authData => {
      this.currentUserId = authData && authData.uid;
    });
  }

  BranchesUpdatesService.prototype = {
    getLastUpdate: function (branchName = 'master') {
      return this.$firebaseObject(this.updatesRef.child(branchName).orderByChild('lastUpdateTime').limitToLast(1));
    },
    setUpdated: function (branchName = 'master') {
      let updateTime = Date.now();
      this.updatesRef
          .child(branchName)
          .push()
          .set({
            updater: this.currentUserId,
            lastUpdateTime: updateTime
          })
          .then(() => this.notifyBranchUpdated(updateTime));
    },
    notifyBranchUpdated: function (date) {
      this.notificationService.notify('Last update: ' + this.$filter('date')(date, this.DATE_FORMAT), 'Team branch merged to master', '/images/git-icon-black.png', this.NotificationTags.BRANCH_UPDATES, 1000 * 60 * 60 * 30);
    }
  };
}());
