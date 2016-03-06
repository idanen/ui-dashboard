(function () {
    'use strict';

    angular.module('tabs', ['firebase', 'ngSanitize', 'ui.router', 'ui.select', 'angular-ladda', 'ngclipboard'])
        .constant('ENV', {
            //HOST: 'myd-vm01818.hpswlabs.adapps.hp.com',
            HOST: 'localhost',
            PORT: '4000'
        })
        .constant('DATE_FORMAT', 'HH:mm dd/MM/yyyy')
        .constant('NotificationTags', {
          PUSH_Q: 'PushQueueNotification',
          BRANCH_OWNER_Q: 'BranchOwnerNotification'
        })
        .config(configApp)
        .run(initApp);
        /*.config(['$stateProvider', '$locationProvider'/!*, '$urlRouterProvider'*!/, function config($stateProvider, $locationProvider/!*, $urlRouterProvider*!/) {
             $locationProvider.html5Mode(true);

             $stateProvider.state('members', {
             templateUrl: 'js/tabs/content/team-members/ui-team-members-tmpl.html',
             controller: 'TeamMembersCtrl as teamMembersCtrl'
         });
     }])*/
    angular.module('ui', ['tabs']);

    configApp.$inject = ['$stateProvider', '$urlRouterProvider', 'laddaProvider'];
    function configApp($stateProvider, $urlRouterProvider, laddaProvider) {
        var home = {
                name: 'home',
                url: '/',
                templateUrl: '/js/ui-facade/ui-facade-tmpl.html',
                controller: 'UiFacadeCtrl',
                controllerAs: 'facade'
            },
            widget = {
                name: 'widget',
                url: '/widget/{widgetId:int}',
                template: '<div ng-include="widgetCtrl.widget.contentUrl"></div>',
                controller: 'WidgetCtrl',
                controllerAs: 'widgetCtrl',
                resolve: {
                    widget: widgetResolver
                }
            };

        laddaProvider.setOption({
            style: 'expand-right'
        });

        //$locationProvider.html5Mode(true);

        $stateProvider.state(home);
        $stateProvider.state(widget);

        $urlRouterProvider.otherwise('/widget/0');
    }

    widgetResolver.$inject = ['$stateParams', 'UiFacadeService'];
    function widgetResolver($stateParams, UiFacadeService) {
        return UiFacadeService.getById($stateParams.widgetId);
    }

    initApp.$inject = ['ShoutOutsService'];
    function initApp(shoutOutsService) {
        shoutOutsService.init();
    }
})();
