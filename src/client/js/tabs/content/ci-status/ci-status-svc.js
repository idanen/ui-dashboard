/**
 * Created by matarfa on 15/07/2015.
 */


'use strict';

angular.module('tabs').service('CiStatusService', ['$http',function ($http) {




    this.invalidateHead = function() {
        return 3;
    };

}]);


angular.module('tabs').controller('ciStatusController',['$scope','$http', function($scope,$http){
    $http.get("http://mydtbld0021.isr.hp.com:8080/jenkins/job/MaaS-Platf-UI-Branch-master/3068/api/json")
        .success(function(response) {$scope.nameHttp = response;});
    $scope.nameJson =[];
    $scope.addJob = function(job){
        $scope.tmpJob = [];
        var url = "http://mydtbld0021.isr.hp.com:8080/jenkins/job/" + job.name + "/api/json";
        var newJob;
        $http.get(url)
            .success(function(response) {
                $http.get(response.builds[0].url + "/api/json") // to check if build exist
                    .success(function(res) {$scope.addTheJob(res,job.alias);

                    });
            }
        );


    }

    $scope.addTheJob = function(job,alias){
        var newJob = {jobName:job.fullDisplayName,aliasName:alias,freeze:"false",result:job.result,buildStatus:job.building};

        $scope.nameJson.push(newJob);
    }

    $scope.displayName = function(job){
        console.log(job.aliasName);
        if(job.aliasName != ""){
            return job.aliasName;
        }else{
            return job.jobName;
        }
    }
/* for http use
    $scope.status = function(){
        if($scope.name.building == true){
            return "Running";
        }else{
            return $scope.name.result;
        }
    }*/

    // for json and http use
    $scope.status = function(job){
        if(job.buildStatus == true){
            return "Running";
        }else{
            return job.result;
        }
    }

    $scope.chooseImg = function(job){
        if(job.buildStatus == true){
            return "../images/green_anime.gif";
        }else{
            return "../images/" + job.result + ".png";
        }
    }
/* for http use
    $scope.trStatus = function() {
        if ($scope.name.building == true) {
            return "active";
        } else {
            if ($scope.name.result == "SUCCESS") {
                return "success";
            } else if ($scope.name.result == "FAILURE") {
                return "danger";
            } else if ($scope.name.result == "UNSTABLE") {
                return "warning";
            }
        }
    }
    */
    // for json and http
    $scope.trStatus = function(job) {
        if (job.buildStatus == true) {
            return "active";
        } else {
            if (job.result == "SUCCESS") {
                return "success";
            } else if (job.result == "FAILURE") {
                return "danger";
            } else if (job.result == "UNSTABLE") {
                return "warning";
            }
        }
    }
}]);