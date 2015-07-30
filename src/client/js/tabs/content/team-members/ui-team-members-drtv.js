(function (angular) {
    'use strict';

    angular.module('tabs').directive('uiTeamMembers', ['TeamMembersService', function (TeamMembersService) {
        return {
            restrict: 'E',
            controllerAs: 'teamMembersCtrl',
            controller: [function () {
                var ctrl = this;
                this.members = TeamMembersService.getMembers();
                this.addMember = function (member) {
                    TeamMembersService.addMember(member);
                };
                this.setEditMember = function (member) {
                    ctrl.editMember = member;
                };
                this.saveMember = function () {
                    TeamMembersService.saveMemberInfo(ctrl.editMember);
                };
                this.cancelEditMember = function () {
                    TeamMembersService.getOrigMember(ctrl.editMember.$id).then(function (data) {
                        ctrl.editMember.fname = data.fname;
                        ctrl.editMember.lname = data.lname;
                        ctrl.editMember.compName = data.compName;
                        ctrl.editMember.email = data.email;
                        ctrl.editMember.img = data.img;
                    });
                };
            }],
            templateUrl: 'js/tabs/content/team-members/ui-team-members-tmpl.html',
            link: function () {

            }
        };
    }])
    ;
})
(window.angular);
