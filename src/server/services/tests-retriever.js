var mongoose = require('mongoose'),
    Promise = require('promise');

module.exports = (function () {
  'use strict';

  function TestsRetriever(mongoUrl) {
    console.log('Trying to connect to ' + mongoUrl);
    mongoose.connect(mongoUrl);
    this.db = mongoose.connection;

    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', function() {
      console.log('Connected to mongoDB :)');
    }.bind(this));

    this.TestResult = mongoose.model('reports', mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      jobName: String,
      buildId: Number,
      branchName: String,
      testFailed: Boolean,
      testClassName: String,
      testName: String,
      errorMessage: String,
      exceptionType: String,
      exceptionStackTrace: String,
      insertionTime: Date,
      testDuration: Number,
      category: String
    }));
  }

  TestsRetriever.prototype = {
    fetchFailed: function (buildName, buildNumber) {
      return new Promise(function (resolve, reject) {
        this.TestResult.find({jobName: buildName, buildId: buildNumber, testFailed: true}, function (err, tests) {
          if (err) {
            reject(err);
          }
          resolve(tests);
        });
      }.bind(this));
    }
  };

  return TestsRetriever;
}());
