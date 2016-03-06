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

        getRelevantBuilds: function (masterDetails) {
            var promises = [];
            if (masterDetails.lastBuild.number !== masterDetails.lastCompletedBuild.number) {
                promises.push(this.$http.get(masterDetails.lastBuild.url + 'api/json'));
            }
            promises.push(this.$http.get(masterDetails.lastCompletedBuild.url + 'api/json'));
            if (masterDetails.lastSuccessfulBuild.number !== masterDetails.lastCompletedBuild.number) {
                promises.push(this.$http.get(masterDetails.lastSuccessfulBuild.url + 'api/json'));
            }
            return this.$q.all(promises)
                .then(function (builds) {
                    return this.processBuilds(builds, masterDetails);
                }.bind(this));
        },
        processBuilds: function (builds, parentDetails) {
            var masters = [];
            if (builds && Array.isArray(builds)) {
                builds.forEach(function (branchInfo) {
                    var master = {};
                    master.name = branchInfo.data.fullDisplayName;
                    master.url = branchInfo.data.url;
                    if ((branchInfo.data.number === parentDetails.lastBuild.number) && parentDetails.lastBuild.number !== parentDetails.lastCompletedBuild.number) {
                        master.status = parentDetails.color;
                    } else {
                        master.status = this._getStatus(branchInfo.data.result);
                    }
                    master.result = (branchInfo.data.building === true) ? 'RUNNING' : branchInfo.data.result;
                    if(branchInfo.data.building === true){
                        master.duration = this._getDuration(new Date().getTime(),branchInfo.data.timestamp);
                    }else{
                        master.duration = this._getDuration(new Date().getTime() + branchInfo.data.duration, new Date().getTime());
                    }
                    masters.push(master);
                }, this);
            }
            return masters;
        },


        _getReports: function(reports){
            var jobs = reports.data.jobs;
            var promises = [];
            var healthReports = [];
            jobs.forEach(function (job) {
                var urlNow = this.JenkinsBaseUrl + 'job/' + job.name + '/api/json';
                promises.push(function (urlNow) {
                    return this._getReportDetailsFromJenkins(urlNow);
                }.bind(this)(urlNow))
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
            var runningBranches = [];
            jobs.forEach(function (job) {
                var urlNow = JenkinsBaseUrl + 'job/' + job.name + '/lastBuild/api/json?depth=0';
                promises.push(function (urlNow, color, name) {
                    return this._getRunningBranch(url,color,name).bind(this);
                }(urlNow, job.color, job.name))
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
                })
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
            var hour = 60, current = 0, hours = 0;
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
            return hours + ' Hour/s And ' + minutes + ' Minutes';
        }

    };
}());