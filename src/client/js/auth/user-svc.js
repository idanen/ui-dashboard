(function () {
  'use strict';

  angular.module('tabs')
    .service('userService', UserService);

  UserService.$inject = ['Ref', '$q'];
  function UserService(Ref, $q) {
    this.usersRef = Ref.child('users');
    this.$q = $q;
  }

  UserService.prototype = {
    /**
     * Checks if given user exists
     * @param email User's email to check by
     * @returns {Promise} A promise which resolves with the existence result (boolean value)
     */
    exists: function (email) {
      return this.$q(function (resolve, reject) {
        this.usersRef.orderByChild('email').equalTo(email).once('value', function (snap) {
          resolve(snap.val() !== null);
        }, function (error) {
          reject(error);
        });
      }.bind(this));
    },
    /**
     * Saves an authenticated user
     * @param {Object} authData The authenticated user's data
     * @returns {Promise} A promise which resolves with user's authentication data
     */
    saveUser: function (authData) {
      var userId = authData.uid;
      this.usersRef.child(userId).transaction(function(currentUserData) {
        if (currentUserData === null) {
          return authData;
        }
      }.bind(this), function(error, committed) {
        if (error) {
          return this.$q.reject(error);
        }
        if (!committed) {
          // TODO: decide what to do when user already exists.
          console.log(`User with uid "${authData.uid}" already exists`);
        }
        return this.$q.when(committed);
      }.bind(this));
      return this.$q.when(this.usersRef.set(authData));
    }
  };
}());