(function (angular) {
    'use strict';

    angular.module('tabs').directive('uiTeamMembers', ['TeamMembersService', function (TeamMembersService) {
            return {
                restrict: 'E',
                controllerAs: 'teamMembersCtrl',
                controller: [function () {
                    var ctrl = this;

                }],
                templateUrl: 'js/tabs/content/team-members/ui-team-members-tmpl.html',
                link: function ($scope, element, attributes, controller) {
                    $scope.members = TeamMembersService.members;
                    $scope.addMember = function (member) {
                        TeamMembersService.addMember(member);
                    };
                }
            };
        }])
    ;
})
(window.angular);
