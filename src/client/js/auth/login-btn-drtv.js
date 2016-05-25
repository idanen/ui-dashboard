(function () {
  'use strict';

  angular.module('ci-site')
    .directive('loginBtn', loginBtnDirectiveFactory)
    .controller('LoginBtnCtrl', LoginBtnController);

  loginBtnDirectiveFactory.$inject = [];
  function loginBtnDirectiveFactory() {
    return {
      restrict: 'EA',
      template: `
        <div>
          <a class="btn btn-default" ui-sref="login" ng-hide="loginBtn.authData">Login</a>
          <span ng-show="loginBtn.authData">
            <img class="profile-image img-circle" ng-src="{{loginBtn.extra.profileImageURL}}" alt="profile image">
            <a class="btn btn-link" ng-click="loginBtn.logout()">Hi, {{ loginBtn.authData.displayName }}! | Logout</a>
          </span>
        </div>
      `,
      controller: 'LoginBtnCtrl',
      controllerAs: 'loginBtn',
      link: function ($scope, $element) {
        var parentNavbar = $element.closest('.navbar');
        if (parentNavbar.length) {
          $element.find('.btn').addClass('navbar-btn');
        }
      }
    };
  }

  LoginBtnController.$inject = ['Ref', '$firebaseAuth', 'authService', 'userService'];
  function LoginBtnController(Ref, $firebaseAuth, authService, userService) {
    this.authService = authService;
    this.userService = userService;
    this.authObj = $firebaseAuth(Ref);

    this.authObj.$onAuth(this.updateAuthState.bind(this));
  }

  LoginBtnController.prototype = {
    logout: function () {
      return this.authService.logout();
    },
    updateAuthState: function (authData) {
      this.authData = authData;
      if (authData) {
        this.authData = this.userService.getUser(authData.uid);
        this.authData.$loaded().then((loadedData) => {
          this.extra = angular.extend({}, loadedData[loadedData.provider]);
        });
      }
    }
  };
}());