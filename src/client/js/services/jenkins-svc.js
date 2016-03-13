(function () {
    'use strict';

    angular
        .module('tabs')
        .constant('JenkinsBaseUrl', 'http://mydtbld0021.hpeswlab.net:8080/jenkins/')
        .service('JenkinsService', JenkinsService);

    JenkinsService.$inject = ['$http', '$q', 'JenkinsBaseUrl'];
    function JenkinsService($http, $q, JenkinsBaseUrl) {
        this.$http = $http;
        this.$q = $q;
        this.JenkinsBaseUrl = JenkinsBaseUrl;
    }

    JenkinsService.prototype = {
        getBuildStatus: function (buildName) {
            var buildURL = `${this.JenkinsBaseUrl}job/${buildName}/api/json`;
            return this.$http.get(buildURL)
                .then(this._processResponse)
                .then(this.getRelevantBuilds.bind(this));
        },
        getMastersBranches: function () {
            var mastersURL = this.JenkinsBaseUrl + 'job/MaaS-SAW-USB-master/api/json';
            return this.$http.get(mastersURL)
                .then(this._processResponse)
                .then(this.getRelevantBuilds.bind(this));
        },

        getHealthReport: function () {
            var url = this.JenkinsBaseUrl + 'view/USB-Team-Branches-Currently-Running/api/json';
            return this.$http.get(url)
                .then(this._getReports.bind(this));
        },

        gerCurrentlyRunningBranches: function () {
            var url = this.JenkinsBaseUrl + 'view/USB-Team-Branches-Currently-Running/api/json';
            return this.$http.get(url).then(this._getRunningBranches.bind(this))
                .catch(function (error) {
                    console.log('error loading branches');
                    return error;
                });
        },

        getRelevantBuilds: function (buildDetails) {
            var promises = [];
            if (buildDetails.lastBuild.number !== buildDetails.lastCompletedBuild.number) {
                promises.push(this.$http.get(buildDetails.lastBuild.url + 'api/json'));
            }
            promises.push(this.$http.get(buildDetails.lastCompletedBuild.url + 'api/json'));
            if (buildDetails.lastSuccessfulBuild.number !== buildDetails.lastCompletedBuild.number) {
                promises.push(this.$http.get(buildDetails.lastSuccessfulBuild.url + 'api/json'));
            }
            return this.$q.all(promises)
                .then(function (builds) {
                    return this.processBuilds(builds, buildDetails);
                }.bind(this));
        },
        processBuilds: function (builds, parentDetails) {
            var buildsStatus = [];
            if (builds && Array.isArray(builds)) {
                builds.forEach(function (branchInfo) {
                    var buildStatus = {};
                    buildStatus.name = branchInfo.data.fullDisplayName;
                    buildStatus.url = branchInfo.data.url;
                    if ((branchInfo.data.number === parentDetails.lastBuild.number) && parentDetails.lastBuild.number !== parentDetails.lastCompletedBuild.number) {
                        buildStatus.status = parentDetails.color;
                    } else {
                        buildStatus.status = this._getStatus(branchInfo.data.result);
                    }
                    buildStatus.result = (branchInfo.data.building === true) ? 'RUNNING' : branchInfo.data.result;
                    if(branchInfo.data.building === true){
                        buildStatus.duration = this._getDuration(new Date().getTime(),branchInfo.data.timestamp);
                    }else{
                        buildStatus.duration = this._getDuration(new Date().getTime() + branchInfo.data.duration, new Date().getTime());
                    }
                    buildsStatus.push(buildStatus);
                }, this);
            }
            return buildsStatus;
        },


        _getReports: function(reports){
            var jobs = reports.data.jobs;
            var promises = [];
            jobs.forEach(function (job) {
                var urlNow = this.JenkinsBaseUrl + 'job/' + job.name + '/api/json';
                promises.push(function (urlNow) {
                    return this._getReportDetailsFromJenkins(urlNow);
                }.bind(this)(urlNow));
            } , this);
            return this.$q.all(promises).then(function (results) {
                return results;
            });
        },

        _getReportDetailsFromJenkins: function(url){
            return this.$http.get(url)
                .then(this._prepareReport);
        },

        _prepareReport: function(report){
            report = report.data;
            var current = {};
            current.name = report.name;
            current.url = report.url;
            current.description = report.healthReport[0].description;
            current.score = report.healthReport[0].score;
            return current;
        },


        _getRunningBranches: function(branches){
            var jobs = branches.data.jobs;
            var promises = [];
            jobs.forEach(function (job) {
                var urlNow = this.JenkinsBaseUrl + 'job/' + job.name + '/lastBuild/api/json?depth=0';
                promises.push(function (urlNow, color, name) {
                    return this._getRunningBranch(urlNow, color, name).bind(this);
                }(urlNow, job.color, job.name));
            }.bind(this));
            return this.$q.all(promises).then(function (results) {
                return results;
            }.bind(this));
        },

        _getRunningBranch:function(branchURL,branchColor,branchName){
            return this.$http.get(branchURL)
                .then(function (result) {
                    result = result.data;
                    var current = {};
                    current.name = branchName;
                    current.url = result.url;
                    current.build = result.number;
                    current.status = branchColor;
                    current.eta = this._convertTimestampToTime(result.estimatedDuration);
                    current.duration = this._getDuration(new Date().getTime(), result.timestamp);
                    current.started = this._convertTimestampToTime(result.timestamp);
                    console.log(current.started);
                    return current;
                });
        },

        _processResponse: function (response) {
            return response.data;
        },

        _convertTimestampToTime: function(timestamp) {
            var date = new Date(timestamp);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        },

        _getStatus: function(result) {
            if (result === "SUCCESS") {
                return 'blue';
            } else if (result === "FAILED") {
                return 'red';
            } else {
                return 'yellow';
            }
        },

        _getDuration : function (endTimestamp, startTimestamp) {
            var minutes = (endTimestamp - startTimestamp) / 60000; // convert milliseconds to minutes
            minutes = Math.round(minutes);
            var hours = 0;
            while (minutes >= 60) {
                minutes -= 60;
                hours++;
            }
            if (hours === 0 && minutes === 0) {
                return 'Just Started';
            }
            if (hours === 0) {
                return minutes + ' Minutes';
            }
            if (minutes === 0) {
                return hours + ' Hours';
            }
            return hours + ' Hour(s) And ' + minutes + ' Minutes';
        }

    };
}());