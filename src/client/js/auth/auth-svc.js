(function () {
  'use strict';

  angular.module('ci-site')
      .constant('GOOGLE_AUTH_SCOPES', ['profile', 'email', 'https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'])
      .service('authService', AuthService);

  AuthService.$inject = ['$firebaseAuth', '$window', 'userService', 'GOOGLE_AUTH_SCOPES'];
  function AuthService($firebaseAuth, $window, userService, GOOGLE_AUTH_SCOPES) {
    this.authObj = $firebaseAuth();
    this.$window = $window;
    this.userService = userService;
    this.GOOGLE_AUTH_SCOPES = GOOGLE_AUTH_SCOPES;
  }

  AuthService.prototype = {
    login: function (provider, remember, user, password) {
      switch (provider) {
        case 'google':
          let googleProvider = new this.$window.firebase.auth.GoogleAuthProvider();
          this.GOOGLE_AUTH_SCOPES.forEach(scope => googleProvider.addScope(scope));
          return this.authObj.$signInWithPopup(googleProvider)
              .then(this.saveUser.bind(this))
              .catch(console.error.bind(console));
        case 'facebook':
        case 'twitter':
          return this.authObj.$signInWithPopup(provider)
              .then(this.saveUser.bind(this));
        case 'password':
          return this.authObj.$signInWithEmailAndPassword(user, password)
              .then(this.saveUser.bind(this));
        default:
          return this.authObj.$signInAnonymously();
      }
    },
    saveUser: function (authUserData) {
      const profile = authUserData.providerData[0];
      authUserData.email = profile.email;
      authUserData.displayName = profile.displayName || authUserData.email;
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