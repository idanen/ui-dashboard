(function () {
  'use strict';
  
  angular.module('tabs')
    .controller('CompareCtrl', CompareController);

  CompareController.$inject = ['build', 'toBuild', '$state', '$q', 'ciStatusService', 'buildTestsService'];
  function CompareController(build, toBuild, $state, $q, ciStatusService, buildTestsService) {
    this.build = build;
    this.toBuild = toBuild;
    this.$state = $state;
    this.$q = $q;
    this.buildTestsService = buildTestsService;
    this.title = `Comparing build ${this.build.name}#${this.build.number} and ${this.toBuild.name}#${this.toBuild.number}`;
    this.availableBuilds = {
      masters: ciStatusService.getJobs(),
      teams: []
    };
    this.selected = {
      left: {
        group: 'masters'
      },
      right: {
        group: 'masters'
      }
    };

    this.availableBuilds.masters.$loaded()
      .then(this.selectFirstOptions.bind(this))
      .then(this.getAllTests.bind(this));
  }

  CompareController.prototype = {
    selectionChanged: function (side, prop, value) {
      this.selected[side][prop] = value;
      this.getAllTests();
    },
    getAllTests: function () {
      return this.getTests()
          .then(this.getTestsOfOther.bind(this));
          //.then(this.assignToViewModel.bind(this));
    },
    updateState: function () {
      this.$state.go('compare', {
        buildName: this.selected.left.name,
        buildNumber: this.selected.left.number,
        toBuildName: this.selected.right.name,
        toBuildNumber: this.selected.right.number
      });
    },
    selectFirstOptions: function () {
      if (this.build) {
        this.selected.left = {
          group: 'masters',
          name: this.build.name,
          number: this.build.number
        };
      }
      if (this.toBuild && this.toBuild.name && this.toBuild.number) {
        this.selected.right = {
          group: 'masters',
          name: this.toBuild.name,
          number: this.toBuild.number
        };
      } else {
        this.selected.right = {
          group: 'masters',
          name: this.build.name,
          number: this.build.number - 1
        };
      }
    },
    getTests: function () {
      var promises = [];
      promises.push(this.buildTestsService.fetch(this.selected.left.name, this.selected.left.number, false));
      promises.push(this.buildTestsService.fetch(this.selected.right.name, this.selected.right.number, false));

      return this.$q.all(promises);
    },
    panelClass: function (aTest) {
      if (aTest.alien) {
        return '';
      }
      return aTest.tests.some((test) => test.testFailed) ? 'panel-danger' : 'panel-success';
    },
    testIcon: function (aTest) {
      if (aTest.alien) {
        return 'help-outline';
      }
      return aTest.tests.some((test) => test.testFailed) ? 'error-outline' : 'check';
    },
    testIconClass: function (aTest) {
      if (aTest.alien) {
        return 'text-muted';
      }
      return aTest.tests.some((test) => test.testFailed)  ? 'text-danger' : 'text-success';
    },
    getTestsOfOther: function (both) {
      var leftTests = both[0],
          rightTests = both[1],
          diffsPromises = [],
          addToRight, addToLeft;

      // Get diffs from each side
      // console.log('on left: ', leftTests.length);
      addToLeft = _.differenceWith(rightTests, leftTests, this._testEquals.bind(this));
      // console.log('need to add to left: ', addToLeft.length);
      // console.log('on right: ', rightTests.length);
      addToRight = _.differenceWith(leftTests, rightTests, this._testEquals.bind(this));
      // console.log('need to add to right: ', addToRight.length);

      // Assign middle result
      this.leftTests = leftTests.concat(_.map(addToLeft, this._alienize));
      this.rightTests = rightTests.concat(_.map(addToRight, this._alienize));

      // Request tests status
      //diffsPromises.push(
      //    this.buildTestsService.fetchSpecific(this.selected.left.name, this.selected.left.number, this._groupByClass(addToLeft))
      //        .then(this._alienize)
      //);
      //diffsPromises.push(
      //    this.buildTestsService.fetchSpecific(this.selected.right.name, this.selected.right.number, this._groupByClass(addToRight))
      //        .then(this._alienize)
      //);

      return this.$q.all(diffsPromises);
    },
    assignToViewModel: function (both) {
      this.leftTests = this.leftTests.concat(both[0]);
      this.rightTests = this.rightTests.concat(both[1]);
    },
    _groupByClass: function (tests) {
      var testsByClass = [];
      tests.forEach((test) => {
        testsByClass.push({
          testClass: test._id.testClassName,
          methods: _.map(test.tests, 'testName')
        });
      });

      return testsByClass;
    },
    _testEquals: function (testWrap, otherTestWrap) {
      var origTests, otherTests;
      if (testWrap._id.testClassName !== otherTestWrap._id.testClassName) {
        return false;
      }
      // Remove irrelevant fields
      origTests = testWrap.tests.map(this._omitIrrelevantFieldsFromTest);
      otherTests = testWrap.tests.map(this._omitIrrelevantFieldsFromTest);

      return _.isEqual(origTests, otherTests);
    },
    _omitIrrelevantFieldsFromTest: (test) => {
      return _.omit(test, ['buildId', 'testDuration', 'insertionTime', 'testFailed', 'exceptionStacktrace', 'errorMessage']);
    },
    _alienize: function (testWrap) {
      var modified = _.extend({alien: true}, testWrap);
      modified.tests = testWrap.tests.map((test) => {
        return _.extend({alien: true}, test);
      });
      return modified;
    }
  };
}());