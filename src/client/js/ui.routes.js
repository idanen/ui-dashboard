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
      onEnter: loginModal
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

  loginModal.$inject = ['$state', '$uibModal'];
  function loginModal($state, $uibModal) {
    $uibModal.open({
      templateUrl: '/js/auth/login-tmpl.html',
      controller: 'LoginCtrl',
      controllerAs: 'login',
      bindToController: true
    }).result
      .then(function (/*user*/) {
          $state.go('widget', {widgetId: 0});
        });
  }
}());
