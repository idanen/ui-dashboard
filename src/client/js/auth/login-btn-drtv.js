(function () {
  'use strict';

  angular.module('tabs')
    .directive('loginBtn', loginBtnDirectiveFactory)
    .controller('LoginBtnCtrl', LoginBtnController);

  loginBtnDirectiveFactory.$inject = [];
  function loginBtnDirectiveFactory() {
    return {
      restrict: 'EA',
      template: `
        <div>
          <a class="btn btn-default" ui-sref="login" ng-hide="loginBtn.authData">Login</a>
          <a class="btn btn-link" ng-click="loginBtn.logout()" ng-show="loginBtn.authData">Hi, {{ loginBtn.authData.name }}! | Logout</a>
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

  LoginBtnController.$inject = ['Ref', '$firebaseAuth', 'authService'];
  function LoginBtnController(Ref, $firebaseAuth, authService) {
    this.authService = authService;
    this.authObj = $firebaseAuth(Ref);

    this.authObj.$onAuth(this.updateAuthState.bind(this));
  }

  LoginBtnController.prototype = {
    logout: function () {
      return this.authService.logout();
    },
    updateAuthState: function (authData) {
      this.authData = authData;
    }
  };
}());