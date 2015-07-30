(function (angular) {
    'use strict';

    angular.module('tabs').directive('uiTeamMembers', [function () {
        return {
            restrict: 'E',
            controllerAs: 'teamMembersCtrl',
            controller: 'TeamMembersCtrl',
            templateUrl: 'js/tabs/content/team-members/ui-team-members-tmpl.html'
        };
    }])
    ;
})
(window.angular);
