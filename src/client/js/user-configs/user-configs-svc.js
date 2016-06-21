(function () {
  'use strict';

  angular.module('ci-site')
      .service('userConfigs', UserConfigs);

  UserConfigs.$inject = ['Ref', '$firebaseObject', '$firebaseAuth', '$q'];
  function UserConfigs(Ref, $firebaseObject, $firebaseAuth, $q) {
    this.$firebaseObject = $firebaseObject;
    this.globalConfigRef = Ref.child('config/global');
    this.configsRef = Ref.child('config');
    this.$q = $q;
    this.authChangeListeners = [];

    $firebaseAuth().$onAuthStateChanged((authState) => {
      if (authState) {
        this.userId = authState.uid;
        this.configsRef = Ref.child('config').child(this.userId);
      } else {
        this.userId = null;
        this.configsRef = null;
      }
      this.authChangeListeners.forEach((listener) => {
        if (_.isFunction(listener)) {
          listener(this.userId);
        }
      });
    });
  }

  UserConfigs.prototype = {
    getGlobalConfig: function () {
      return this.$firebaseObject(this.globalConfigRef);
    },
    getUserConfig: function () {
      if (this.configsRef) {
        return this.$firebaseObject(this.configsRef);
      }

      return null;
    },
    registerForAuthChange: function (listener) {
      this.authChangeListeners.push(listener);
    },
    initConfigs: function () {
      let configsToSave = {
        statusFilter: {
          masters: {},
          teams: {}
        }
      };
      
      if (!this.userId) {
        return;
      }

      return this.$q((resolve, reject) => {
        this.configsRef.child(this.userId).transaction((currentUserConfigs) => {
          if (currentUserConfigs === null) {
            return configsToSave;
          }
        }, (error/*, committed*/) => {
          if (error) {
            reject(error);
          }
          // Resolve with fetched configs
          resolve(this.getUserConfig());
        });
      });
    }
  };
}());
