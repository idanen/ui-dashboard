(function () {
  'use strict';

  angular.module('ci-site')
    .service('userService', UserService);

  UserService.$inject = ['Ref', '$q', '$window', '$firebaseObject', '$firebaseAuth', 'mockData', 'GOOGLE_AUTH_SCOPES'];
  function UserService(Ref, $q, $window, $firebaseObject, $firebaseAuth, mockData, GOOGLE_AUTH_SCOPES) {
    this.usersRef = Ref.child('users');
    this.$q = $q;
    this.$window = $window;
    this.$firebaseObject = $firebaseObject;
    this.authObj = $firebaseAuth();
    this.mockData = mockData;
    this.GOOGLE_AUTH_SCOPES = GOOGLE_AUTH_SCOPES;

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
            Ref.child('admins')
              .child(authData.uid)
              .once('value')
              .then(snap => this._admin = snap.exists())
        );

        // Save user
        userPromise = this.$q.resolve(
            this.usersRef
              .child(authData.uid)
              .once('value')
              .then(user => this._currentUser = user.val())
        );
      } else {
        // Admin state
        this._admin = false;
        adminPromise = this.$q.resolve(this._admin);

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
            .then(snap => snap.exists())
      );
    },
    /**
     * Saves an authenticated user
     * @param {Object} authData The authenticated user's data
     * @param {string} [displayName] The name to save for the user. This should be used when signing up a user with email and password (other services will provide `displayName`s)
     * @returns {Promise} A promise which resolves with user's authentication data
     */
    saveUser: function (authData, displayName) {
      const userId = authData.uid,
            profile = authData.providerData[0],
            generatedPhotoURL = profile.email ? this.mockData.getImageUrl(profile.email) : this.mockData.getImageUrl(authData.uid);
      let toSave = {
        uid: userId,
        email: profile.email,
        displayName: profile.displayName || displayName || profile.email,
        // photoURL: profile.photoURL || `https://secure.gravatar.com/avatar/${this.$window.escape(this.$window.btoa(profile.email))}?d=retro`
        photoURL: profile.photoURL || generatedPhotoURL,
        anonymous: authData.isAnonymous
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
            resolve(
                this.usersRef
                    .child(authData.uid)
                    .update(toSave)
            );
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
              .then(snap => snap.exists() && snap.val())
      );
    },

    /**
     * Logs a user in
     * @param {string} provider The method to use to log the user in
     * @param {string} [email] The user's email. Required only when logging in with `password`.
     * @param {string} [password] The user's password. Required only when logging in with `password`.
     * @returns {Promise<Object>} A promise with the logged in user
     */
    login: function (provider, email, password) {
      var loginPromise;
      switch (provider) {
        case 'google':
          loginPromise = this.authObj.$signInWithPopup(this.createGoogleProvider());
          break;
          // case 'facebook':
          // case 'twitter':
          //   loginPromise = this.authObj.$signInWithPopup(provider);
          //   break;
        case 'password':
          loginPromise = this.authObj.$signInWithEmailAndPassword(email, password);
          break;
        default:
          loginPromise = this.authObj.$signInAnonymously();
          break;
      }

      return loginPromise
          .then(authData => this.getUser(authData.user.uid))
          .catch(error => console.error(error));
    },

    /**
     * Signs up a new user
     * @param {string} [displayName] User's name. Required only when logging in with `password`.
     * @param {string} [email] User's email address. Required only when logging in with `password`.
     * @param {string} [password] User's password. Required only when logging in with `password`.
     * @param {string} [providerType='password'] Sign up method. Available values are 'password' or 'google'
     * @returns {*|Promise<Object>} A promise with the newly saved user.
     * @throws When `providerType` is `password` and one of the inputs is illegal or a signed up user is currently logged in
     */
    signUp: function (displayName, email, password, providerType = 'password') {
      if (providerType === 'google') {
        let googleProvider = this.createGoogleProvider();

        if (this._currentUser && this._currentUser.anonymous) {
          return this.authObj.$getAuth().linkWithPopup(googleProvider)
              .then(this.saveUser.bind(this));
        }
        return this.authObj.$signInWithPopup(googleProvider)
            .then(this.saveUser.bind(this));
      }

      if (providerType === 'password') {
        if (!/@hpe\.com$/.test(email)) {
          throw new Error(`You can login with an HPE email only (tried "${email}")`);
        }
        if (password.length < 6) {
          throw new Error(`Password should be at least 6 characters`);
        }
        if (this._currentUser && !this._currentUser.anonymous) {
          throw new Error('A logged in user tries to sign up');
        }

        if (this._currentUser && this._currentUser.anonymous) {
          let credential = this.$window.firebase.auth.EmailAuthProvider.credential(email, password);
          return this.authObj.$getAuth().link(credential)
              .then(authData => this.saveUser(authData, displayName));
        }
        return this.authObj.$createUserWithEmailAndPassword(email, password)
            .then(authData => this.saveUser(authData, displayName));
      }
    },

    /**
     * Helper method that creates the provider we need to log a user in using `GoogleAuthProvider`
     * @returns {firebase.auth.GoogleAuthProvider} A google auth provider
     */
    createGoogleProvider: function () {
      let googleProvider = new this.$window.firebase.auth.GoogleAuthProvider();
      this.GOOGLE_AUTH_SCOPES.forEach(scope => googleProvider.addScope(scope));

      return googleProvider;
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
     * @returns {FirebaseObject} User's data
     */
    getUser: function (uid) {
      return this.$firebaseObject(this.usersRef.child(uid));
    },

    /**
     * Gets user's data asynchronously
     * @param {string} uid The user's identifier
     * @returns {Promise<Object>} A promise with the requested user
     */
    getUnboundUser: function (uid) {
      return this.$q.resolve(
          this.usersRef
              .child(uid)
              .once('value')
              .then(snap => snap.val())
      );
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