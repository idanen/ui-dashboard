(function () {
  'use strict';

  angular.module('ci-site')
      .constant('GOOGLE_AUTH_SCOPES', ['profile', 'email', 'https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'])
      .service('authService', AuthService);

  AuthService.$inject = ['$firebaseAuth', '$window', '$q', 'userService', 'GOOGLE_AUTH_SCOPES'];
  function AuthService($firebaseAuth, $window, $q, userService, GOOGLE_AUTH_SCOPES) {
    this.authObj = $firebaseAuth();
    this.$window = $window;
    this.$q = $q;
    this.userService = userService;
    this.GOOGLE_AUTH_SCOPES = GOOGLE_AUTH_SCOPES;
  }

  AuthService.prototype = {
    login: function (provider, user, password) {
      var loginPromise;
      switch (provider) {
        case 'google':
          let googleProvider = new this.$window.firebase.auth.GoogleAuthProvider();
          this.GOOGLE_AUTH_SCOPES.forEach(scope => googleProvider.addScope(scope));
          loginPromise = this.authObj.$signInWithPopup(googleProvider);
          break;
        case 'facebook':
        case 'twitter':
          loginPromise = this.authObj.$signInWithPopup(provider);
          break;
        case 'password':
          loginPromise = this.authObj.$signInWithEmailAndPassword(user, password);
          break;
        default:
          loginPromise = this.authObj.$signInAnonymously();
          break;
      }

      return loginPromise
          .then(this.saveUser.bind(this))
          .catch(error => console.error(error));
    },
    createConfig: function (authResult) {
      // TODO: create user's config
    },
    saveUser: function (authResult) {
      const authUserData = _.extend({}, authResult.user);
      return this.userService.saveUser(authUserData);
    },
    logout: function () {
      return this.authObj.$signOut();
    },
    getLoggedUser: function () {
      return this.authObj.$getAuth();
    }
  };
}());