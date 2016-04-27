(function () {
  'use strict';

  angular.module('tabs')
    .config(configRoutes);

  configRoutes.$inject = ['$stateProvider', '$urlRouterProvider', 'laddaProvider'];
  function configRoutes($stateProvider, $urlRouterProvider, laddaProvider) {
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
          url: '^/:widgetId',
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
          onEnter: loginModal,
          resolve: {
            previousState: previousStateResolver
          }
        },
        compare = {
          name: 'compare',
          parent: home,
          url: '^/compare/:buildName/:buildNumber/:toBuildName/:toBuildNumber',
          templateUrl: '/js/tabs/content/compare/compare-tmpl.html',
          controller: 'CompareCtrl',
          controllerAs: 'compare',
          resolve: {
            build: ['$stateParams', ($stateParams) => {
              return {
                name: $stateParams.buildName,
                number: $stateParams.buildNumber
              };
            }],
            toBuild: ['$stateParams', ($stateParams) => {
              if ($stateParams.toBuildName && $stateParams.toBuildNumber) {
                return {
                  name: $stateParams.toBuildName,
                  number: $stateParams.toBuildNumber
                };
              }
              return {};
            }]
          }
        };

    laddaProvider.setOption({
      style: 'expand-right'
    });

    //$locationProvider.html5Mode(true);

    $stateProvider.state(home);
    $stateProvider.state(widget);
    $stateProvider.state(login);
    $stateProvider.state(compare);

    $urlRouterProvider.otherwise('/cistatus');
  }

  widgetResolver.$inject = ['$stateParams', 'UiFacadeService'];
  function widgetResolver($stateParams, UiFacadeService) {
    return UiFacadeService.getById($stateParams.widgetId);
  }

  userResolver.$inject = ['$firebaseAuth', 'Ref'];
  function userResolver($firebaseAuth, Ref) {
    return $firebaseAuth(Ref).requireAuth();
  }

  previousStateResolver.$inject = ['$state'];
  function previousStateResolver($state) {
    return {
      name: $state.current.name,
      params: $state.params
    };
  }

  loginModal.$inject = ['$state', 'modalService', 'previousState'];
  function loginModal($state, modalService, previousState) {
    modalService.open({
      controller: 'LoginCtrl'
    }).result
      .then(function (user) {
          console.log('Successfully logged in with user ', user);
          $state.go(previousState.name, previousState.params);
        })
      .catch(function (reason) {
          console.log('Login dismissed with reason: ' + reason);
          $state.go(previousState.name, previousState.params);
        });
  }
}());
