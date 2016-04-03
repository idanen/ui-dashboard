(function () {
  'use strict';

  angular.module('ui')
    .controller('LoginCtrl', LoginController);

  LoginController.$inject = ['$state', '$uibModalInstance', 'authService'];
  function LoginController($state, $uibModalInstance, authService) {
    this.$state = $state;
    this.$uibModalInstance = $uibModalInstance;
    this.auth = authService;
  }

  LoginController.prototype = {
    login: function () {
      return this.auth.login('password', this.email, this.password)
        .then(this.postLogin.bind(this))
        .catch(function (error) {
          console.error(error);
          this.$uibModalInstance.dismiss(error);
        }.bind(this));
    },
    loginWithProvider: function (provider) {
      return this.auth.login(provider)
        .then(this.postLogin.bind(this))
        .catch(function (error) {
          console.error(error);
          this.$uibModalInstance.dismiss(error);
        }.bind(this));
    },
    postLogin: function (user) {
      this.$uibModalInstance.close(user);
    }
  };
}());