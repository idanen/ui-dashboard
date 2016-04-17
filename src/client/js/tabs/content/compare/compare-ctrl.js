(function () {
  'use strict';
  
  angular.module('tabs')
    .controller('CompareCtrl', CompareController);

  CompareController.$inject = ['build', 'toBuild'];
  function CompareController(build, toBuild) {
    this.build = build;
    this.toBuild = toBuild;
    this.title = `Comparing build ${this.build.name}#${this.build.number} and ${this.toBuild.name}#${this.toBuild.number}`;
  }
}());