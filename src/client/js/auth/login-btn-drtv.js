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
          <div class="user-links" ng-show="loginBtn.authData">
            <img class="profile-image img-circle" ng-src="{{loginBtn.authData.photoURL}}" alt="profile image">
            <a class="btn-link">Hi, {{ loginBtn.authData.displayName }}!</a>
            <a class="btn-link" ng-click="loginBtn.logout()">Logout</a>
            <a class="btn-link under-construction" ui-sref="login" ng-show="loginBtn.authData.anonymous" uib-tooltip="Link to a user account to add email and set a real name :)">Link</a>
          </div>
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

  LoginBtnController.$inject = ['$firebaseAuth', 'authService', 'userService'];
  function LoginBtnController($firebaseAuth, authService, userService) {
    this.authService = authService;
    this.userService = userService;
    this.authObj = $firebaseAuth();

    this.authObj.$onAuthStateChanged(this.updateAuthState.bind(this));
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
          this.extra = angular.extend({}, loadedData);
        });
      }
    }
  };
}());