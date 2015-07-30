angular.module('tabs', ['firebase', 'ngSanitize', 'ui.select'])
    .constant('ENV', {
        HOST: 'localhost',
        PORT: '4000'
    })/*
    .config(['$stateProvider', '$locationProvider'/!*, '$urlRouterProvider'*!/, function config($stateProvider, $locationProvider/!*, $urlRouterProvider*!/) {
        $locationProvider.html5Mode(true);

        $stateProvider.state('members', {
            templateUrl: 'js/tabs/content/team-members/ui-team-members-tmpl.html',
            controller: 'TeamMembersCtrl as teamMembersCtrl'
        });
    }])*/;
angular.module('ui', ['tabs']);
