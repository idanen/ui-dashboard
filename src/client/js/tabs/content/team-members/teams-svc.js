(function () {
  'use strict';

  angular.module('ci-site')
      .service('teamsService', TeamsService);

  TeamsService.$inject = ['Ref', '$firebaseArray'];
  function TeamsService(Ref, $firebaseArray) {
    this.$firebaseArray = $firebaseArray;
    this.teamsRef = Ref.child('teams');
  }

  TeamsService.prototype = {
    getTeams: function () {
      return this.$firebaseArray(this.teamsRef);
    }
  };
}());
