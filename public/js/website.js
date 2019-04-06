//主页的相关的配置与控制器
//本类型文件只允许有一个
var app = angular.module('WEBSITE', ['ngResource', 'ngRoute', 'angularFileUpload']);
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
    .when('/logout',
    {
        templateUrl: 'partials/logout.html',
        controller: 'LogoutCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

//主页获取视频封面的控制器
app.controller('HomeCtrl', ['$scope', '$resource', '$rootScope',
function($scope, $resource, $rootScope)
{
    var Videos = $resource('/api/videos');
    Videos.query(function(videos)
    {
        //$rootScope.USERID = "yao";
        $scope.videos = videos;
    });
}]);

//视频播放页面控制器
app.controller('PlayCtrl', ['$scope', '$resource', '$routeParams', '$rootScope', '$location',
function($scope, $resource, $routeParams, $rootScope, $location)
{
    var Videos = $resource('/api/videos/:id');
    //var Comment = $resource('/comment/:id');
    /*Comment.query({id: $routeParams.id}, function(comment)
    {
        console.log(comment);
        $scope.comments = comment;
        
    });*/
    var Comment = $resource('/comment');        //获取评论
    var Comment_sub = $resource('/comment');        //提交评论
    Comment.query(function(commentList)
    {
        console.log($scope.USERID);
        $scope.commentList = commentList;
    });

    var refresh = function()
    {
        Comment.query(function(commentList)
        {
            //console.log($scope.USERID);
            $scope.comment_sub.content = '';
            $scope.commentList = commentList;
        });
    };

    Videos.get({id: $routeParams.id}, function(video)
    {
        //console.log(video);
        $scope.video = video;
    });
    
    $scope.comment_submit = function()
    {
        if(!$rootScope.isLogin)
        {
            alert('请先登录');
            $location.path('/login');
        }
        else
        {
            $scope.comment_sub.v_id = $routeParams.id;
            $scope.comment_sub.from_uid = $rootScope.USERID;
            Comment_sub.save($scope.comment_sub, function(commentList)
            {
                //留在本页面，提交评论后立即就能在页面上显示出来
                //$scope.commentList = commentList;
                refresh();
            });
        }
    };
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

//用户登录
app.controller('LoginCtrl', ['$scope', '$resource', '$location', '$rootScope',
function($scope, $resource, $location, $rootScope)
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
                    //获取用户名，更改登录状态
                    $rootScope.USERID = $scope._user.u_name;
                    $rootScope.isLogin = true;
                    $location.path('/'); 
                }
            }
        });
    }
}]);

//退出账户
app.controller('LogoutCtrl', ['$location', '$rootScope',
function($location, $rootScope)
{
    $rootScope.USERID = '';
    $rootScope.isLogin = false;
    $location.path('/');
}]);

//视频上传控制器
app.controller('UpCtrl', ['$scope', '$resource', '$location', '$rootScope',
function($scope, $resource, $location, $rootScope)
{
    $scope.fileChanged = function(ele)
    {
        $scope.files = ele.files;
        $scope.$apply();        //传播model的变化
    };

    $scope.upload = function()
    {
        var Video = $resource('/api/videos');
        //其他相关数据初始化
        $scope.video.videoname = $scope.files[0].name;
        var picname = $scope.files[0].name.substring(0, $scope.files[0].name.indexOf("."));
        $scope.video.up_id = $rootScope.USERID;
        $scope.video.picname = picname + ".jpg";
        Video.save($scope.video, function()
        {
            alert("上传成功，返回首页");
            $location.path('/');
        });
    };
}]);

