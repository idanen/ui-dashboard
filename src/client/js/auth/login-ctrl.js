(function () {
  angular.module('ui')
    .controller('LoginCtrl', LoginController);

  LoginController.$inject = ['$state', 'authService'];
  function LoginController($state, authService) {
    this.$state = $state;
    this.auth = authService;
  }

  LoginController.prototype = {
    login: function () {
      return this.auth.login('password', this.email, this.password)
        .then(this.postLogin.bind(this))
        .catch(function (error) {
            console.error(error);
          });
    },
    loginWithProvider: function (provider) {
      return this.auth.login(provider)
        .then(this.postLogin.bind(this));
    },
    postLogin: function () {
      return this.$state.go('home');
    }
  };
}());