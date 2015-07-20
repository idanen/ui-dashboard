
angular.module('tabs').service('TeamMembersService', [function ( ) {
    this.members = [
        {memberId:0, fname:"Eli",   lname:"Koren",   email:"fadi.matar@hp.com", img:"http://i406.photobucket.com/albums/pp143/angelhavingfun2/Fabric%20Textures/extras/fjardine-blush-flower.png"},
        {memberId:1, fname:"Fadi",  lname:"Matar",   email:"fadi.matar@hp.com", img:"https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png"},
        {memberId:2, fname:"Aviad", lname:"Cohen",   email:"fadi.matar@hp.com", img:"http://www.officialpsds.com/images/thumbs/Thundercats-psd33581.png"},
        {memberId:3, fname:"Mazit", lname:"Bentora", email:"fadi.matar@hp.com", img:"http://www.freegreatdesign.com/files/images/6/2809-4-cute-elephant-png-icon-1.jpg"},
        {memberId:4, fname:"Idan",  lname:"Entin",   email:"fadi.matar@hp.com", img:"http://vignette3.wikia.nocookie.net/fantendo/images/e/eb/Mario_SM3DW.png/revision/latest?cb=20120122014152"},
        {memberId:5, fname:"Ofer",  lname:"Spivak",  email:"fadi.matar@hp.com", img:"http://lh5.ggpht.com/-_1pDGXMyu7Y/UMVqxR13BFI/AAAAAAAAAJw/0ns2PhRiZbY/s9000/cat.png"},
        {memberId:6, fname:"Idit",  lname:"Gluck",   email:"fadi.matar@hp.com", img:"http://www.clipartbest.com/cliparts/eTM/KXe/eTMKXe8Tn.png"},
        {memberId:7, fname:"Noam",  lname:"Katzir",  email:"fadi.matar@hp.com", img:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSnJDSDJPnTTxb9iUBdK6DBFf4lHAv8VaRHVJKDlfTxWBhWZbptf3NGW6Q"},
        {memberId:8, fname:"Yael",  lname:"Schnabel",email:"fadi.matar@hp.com", img:"http://www.mykonosgreekcuisine.com/Cute_Dog_Clipart.png"},
        {memberId:9, fname:"Evgeny",lname:"Ogurko",  email:"fadi.matar@hp.com", img:"http://www.clker.com/cliparts/P/N/C/N/f/d/cartoon-elephant-hi.png"}];

    this.uniqueMemberId = this.members.length;

    this.addMember = function (member) {
        member.memberId = this.uniqueMemberId;
        this.uniqueMemberId++;

        var tmp = {};
        angular.copy(member, tmp);
        this.members.push(tmp);
    };

    this.getMemberByID = function (memberId) {
        return this.members.filter(function (obj) {
            return obj.memberId == memberId;
        })[0];
    }
}]);

angular.module('tabs').controller('membersController', ['$scope', 'TeamMembersService', function ($scope, TeamMembersService) {
    $scope.currentPage = 1;
    $scope.tmp = TeamMembersService.members;
    $scope.paginate = function () {
        if ($scope.tmp.length < 10)
            $scope.members = $scope.tmp;
        else {
            $scope.members = $scope.tmp.slice(($scope.currentPage - 1) * 10, ($scope.currentPage * 10) - 1);
        }

    };
    $scope.paginate();

    $scope.goPrevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.paginate();
        }
    };

    $scope.goNextPage = function () {
        if ($scope.tmp.length >= ($scope.currentPage * 10)) {
            $scope.currentPage++;
            $scope.paginate();
        }
    };


    $scope.addMember = function (member) {
        TeamMembersService.addMember(member);
        angular.forEach($scope.members, function (member, index) {
            //Just add the index to your item
            member.index = index;
        });
        $scope.paginate();
    };

    angular.forEach($scope.members, function (member, index) {
        //Just add the index to your item
        member.index = index;
    });

}]);

