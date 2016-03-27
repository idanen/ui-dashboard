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
    angular.module('ui', ['tabs']);

    configApp.$inject = ['$stateProvider', '$urlRouterProvider', 'laddaProvider'];
    function configApp($stateProvider, $urlRouterProvider, laddaProvider) {
        var home = {
                name: 'home',
                url: '/?:teamId',
                templateUrl: '/js/ui-facade/ui-facade-tmpl.html',
                controller: 'UiFacadeCtrl',
                controllerAs: 'facade'
            },
            widget = {
                name: 'widget',
                parent: home,
                url: '^/widget/{widgetId:int}',
                template: '<div ng-include="widgetCtrl.widget.contentUrl"></div>',
                controller: 'WidgetCtrl',
                controllerAs: 'widgetCtrl',
                resolve: {
                    //user: userResolver,
                    widget: widgetResolver
                }
            },
            login = {
                name: 'login',
                url: '/login',
                templateUrl: '/js/auth/login-tmpl.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
            };

        laddaProvider.setOption({
            style: 'expand-right'
        });

        //$locationProvider.html5Mode(true);

        $stateProvider.state(home);
        $stateProvider.state(widget);
        $stateProvider.state(login);

        $urlRouterProvider.otherwise('/widget/0');
    }

    widgetResolver.$inject = ['$stateParams', 'UiFacadeService'];
    function widgetResolver($stateParams, UiFacadeService) {
        return UiFacadeService.getById($stateParams.widgetId);
    }

    userResolver.$inject = ['$firebaseAuth', 'Ref'];
    function userResolver($firebaseAuth, Ref) {
        return $firebaseAuth(Ref).requireAuth();
    }

    initApp.$inject = ['$rootScope', '$state', 'ShoutOutsService'];
    function initApp($rootScope, $state, shoutOutsService) {
        shoutOutsService.init();

        $rootScope.$on('$routeChangeError', function (event, next, previous, error) {
            console.log(error);
            //event.preventDefault();
            //if (error === 'AUTH_REQUIRED') {
            //    $state.go('login');
            //}
        });
    }
})();
