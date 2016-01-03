angular.module('ChiraaFC').controller('TweetsCtrl', function($scope,$http,$templateCache){

    $scope.timeLine = false;

    $scope.searchQuery = '';

    var query = '@daniela_hoag';

    var jdata = 'mydata='+ query;

    $scope.getAllTweets = function() {
        $http.get('/tweet').
            success(function (data) {
                $scope.data = data;
                console.log(data);
            }).
            error(function (data) {
                alert(data);
            });
    };

    $scope.getTweets = function(){
        //$scope.results = {};
        var req = {
            method: 'POST',
            url: '/posttweet',
            data: jdata,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        };

        $http(req).success(function(data, status, headers, config){
            console.log(data);
        }).error(function(data, status, headers, config){
            console.log(data);
        });

        $scope.getAllTweets();

    };

    $scope.getTweets();

    $scope.toggleTimeline = function (){
      $scope.timeLine = !$scope.timeLine;
    };

});
