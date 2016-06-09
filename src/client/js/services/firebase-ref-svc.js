(function () {
  'use strict';

  angular
      .module('ci-site')
      .constant('FB_URL', 'https://boiling-inferno-9766.firebaseio.com')
      .constant('FB_INIT_CONFIG', {
        apiKey: 'AIzaSyCzvo7D5VdItoNiDgvhLb35V6xY2sKSsyY',
        authDomain: 'boiling-inferno-9766.firebaseapp.com',
        databaseURL: 'https://boiling-inferno-9766.firebaseio.com',
        storageBucket: 'boiling-inferno-9766.appspot.com'
      })
      .factory('Ref', firebaseRefFactory);

  firebaseRefFactory.$inject = ['$window', 'FB_INIT_CONFIG'];
  function firebaseRefFactory($window, FB_INIT_CONFIG) {
    $window.firebase.initializeApp(FB_INIT_CONFIG);
    return $window.firebase.database().ref();
  }
}());
