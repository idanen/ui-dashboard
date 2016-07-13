descrice('firebase-service', function () {
  var FirebaseService = require('../../../src/server/services/firebase-service'),
      RestService, firebase;
  
  beforeEach(function () {
    RestService = jasmine.createSpy('');
    firebase = new FirebaseService();
  });
});