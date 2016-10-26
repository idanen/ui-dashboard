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
    this._configsChangesListeners = [];

    $firebaseAuth().$onAuthStateChanged((authState) => {
      if (authState) {
        this.userId = authState.uid;
        this.configsRef = Ref.child('config').child(this.userId);
      } else {
        this.userId = null;
        this.configsRef = null;
      }
      this.publishConfigsChanged();
    });
  }

  UserConfigs.prototype = {
    getGlobalConfig: function (configKey) {
      return this._getConfig(configKey);
    },
    getUserConfig: function (configKey) {
      return this._getConfig(configKey, 'user');
    },
    _getConfig: function (configKey, which = 'global') {
      let ref;
      switch (which) {
        case 'user':
          ref = this.configsRef;
          break;
        default:
          ref = this.globalConfigRef;
          break;
      }

      if (!configKey || !_.isString(configKey)) {
        return this.$firebaseObject(ref);
      }

      if (ref) {
        return this.$firebaseObject(ref.child(configKey));
      }

      return null;
    },
    registerForConfigsChanges: function (listener) {
      if (_.isFunction(listener)) {
        this._configsChangesListeners.push(listener);
        listener(this.userId);
      }
    },
    getUnboundConfig: function (configKey) {
      if (configKey) {
        return this.$q.resolve(
            this.globalConfigRef
                .child(configKey)
                .once('value')
                .then(snap => snap.val())
        );
      }

      return this.$q.resolve(
          this.globalConfigRef
              .once('value')
              .then(snap => snap.val())
      );
    },
    publishConfigsChanged: function () {
      this._configsChangesListeners.forEach((listener) => {
        if (_.isFunction(listener)) {
          listener(this.userId);
        }
      });
    }
  };
}());
