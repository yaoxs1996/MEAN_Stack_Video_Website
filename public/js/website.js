//import swal from "_sweetalert@2.1.2@sweetalert";

//主页的相关的配置与控制器
//本类型文件只允许有一个
var app = angular.module('WEBSITE', ['ngResource', 'ngRoute', 'ngFileUpload']);
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
    .when('/user/:id',
    {
        templateUrl: 'partials/user_info.html',
        controller: 'UserCtrl'
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
    .when('/space/:id',
    {
        templateUrl: 'partials/space.html',
        controller: 'SpaceCtrl'
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

    /*将登陆验证信息的初始化置于此处 防止页面刷新导致登陆信息丢失*/
    if($rootScope.isLogin != true)
    {
        $rootScope.isLogin = false;
        $rootScope.USERID = null;
    }
    //console.log($rootScope.USERID);
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
    var Comment = $resource('/comment/:id');        //获取评论
    var Comment_sub = $resource('/comment');        //提交评论
    Comment.query({id: $routeParams.id}, function(commentList)
    {
        //console.log($scope.USERID);
        $scope.commentList = commentList;
    });

    var refresh = function()
    {
        Comment.query({id: $routeParams.id}, function(commentList)
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
        else if($scope.comment_sub.content == null)
        {
            alert('请输入评论！');
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
    var User = $resource('api/register');
    /*视图的save方法 */
    $scope.save = function()
    {
        /*防止提交空数据 */
        if($scope.user.u_name == null || $scope.user.pwd == null || $scope.user.pwd1 == null || $scope.user.email == null)
        {
            swal({
                title: '请完成表单！',
                icon: 'warning',
                button: true,
            });
        }
        /*表单密码一致性验证 */
        else if($scope.user.pwd != $scope.user.pwd1)
        {
            swal({
                title: '密码不一致！',
                icon: 'warning',
                button: true,
            });
        }
        else
        {
            /*调用save方法，调用后台的post方法 */
            User.save($scope.user, function(user)
            {
                /*判断返回的错误信息 */
                if(user.errMsg != null)
                {
                    swal({
                        title: '用户名已存在！',
                        icon: 'error',
                        button: true,
                    });
                }
                /*注册成功 */
                else
                {
                    swal({
                        title: '注册成功！',
                        text: '前往登录页面',
                        icon: 'success',
                        button: true,
                    });
                    /*进入登录页面 */
                    $location.path('/login');
                }
            });
        }
    };
}]);

//用户登录
app.controller('LoginCtrl', ['$scope', '$resource', '$location', '$rootScope',
function($scope, $resource, $location, $rootScope)
{
    $scope.loginAction = function()
    {
        var User = $resource('/api/login');
        /*save(param, payload, sucessFn, errorFn) */
        User.save($scope._user, function(user)
        {
            /*用户不存在 */
            if(!user._id)
            {
                swal({
                    title: '错误！',
                    text: '用户不存在',
                    icon: 'error',
                    button: '重新输入'
                });
            }
            /*密码不存在 */
            else if(user.errMsg == '密码错误！')
            {
                swal({
                    title: '错误！',
                    text: user.errMsg,
                    icon: 'error',
                    button: '重新输入',
                });
            }
            /*登录成功 */
            else
            {
                swal({
                    title: '登录成功！',
                    icon: 'success',
                    button: true,
                })
                $rootScope.USERID = $scope._user.u_name;
                $rootScope.isLogin = true;
                $location.path('/');
            }
        });
    };
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
app.controller('UpCtrl', ['$scope', '$resource', '$location', '$rootScope', 'Upload', '$timeout',
function($scope, $resource, $location, $rootScope, Upload, $timeout)
{
    /*$scope.fileChanged = function(ele)
    {
        $scope.files = ele.files;
        $scope.$apply();        //传播model的变化
    };*/

    /*登陆权限控制，防止未登录进入本页面 */
    if($rootScope.isLogin != true)
    {
        //alert('请先登陆！');
        swal({
            title: "请先登陆！",
            text: "您尚未登录",
            icon: "error",
            button: "去登录",
        });
        $location.path('/login');       //转向登陆页面
    }

    $scope.uploadVideo = function(file)
    {
        /*表单验证 */
        if($scope.video.title == null || $scope.video.brief == null)
        {
            swal({
                title: '请完善所有信息！',
                icon: 'warning',
                button: '确定',
            });
            console.log($scope.video.title);
        }
        else
        {
            $scope.video.up_id = $rootScope.USERID;     //用户名初始化
        
            file.upload = Upload.upload({
                url: '/video_upload',
                data: {videoinfo: $scope.video, file: file},
            });

            file.upload.then(function(response)     //成功信息
            {
                $timeout(function()
                {
                    file.result = response.data;
                });
            }, function(response)       //处理错误
            {
                if(response.status > 0)
                {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
                console.log('2.response: ' + response._id);
            }, function(evt)        //进度通知
            {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });

            /*弹出信息 */
            swal({
                title: '上传成功',
                text: '是否返回主页？',
                icon: 'success',
                buttons: true,
            });
            //$location.path('/');
        }
    };

    /*$scope.upload = function()
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
    };*/
}]);

//用户信息控制器
app.controller('UserCtrl', ['$scope', '$resource', '$location', '$routeParams',
function($scope, $resource, $location, $routeParams)
{
    var User = $resource('/api/user/:id');
    var User_update = $resource('/api/user/:id', {id: '@u_name'}, {update: {method: 'PUT'}});
    var Videos = $resource('/api/user_videos/:id');
    var Video_delete = $resource('/api/user_videos/:id');

    //获取用户信息
    User.get({id: $routeParams.id}, function(user)
    {
        $scope.user = user;
    });

    var refresh = function()
    {
        User.get({id: $routeParams.id}, function(user)
        {
            $scope.user = user;
        });
    };

    $scope.apply_info = function()
    {
        User_update.update($scope.user, function()
        {
            //刷新
            alert('信息修改成功');
            refresh();
        });
    };

    //密码修改
    $scope.apply_pass = function()
    {
        if($scope.user.oldpass == null || $scope.user.newpass == null || $scope.user.newpass_1 == null)
        {
            alert('输入栏不能为空！');
        }
        else if($scope.user.oldpass != $scope.user.u_pwd)
        {
            alert('密码错误！');
        }
        else if($scope.user.newpass != $scope.user.newpass_1)
        {
            alert('两次输入密码不同！');
        }
        else if($scope.user.newpass == $scope.user.oldpass)
        {
            alert('新旧密码不能相同！');
        }
        else
        {
            $scope.user.u_pwd = $scope.user.newpass;
            User_update.update($scope.user, function()
            {
                alert('密码修改成功！');
                refresh();
            })
        }
    }

    //获取用户的视频列表
    Videos.query({id: $routeParams.id}, function(videos)
    {
        $scope.videolist = videos;
    });

    //用户删除视频
    var DeleteVideo = $resource('/api/videos/:id');
    $scope.delete_video = function(_id)
    {
        DeleteVideo.delete({id: _id}, function(video)
        {
            swal({
                title: '删除成功！',
                icon: 'success',
                button: true,
            });

            //刷新局部
            //refresh();
        });
    };
}]);

/*访问其他用户主页对应的控制器 */
app.controller('SpaceCtrl', ['$scope', '$resource', '$rootScope', '$routeParams',
function($scope, $resource, $rootScope, $routeParams)
{
    /*获取用户个人信息 */
    var User = $resource('/api/user/:id');
    User.get({id: $routeParams.id}, function(user)
    {
        $scope.user = user;
    });

    /*获取用户投稿视频 */
    var Video = $resource('/api/user_videos/:id');
    Video.query({id: $routeParams.id}, function(videoList)
    {
        $scope.videoList = videoList;
    });

    /*获取用户是否被关注的状态 */
    var Follow = $resource('/follow/:id');
    
    Follow.query({id: $rootScope.USERID}, function(result)
    {
        //console.log(result);
        var flag = false;

        /*判断是否关注 */
        for(let temp in result)
        {
            if(result[temp].follow_id == $routeParams.id)
            {
                flag = true;
            }
        }

        if(result.errMsg == 'EMPTY_FOLLOW')
        {
            $scope.followStatus = false;        //未关注
        }
        else
        {
            $scope.followStatus = flag;
        }
    });

    /*改变关注状态 */
    /*关注 */
    $scope.follow = function(followId)
    {
        let followInfo = {userId: $rootScope.USERID, followId: followId};
        var AddFollow = $resource('/follow');
        AddFollow.save(followInfo, function(result)
        {
            /*结果为空，关注失败 */
            if(!result._id)
            {
                swal({
                    title: '关注失败！',
                    icon: 'error',
                    button: true,
                });
            }
            else
            {
                swal({
                    title: '关注成功！',
                    icon: 'success',
                    button: true,
                });
                $scope.followStatus = true;
            }
        });
    };

    /*取消关注 */
    $scope.unfollow = function(followId)
    {
        let followInfo = {userId: $rootScope.USERID, followId: followId};
        var DelFollow = $resource('/follow');
        DelFollow.delete(followInfo, function(result)
        {
            swal({
                title: '取消关注成功！',
                icon: 'success',
                button: true,
            });
            $scope.followStatus = false;
        });
    };
}]);