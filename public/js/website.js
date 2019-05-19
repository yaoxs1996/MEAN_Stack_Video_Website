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
    .when('/dynamics/:id',
    {
        templateUrl: 'partials/dynamics.html',
        controller: 'DynamicsCtrl'
    })
    .when('/notification/:id',
    {
        templateUrl: 'partials/notification.html',
        controller: 'NotiCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

/*自定义过滤器 */
/*获取自己的关注列表 */
/*删除自己未关注的用户的动态*/
app.filter("getMyFollowList", function($rootScope)
{
    return function(input)
    {
        for(let i in input)
        {
            var flag = false;       //标记对应用户是否出现在关注列表中
            for(let j in $rootScope.myFollowList)
            {
                if(input[i].user_id == $rootScope.myFollowList[j].follow_id)
                {
                    flag = true;
                }
            }

            if(flag == false)
            {
                input.splice(i, 1);     //将未关注的用户从对象中删除
            }
        }
        return input;
    };
});

//主页获取视频封面的控制器
app.controller('HomeCtrl', ['$scope', '$resource', '$rootScope',
function($scope, $resource, $rootScope)
{
    var Videos = $resource('/api/videos');
    Videos.query(function(videos)
    {
        $scope.videos = videos;
    });

    /*将登陆验证信息的初始化置于此处 防止页面刷新导致登陆信息丢失*/
    if($rootScope.isLogin != true)
    {
        $rootScope.isLogin = false;
        $rootScope.USERID = null;
    }
}]);

//视频播放页面控制器
app.controller('PlayCtrl', ['$scope', '$resource', '$routeParams', '$rootScope', '$location',
function($scope, $resource, $routeParams, $rootScope, $location)
{
    var Videos = $resource('/api/videos/:id');
    var Comment = $resource('/comment/:id');        //获取评论
    var Comment_sub = $resource('/comment');        //提交评论
    Comment.query({id: $routeParams.id}, function(commentList)
    {
        $scope.commentList = commentList;

        /*评论为空 */
        if(commentList.length == 0)
        {
            $scope.isNull = true;
        }
        else
        {
            $scope.isNull = false;
        }
    });

    var refresh = function()
    {
        Comment.query({id: $routeParams.id}, function(commentList)
        {
            $scope.comment_sub.content = '';
            $scope.commentList = commentList;
        });
    };

    Videos.get({id: $routeParams.id}, function(video)
    {
        $scope.video = video;
    });
    
    $scope.comment_submit = function(comment_sub)
    {
        $scope.comment_sub = comment_sub;
        //console.log($scope.comment_sub);
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
            $scope.comment_sub.avatar = $rootScope.AVATAR;
            Comment_sub.save($scope.comment_sub, function(commentList)
            {
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
                $rootScope.AVATAR = user.avatar;
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
    swal({
        text: '退出成功！',
        icon: 'success',
    });
    $location.path('/');
}]);

//视频上传控制器
app.controller('UpCtrl', ['$scope', '$resource', '$location', '$rootScope', 'Upload', '$timeout',
function($scope, $resource, $location, $rootScope, Upload, $timeout)
{
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
            $scope.video.avatar = $rootScope.AVATAR;
        
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
app.controller('UserCtrl', ['$scope', '$resource', '$location', '$routeParams','$rootScope',
function($scope, $resource, $location, $routeParams, $rootScope)
{
    var User = $resource('/api/user/:id');
    var User_update = $resource('/api/user/:id', {id: '@u_name'}, {update: {method: 'PUT'}});
    var Videos = $resource('/api/user_videos/:id');
    var Video_delete = $resource('/api/user_videos/:id');

    //获取用户信息
    User.get({id: $routeParams.id}, function(user)
    {
        $scope.user = user;
        //$rootScope.USER = user;
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
        $scope.user.avatar
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

    var refresh = function()
    {
        Videos.query({id: $routeParams.id}, function(videos)
        {
            $scope.videolist = videos;
        });
    };

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
            refresh();
        });
    };

    /*获取关注列表 */
    var Follow = $resource('/follow/:id');
    Follow.query({id: $rootScope.USERID}, function(result)
    {
        $scope.followList = result;

        //console.log(result.length);
        /*判断关注列表是否为空 */
        if(result.length == 0)
        {
            $scope.isNull = true;
        }
        else
        {
            $scope.isNull = false;
        }
    });

    var fol_refresh = function()
    {
        Follow.query({id: $rootScope.USERID}, function(result)
        {
            $scope.followList = result;
            /*判断关注列表是否为空 */
            if(result.length == 0)
            {
                $scope.isNull = true;
            }
            else
            {
                $scope.isNull = false;
            }
        });
    };

    /*取消关注 */
    $scope.unfollow = function(_id)
    {
        var DelFollow = $resource('/follow');
        let followInfo = {id: _id};
        DelFollow.delete(followInfo, function(result)
        {
            swal({
                title: '取消关注成功！',
                icon: 'success',
                button: true,
            });
            fol_refresh();
        });
    };
}]);

/*访问其他用户主页对应的控制器 */
app.controller('SpaceCtrl', ['$scope', '$resource', '$rootScope', '$routeParams', '$location',
function($scope, $resource, $rootScope, $routeParams, $location)
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

    /*留言板块 */
    /*获取留言 */
    var MsgBoard = $resource('/msgBoard/:id');
    MsgBoard.query({id: $routeParams.id}, function(msgList)
    {
        $scope.msgList = msgList;
    });

    var msgReload = function()
    {
        MsgBoard.query({id: $routeParams.id}, function(msgList)
        {
            $scope.msgList = msgList;
        });
    };

    /*发布留言 */
    var SendMsg = $resource('/msgBoard');
    $scope.leave_msg = function(upMsg)
    {
        if($rootScope.isLogin == false)
        {
            swal({
                text: '请先登录！',
                icon: 'warning',
                button: true,
            });
            $location.path('/login');
        }
        else
        {
            $scope.upMsg = upMsg;
            $scope.upMsg.up_id = $routeParams.id;
            $scope.upMsg.user_id = $rootScope.USERID;
            $scope.upMsg.avatar = $rootScope.AVATAR;
            //$scope.upMsg.content = content;

            SendMsg.save($scope.upMsg, function(result)
            {
                if(!result._id)
                {
                    swal({
                        text: '留言失败！',
                        icon: 'error',
                        button: true,
                    });
                }
                else
                {
                    swal({
                        text: '留言成功！',
                        icon: 'success',
                        button: true,
                    });
                    $scope.upMsg.content = '';
                    msgReload();
                }
            });
        }
    };
}]);

/*动态页面对应的控制器 */
app.controller('DynamicsCtrl', ['$scope', '$resource', '$rootScope', '$routeParams',
function($scope, $resource, $rootScope, $routeParams)
{
    /*获取动态 */
    var Dynamics = $resource('/dynamics');
    var Follow = $resource('/follow/:id');      //获取关注列表，筛选动态

    Follow.query({id: $routeParams.id}, function(followList)
    {
        $rootScope.myFollowList = followList;       //作为全局对象，将结果传递给过滤器
    });

    Dynamics.query(function(dynamicsList)
    {
        $scope.dynamicsList = dynamicsList;

        console.log(dynamicsList.length);
        if(dynamicsList.length == 0)
        {
            $scope.dyIsNull = true;
        }
        else
        {
            $scope.dyIsNull = false;
        }
    });    
}]);

/*消息通知页面的控制器 */
app.controller('NotiCtrl', ['$scope', '$resource', '$rootScope', '$routeParams', '$location',
function($scope, $resource, $rootScope, $routeParams, $location)
{
    /*登录验证 */
    if($rootScope.isLogin == false)
    {
        swal({
            text: '请先登录！',
            icon: 'warning',
        });
        $location.path('/login');
    }

    /*获取消息*/
    var Noti = $resource('/notification/:id');
    Noti.query({id: $routeParams.id}, function(notiList)
    {
        $scope.notiList = notiList;

        if(notiList.length == 0)
        {
            $scope.notiIsNull = true;
        }
        else
        {
            $scope.notiIsNull = false;
        }
    });
}]);