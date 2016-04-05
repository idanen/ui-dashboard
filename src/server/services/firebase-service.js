module.exports = (function () {
  var RestService = require('./rest-service.js'),
      consts = require('../config/consts.js');

  function FirebaseService() {
    this.rest = new RestService({
      baseUrl: consts.FIREBASE_URL_CI_STATUS,
      params: {
        auth: consts.FIREBASE_AUTH_TOKEN
      }
    });
  }

  FirebaseService.prototype = {
    fetch: function (ref) {
      return this.rest.fetch(ref);
    },
    update: function (ref, data) {
      return this.rest.save(ref, data);
    }
  };

  return FirebaseService;
}());
