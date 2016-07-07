/**
 * Created by entini on 30/07/2015.
 */
(function () {
    'use strict';
    angular.module('ci-site').controller('TeamMembersCtrl', TeamMembersController);

    TeamMembersController.$inject = ['TeamMembersService'];

    function TeamMembersController(teamMembersService) {
        var ctrl = this;
        this.members = teamMembersService.getMembers();
        this.addMember = function (member) {
            teamMembersService.addMember(member);
        };
        this.setEditMember = function (member) {
            ctrl.editMember = member;
        };
        this.saveMember = function () {
            teamMembersService.saveMemberInfo(ctrl.editMember);
        };
        this.cancelEditMember = function () {
            teamMembersService.getOrigMember(ctrl.editMember.$id).then(function (origMember) {
                ctrl.editMember.fname = origMember.fname;
                ctrl.editMember.lname = origMember.lname;
                ctrl.editMember.compName = origMember.compName;
                ctrl.editMember.email = origMember.email;
                ctrl.editMember.img = origMember.img;
            });
        };
    }
})();
