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
    this.authObj = $firebaseAuth();
    this.mockData = mockData;

    this._currentUser = null;
    this._admin = false;
    this._adminListeners = [];
    this._userChangeListeners = [];

    this.authObj.$onAuthStateChanged(authData => {
      let adminPromise,
          userPromise;
      if (authData) {
        // Admin state
        adminPromise = this.$q.resolve(
            Ref.child('admins').child(authData.uid).once('value')
              .then(snap => this._admin = snap.exists())
        );

        // Save user
        userPromise = this.usersRef
            .child(authData.uid)
            .once('value')
            .then(user => this._currentUser = user.val());
      } else {
        // Admin state
        this._admin = false;
        adminPromise = this.$q.when(this._admin);

        // Current user
        this._currentUser = null;
        userPromise = this.$q.resolve(this._currentUser);
      }

      adminPromise.then((isAdmin) => {
        this._adminListeners.forEach((listener) => listener(isAdmin));
      });
      userPromise.then(user => {
        this._userChangeListeners.forEach(listener => listener(user));
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
      return this.$q.resolve(
        this.usersRef
            .orderByChild('email')
            .equalTo(email)
            .once('value')
            .then(function (snap) {
              return snap.exists();
            })
      );
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

    isAnonymousUser: function (uid) {
      if (!uid) {
        return this.$q.resolve(false);
      }
      return this.$q.resolve(
          this.usersRef
              .child(uid)
              .child('anonymous')
              .once('value')
              .then(snap => snap.exists())
      );
    },

    getCurrentUser: function () {
      if (!this._currentUser) {
        return null;
      }

      return this.getUser(this._currentUser.uid);
    },

    getCurrentUserId: function () {
      if (!this._currentUser) {
        return '';
      }

      return this._currentUser.uid;
    },

    /**
     * Gets user's data
     * @param {string} uid The user's identifier
     * @returns {Object} User's data
     */
    getUser: function (uid) {
      return this.$firebaseObject(this.usersRef.child(uid));
    },
    onAdminChange: function (listener) {
      this._adminListeners.push(listener);
      listener(this._admin);
      return () => {
        let idx = this._adminListeners.indexOf(listener);
        if (idx > -1) {
          this._adminListeners.splice(idx, 1);
        }
      };
    },

    onUserChange: function (listener) {
      this._userChangeListeners.push(listener);
      listener(this._currentUser);
      return () => {
        let idx = this._userChangeListeners.indexOf(listener);
        if (idx > -1) {
          this._userChangeListeners.splice(idx, 1);
        }
      };
    },

    addSubscriptionId: function (subscriptionId) {
      var subscription = {
        subscriptionId: subscriptionId
      };
      if (!this._currentUser) {
        return;
      }
      return this.usersRef
          .child(this._currentUser.uid)
          .child('devices')
          .orderByChild('subscriptionId')
          .equalTo(subscriptionId)
          .once('value')
          .then(snapshot => {
            if (!snapshot.exists()) {
              snapshot.ref.push().set(subscription);
            } else {
              console.log('this endpoint is already subscribed');
            }
          });
    },

    removeSubscriptionId: function (subscriptionId) {
      if (!this._currentUser) {
        return;
      }
      return this.usersRef
          .child(this._currentUser.uid)
          .child('devices')
          .orderByChild('subscriptionId')
          .equalTo(subscriptionId)
          .once('value')
          .then(snapArr => {
            if (snapArr.hasChildren()) {
              snapArr.forEach(deviceSnap => deviceSnap.ref.remove());
            }
          });
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