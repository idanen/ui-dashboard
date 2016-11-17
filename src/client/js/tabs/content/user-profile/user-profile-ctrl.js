(function () {
  'use strict';

  angular.module('ci-site')
      .controller('UserConfigsCtrl', UserConfigsController);

  UserConfigsController.$inject = ['$state', 'userService', 'authService', 'currentUser', '$scope'];
  function UserConfigsController($state, userService, authService, currentUser, $scope) {
    this.$state = $state;
    this.userService = userService;
    this.authService = authService;
    this.user = currentUser;
    this.$scope = $scope;
    this.isAnon = true;
    this.loginOpen = false;

    this.loginOptions = [
      {
        name: 'Log In',
        value: 'login'
      },
      {
        name: 'Sign Up',
        value: 'password'
      },
      {
        name: 'Log In with Google',
        value: 'google'
      }
    ];
    this.selectedLoginOption = this.loginOptions[0].value;

    this.userService.onUserChange(user => {
      if (!user) {
        this.user = null;
        this.isAnon = false;
      } else {
        this.user = this.userService.getUser(user.uid);
        this.userService.isAnonymousUser(user.uid)
            .then(isAnonymous => this.isAnon = isAnonymous);
      }
    });
  }

  UserConfigsController.prototype = {
    login: function () {
      console.log('logging in');
      return this.userService.login('password', this.email, this.password)
          .then(this.closeLogin.bind(this));
    },
    loginWithProvider: function (provider = 'google') {
      if (this.user && !this.isAnon) {
        return;
      }

      if (!this.user || this.user && this.isAnon) {
        console.log('logging in with provider');
        this.logout();
        return this.userService.login(provider)
            .then(this.closeLogin.bind(this));
      }
      console.log('signing up with provider');
      return this.signup();
    },
    signup: function () {
      console.log('signing up');
      return this.userService.signUp(this.displayName, this.email, this.password, this.selectedLoginOption)
          .then(this.closeLogin.bind(this));
    },
    logout: function () {
      this.authService.logout();
      this.openLogin();
    },
    openLogin: function () {
      this.loginOpen = true;
    },
    closeLogin: function () {
      this.loginOpen = false;
    },
    changeLoginOption: function (loginOption) {
      this.$scope.$applyAsync(() => this.selectedLoginOption = loginOption);
      console.log(this.selectedLoginOption);
    }
  };
}());

