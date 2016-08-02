(function () {
  'use strict';

  angular.module('ci-site')
    .config(configRoutes);

  configRoutes.$inject = ['$stateProvider', '$urlRouterProvider', 'laddaProvider'];
  function configRoutes($stateProvider, $urlRouterProvider, laddaProvider) {
    var home = {
          name: 'home',
          url: '/',
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
        userProfile = {
          name: 'userprofile',
          parent: home,
          url: '^/user/:userId?newUid',
          templateUrl: '/js/tabs/content/user-profile/user-profile-tmpl.html',
          controller: 'UserConfigsCtrl',
          controllerAs: '$ctrl',
          resolve: {
            currentUser: userResolver
          }
        },
        login = {
          name: 'login',
          url: '/login?newUser',
          onEnter: loginModal,
          resolve: {
            previousState: previousStateResolver
          }
        },
        compare = {
          name: 'compare',
          parent: home,
          url: '^/compare/:group/:buildName/:buildNumber/:toGroup/:toBuildName/:toBuildNumber',
          templateUrl: '/js/tabs/content/compare/compare-tmpl.html',
          controller: 'CompareCtrl',
          controllerAs: 'compare',
          resolve: {
            build: ['$stateParams', ($stateParams) => {
              return {
                group: $stateParams.group,
                name: $stateParams.buildName,
                number: $stateParams.buildNumber
              };
            }],
            toBuild: ['$stateParams', ($stateParams) => {
              if ($stateParams.toGroup && $stateParams.toBuildName && $stateParams.toBuildNumber) {
                return {
                  group: $stateParams.toGroup,
                  name: $stateParams.toBuildName,
                  number: $stateParams.toBuildNumber
                };
              }
              return {};
            }]
          }
        },
        stability = {
          name: 'stability',
          parent: home,
          url: '^/stability/:group/:buildName/:buildNumber',
          templateUrl: '/js/tabs/content/stability/stability-tmpl.html',
          controller: 'CIStabilityCtrl',
          controllerAs: '$ctrl',
          params: {tests: []},
          resolve: {
            build: ['$stateParams', ($stateParams) => {
              return {
                group: $stateParams.group,
                name: $stateParams.buildName,
                number: $stateParams.buildNumber
              };
            }]
          }
        };

    laddaProvider.setOption({
      style: 'expand-right'
    });

    //$locationProvider.html5Mode(true);

    $stateProvider.state(home);
    $stateProvider.state(widget);
    $stateProvider.state(userProfile);
    $stateProvider.state(login);
    $stateProvider.state(compare);
    $stateProvider.state(stability);

    $urlRouterProvider.otherwise('/cistatus');
  }

  widgetResolver.$inject = ['$stateParams', 'UiFacadeService'];
  function widgetResolver($stateParams, UiFacadeService) {
    return UiFacadeService.getById($stateParams.widgetId);
  }

  userResolver.$inject = ['$q', '$firebaseAuth', 'userService'];
  function userResolver($q, $firebaseAuth, userService) {
    return $firebaseAuth().$requireSignIn()
        // .then(authData => {
        //   return userService.isAnonymousUser(authData.uid);
        // })
        // .then(isAnonymous => {
        //   if (isAnonymous) {
        //     return $q.reject('Not available for anonymous users');
        //   }
        //
        //   return userService.getCurrentUser();
        // });
        .then(() => {
          return userService.getCurrentUser();
        });
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
        if (!!$state.params.newUser) {
          $state.go(previousState.name, _.extend(previousState.params, {newUser: $state.params.newUser}));
        } else {
          $state.go(previousState.name, previousState.params);
        }
      })
      .catch(function (reason) {
          console.log('Login dismissed with reason: ' + reason);
          $state.go(previousState.name, previousState.params);
        });
  }
}());
