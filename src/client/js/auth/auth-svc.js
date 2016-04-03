(function () {
  'use strict';

  angular.module('tabs')
    .service('authService', AuthService);

  AuthService.$inject = ['Ref', '$firebaseAuth', 'userService'];
  function AuthService(Ref, $firebaseAuth, userService) {
    this.authObj = $firebaseAuth(Ref);
    this.userService = userService;
  }

  AuthService.prototype = {
    login: function (provider, user, password) {
      switch (provider) {
        case 'google':
        case 'facebook':
        case 'twitter':
          return this.authObj.$authWithOAuthPopup(provider)
              .then(this.saveUser.bind(this));
        case 'password':
          return this.authObj.$authWithPassword({
            email: user,
            password: password
          });
        default:
          return this.authObj.$authAnonymously();
      }
    },
    saveUser: function (authUserData) {
      return this.userService.saveUser(authUserData);
    },
    logout: function () {
      return this.authObj.$unauth();
    },
    getLoggedUser: function () {
      return this.authObj.$getAuth();
    }
  };
}());