

angular.module('tabs').service('TeamMembersService', [function ( ) {
    this.members = [{fname:"fadi",lname:"matar",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {fname:"Aviad",lname:"Cohen",email:"fadi.matar@hp.com",img:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSnJDSDJPnTTxb9iUBdK6DBFf4lHAv8VaRHVJKDlfTxWBhWZbptf3NGW6Q"},
        {fname:"fa1di",lname:"matar",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {fname:"Eli",lname:"Koren",email:"fadi.matar@hp.com",img:"http://blog.brighttalk.com/storage/itsm.jpg?__SQUARESPACE_CACHEVERSION=1355364048330"},
        {fname:"Aviad",lname:"Cohen",email:"fadi.matar@hp.com",img:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSnJDSDJPnTTxb9iUBdK6DBFf4lHAv8VaRHVJKDlfTxWBhWZbptf3NGW6Q"},
        {fname:"fad1i",lname:"matar",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {fname:"Eli",lname:"Koren",email:"fadi.matar@hp.com",img:"http://blog.brighttalk.com/storage/itsm.jpg?__SQUARESPACE_CACHEVERSION=1355364048330"},
        {fname:"Aviad",lname:"Cohen",email:"fadi.matar@hp.com",img:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSnJDSDJPnTTxb9iUBdK6DBFf4lHAv8VaRHVJKDlfTxWBhWZbptf3NGW6Q"},
        {fname:"fa1di",lname:"matar",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {fname:"Eli",lname:"Koren",email:"fadi.matar@hp.com",img:"http://blog.brighttalk.com/storage/itsm.jpg?__SQUARESPACE_CACHEVERSION=1355364048330"},
        {fname:"Aviad",lname:"Cohen",email:"fadi.matar@hp.com",img:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSnJDSDJPnTTxb9iUBdK6DBFf4lHAv8VaRHVJKDlfTxWBhWZbptf3NGW6Q"},
        {fname:"Eli",lname:"Koren",email:"fadi.matar@hp.com",img:"http://blog.brighttalk.com/storage/itsm.jpg?__SQUARESPACE_CACHEVERSION=1355364048330"},
        {fname:"fa1di",lname:"matar",email:"fadi.matar@hp.com",img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"}];
    this.addMember = function(member) {
        var tmp={};
        angular.copy(member,tmp);
        this.members.push(tmp);
    };

}]);

angular.module('tabs').controller('membersController', ['$scope','TeamMembersService',function($scope,TeamMembersService) {
    $scope.currentPage=1;
    $scope.tmp = TeamMembersService.members;
    $scope.paginate = function() {
        if ($scope.tmp.length < 10)
            $scope.members = $scope.tmp;
        else {
            $scope.members = $scope.tmp.slice(($scope.currentPage-1)*10,($scope.currentPage*10)-1);
        }

    }
    $scope.paginate();

    $scope.goPrevPage = function(){
        if($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.paginate();
        }
    }

    $scope.goNextPage = function(){
        if($scope.tmp.length >= ($scope.currentPage * 10)){
            $scope.currentPage++;
            $scope.paginate();
        }
    }


    $scope.addMember = function(member){
        TeamMembersService.addMember(member);
        angular.forEach($scope.members, function(member, index){
            //Just add the index to your item
            member.index = index;
        });
        $scope.paginate();
    }

    angular.forEach($scope.members, function(member, index){
        //Just add the index to your item
        member.index = index;
    });

}]);

