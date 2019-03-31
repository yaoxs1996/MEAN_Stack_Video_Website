//用户模块 注册登录等
var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/website');

//注册功能
router.post('/', function(req, res)
{
    console.log(req.body);
    var collection = db.get('users');
    //判断用户名是否已存在
    //var username = req.body.u_name;
    
    collection.insert(
        {
            u_name: req.body.u_name,
            u_pwd: req.body.pwd,
            email: req.body.email
        },
        function(err, user)
        {
            if(err)
            {
                throw err;
            }
            res.json(user);
        }
    );
});


module.exports = router;
