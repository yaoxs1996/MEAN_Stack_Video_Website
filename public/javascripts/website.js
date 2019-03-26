//主页的相关的配置与控制器
//本类型文件只允许有一个
var app = angular.module('WEBSITE', ['ngResource', 'ngRoute']);
app.config(['$routeProvider', function($routeProvider)
{
    $routeProvider
    .when('/',
    {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    })
    .when('/video/:id',
    {
        templateUrl: 'partials/video_play.html',
        controller: 'PlayCtrl'
    })
    .when('/user/register',
    {
        templateUrl: 'partials/register.html',
    })
    .when('/user/login',
    {
        templateUrl: 'partials/login.html',
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

//主页获取视频封面的控制器
app.controller('HomeCtrl', ['$scope', '$resource', function($scope, $resource)
{
    var Videos = $resource('/api/videos');
    Videos.query(function(videos)
    {
        $scope.videos = videos;
    });
}]);

//视频播放页面控制器
app.controller('PlayCtrl', ['$scope', '$resource', '$routeParams', '$sce',
function($scope, $resource, $routeParams, $sce)
{
    var Videos = $resource('/api/videos/:id');
    Videos.get({id: $routeParams.id}, function(video)
    {
        $scope.video = video;
    });

}]);

