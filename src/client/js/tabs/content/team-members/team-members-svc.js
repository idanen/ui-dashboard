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

        this.getMemberByID = function (memberId) {
            if (memberId) {
                return this.members.filter(function (obj) {
                    return obj.memberId == memberId;
                })[0];
            }
        };
        this.getMembers = function () {
            return svc.members;
        }
    }]);
})(window.angular);
