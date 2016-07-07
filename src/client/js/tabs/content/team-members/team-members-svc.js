(function (angular) {
    'use strict';

    angular.module('ci-site').service('TeamMembersService', TeamMembersService);

    TeamMembersService.$inject = ['Ref', '$firebaseArray', '$firebaseObject', '$q'];
    function TeamMembersService(Ref, $firebaseArray, $firebaseObject, $q) {
        this._ref = Ref.child('members');
        this.$firebaseArray = $firebaseArray;
        this.$firebaseObject = $firebaseObject;
        this.$q = $q;

        this._ref.orderByChild('memberId').limitToLast(1).once('value')
            .then((snapshot) => this.uniqueMemberId = snapshot.child('memberId').val());
    }

    TeamMembersService.prototype = {
      getOrigMember: function(memberKey) {
        return this.$q.when(
            this._ref.child(memberKey).once('value')
                .then((snapshot) => snapshot.val())
        );
      },
      addMember: function (newMember) {
        this._ref.push(angular.extend({memberId: this.uniqueMemberId}, newMember));
        this.uniqueMemberId++;
      },
      getMembers: function () {
        return this.$firebaseArray(this._ref);
      },
      saveMemberInfo: function (updatedMember) {
        const memberId = updatedMember.$id;
        if (memberId) {
          delete updatedMember.$id;
          this._ref.child(memberId).set(updatedMember);
        }
      },
      getMemberByID: function (memberId) {
        return this.$q.when(
            this._ref.orderByChild('memberId').equalTo(memberId).once('value')
                .then((snapshot) => snapshot.val())
        );
      }
    };
})(window.angular);
