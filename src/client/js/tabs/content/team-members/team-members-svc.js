(function (angular) {
    'use strict';

    angular.module('tabs').service('TeamMembersService', ['FirebaseService', function (FirebaseService) {
        var svc = this;
        this.members = FirebaseService.getMembers();

        this.members.$loaded(function () {
            svc.uniqueMemberId = svc.members.length;
        });

        this.addMember = function (newMember) {
            newMember.memberId = this.uniqueMemberId;
            this.uniqueMemberId++;

            this.members.$add(newMember);
            newMember = null;
        };

        this.saveMemberInfo = function (updatedMember) {
            this.members.$save(updatedMember);
        };

        this.getMemberByID = function (memberId) {
            return this.members.filter(function (obj) {
                return obj.memberId === memberId;
            })[0];
        };
        this.getMembers = function () {
            return svc.members;
        };

        this.getOrigMember = function(memberKey){
            return FirebaseService.getOrigRecord(memberKey);
        };
    }]);
})(window.angular);
