//用户模块 注册登录等
var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/website');

//注册功能
router.post('/', function(req, res)
{
    var collection = db.get('users');
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
