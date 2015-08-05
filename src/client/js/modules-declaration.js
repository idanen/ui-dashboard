(function () {
    'use strict';

    angular.module('tabs', ['firebase', 'ngSanitize', 'ui.select', 'angular-ladda'])
        .constant('ENV', {
            HOST: 'localhost',
            PORT: '4000'
        }).config(['laddaProvider', function (laddaProvider) {
            laddaProvider.setOption({
                style: 'expand-right'
            });
        }])/*.config(['$stateProvider', '$locationProvider'/!*, '$urlRouterProvider'*!/, function config($stateProvider, $locationProvider/!*, $urlRouterProvider*!/) {
             $locationProvider.html5Mode(true);

             $stateProvider.state('members', {
             templateUrl: 'js/tabs/content/team-members/ui-team-members-tmpl.html',
             controller: 'TeamMembersCtrl as teamMembersCtrl'
         });
     }])*/;
    angular.module('ui', ['tabs']);
})();
