(function () {
  'use strict';

  angular.module('ci-site')
    .service('userService', UserService);

  UserService.$inject = ['Ref', '$q', '$window', '$firebaseObject', '$firebaseAuth', 'mockData'];
  function UserService(Ref, $q, $window, $firebaseObject, $firebaseAuth, mockData) {
    this.usersRef = Ref.child('users');
    this.$q = $q;
    this.$window = $window;
    this.$firebaseObject = $firebaseObject;
    this.mockData = mockData;

    this._admin = false;
    this._adminListeners = [];

    $firebaseAuth().$onAuthStateChanged(authData => {
      let promise;
      if (authData) {
        promise = this.$q.when(
            Ref.child('admins').child(authData.uid).once('value')
              .then(snap => this._admin = snap.exists())
        );
      } else {
        this._admin = false;
        promise = this.$q.when(this._admin);
      }

      promise.then((isAdmin) => {
        this._adminListeners.forEach((listener) => listener(isAdmin));
      });
    });
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
            profile = authData.providerData[0],
            generatedPhotoURL = profile.email ? this.mockData.getImageUrl(profile.email) : this.mockData.getImageUrl(authData.uid);
      let toSave = {
        uid: userId,
        email: profile.email,
        displayName: profile.displayName || profile.email,
        // photoURL: profile.photoURL || `https://secure.gravatar.com/avatar/${this.$window.escape(this.$window.btoa(profile.email))}?d=retro`
        photoURL: profile.photoURL || generatedPhotoURL
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
    saveAnonymousUser: function (anonymous) {
      return this.$q.resolve(
          this.usersRef.child(anonymous.uid).set(anonymous)
      );
    },
    /**
     * Gets user's data
     * @param {string} uid The user's identifier
     * @returns {Object} User's data
     */
    getUser: function (uid) {
      return this.$firebaseObject(this.usersRef.child(uid));
    },
    listenToAdminChanges: function (listener) {
      this._adminListeners.push(listener);
      listener(this._admin);
    },
    stopListeningToAdminChanges: function (listener) {
      let idx = this._adminListeners.indexOf(listener);
      if (idx > -1) {
        this._adminListeners.splice(idx, 1);
      }
    },
    /**
     * Says weather the user is an admin
     * @returns {boolean|*} `true` if the user is an admin, `false` otherwise
     */
    isAdmin: function () {
      return this._admin;
    }
  };
}());