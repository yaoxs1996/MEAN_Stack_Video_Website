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
    .when('/upload',
    {
        templateUrl: 'partials/addVideo.html',
        controller: 'UpCtrl'
    })
    .when('/register',
    {
        templateUrl: 'partials/register.html',
        controller: 'RegCtrl'
    })
    .when('/login',
    {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
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
app.controller('PlayCtrl', ['$scope', '$resource', '$routeParams',
function($scope, $resource, $routeParams)
{
    var Videos = $resource('/api/videos/:id');
    Videos.get({id: $routeParams.id}, function(video)
    {
        $scope.video = video;
    });

}]);

//注册页面控制器
app.controller('RegCtrl', ['$scope', '$resource', '$location',
function($scope, $resource, $location)
{
    //console.log("这里是注册控制器"+Date());
    $scope.save = function()
    {
        var Users = $resource('/api/register');
        Users.save($scope.user, function()
        {
            $location.path('/login'); 
        });
    }
}]);


app.controller('LoginCtrl', ['$scope', '$resource', '$location',
function($scope, $resource, $location)
{
    $scope.loginAction = function()
    {
        var User = $resource('/api/login');
        User.save($scope._user, function(user)
        {
            //console.log(user);
            if(!user._id)
            {
                $scope.warning = '用户不存在';
            }
            else
            {
                if($scope._user.u_pwd != user.u_pwd)
                {
                    $scope.warning = '密码错误';
                }
                else
                {
                    $location.path('/'); 
                }
            }
        });
    }
}]);


//视频上传控制器
app.controller('UpCtrl', ['$scope', '$resource', '$location',
function($scope, $resource, $location)
{
    $scope.upload = function()
    {

        //更新模块
        var Video = $resource('/api/videos');
        Videos.save($scope.video, function()
        {
            $location.path('/');
        });
    };
}]);

