(function () {
  'use strict';

  angular.module('ci-site')
      .controller('UserConfigsCtrl', UserConfigsController);

  UserConfigsController.$inject = ['userService', 'currentUser'];
  function UserConfigsController(userService, currentUser) {
    this.userService = userService;
    this.user = currentUser;

    this.userService.onUserChange(user => {
      if (!user) {
        this.user = null;
      } else {
        this.user = this.userService.getUser(user.uid);
      }
    });
  }

  UserConfigsController.prototype = {

  };
}());

