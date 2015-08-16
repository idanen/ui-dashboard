(function () {
    'use strict';

    angular.module('tabs', ['firebase', 'ngSanitize', 'ui.select', 'angular-ladda'])
        .constant('ENV', {
            HOST: 'myd-vm01818.hpswlabs.adapps.hp.com',
            PORT: '4000'
        })
        .constant('DATE_FORMAT', 'HH:mm dd/MM/yyyy')
        .config(['$locationProvider', 'laddaProvider', function ($locationProvider, laddaProvider) {
            laddaProvider.setOption({
                style: 'expand-right'
            });

            $locationProvider.html5Mode(true);
        }])
        /*.config(['$stateProvider', '$locationProvider'/!*, '$urlRouterProvider'*!/, function config($stateProvider, $locationProvider/!*, $urlRouterProvider*!/) {
             $locationProvider.html5Mode(true);

             $stateProvider.state('members', {
             templateUrl: 'js/tabs/content/team-members/ui-team-members-tmpl.html',
             controller: 'TeamMembersCtrl as teamMembersCtrl'
         });
     }])*/;
    angular.module('ui', ['tabs']);
})();
