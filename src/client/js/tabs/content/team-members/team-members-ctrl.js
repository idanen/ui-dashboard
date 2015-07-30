/**
 * Created by entini on 30/07/2015.
 */
(function () {
    'use strict';
    angular.module('tabs').controller('TeamMembersCtrl', TeamMembersController);

    TeamMembersController.$inject = ['TeamMembersService'];

    function TeamMembersController(TeamMembersService) {
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
    }
})();
