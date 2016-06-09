(function () {
  'use strict';

  angular.module('ci-site')
    .service('userService', UserService);

  UserService.$inject = ['Ref', '$q', '$window', '$firebaseObject'];
  function UserService(Ref, $q, $window, $firebaseObject) {
    this.usersRef = Ref.child('users');
    this.$q = $q;
    this.$window = $window;
    this.$firebaseObject = $firebaseObject;
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
      const userId = authData.uid,
            profile = authData.providerData[0];
      let toSave = {
        uid: userId,
        email: profile.email,
        displayName: profile.displayName || authData.email,
        photoURL: profile.photoURL || `https://secure.gravatar.com/avatar/${this.$window.escape(this.$window.btoa(authData.email))}?d=retro`
      };

      return this.$q((resolve, reject) => {
        this.usersRef.child(userId).transaction((currentUserData) => {
          if (currentUserData === null) {
            return toSave;
          }
        }, (error, committed) => {
          if (error) {
            reject(error);
          }
          if (!committed) {
            // TODO: decide what to do when user already exists.
            console.log(`User with uid "${authData.uid}" already exists`);
          }
          resolve(authData);
        });
      });
      //return this.$q.when(this.usersRef.set(authData));
    },
    /**
     * Gets user's data
     * @param {string} uid The user's identifier
     * @returns {Object} User's data
     */
    getUser: function (uid) {
      return this.$firebaseObject(this.usersRef.child(uid));
    }
  };
}());