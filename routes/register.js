//用户模块 注册登录等
var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/website');

router.get('/:id', function(req, res)
{
    var collection = db.get('users');
    collection.findOne({u_name: req.params.id}, function(err, user)
    {
        if(err)
        {
            throw err;
        }
        res.json(user);
    });
});

//注册功能
router.post('/', function(req, res)
{
    var collection = db.get('users');
    
    /*先使用findOne方法 */
    collection.findOne({u_name: req.body.u_name}, function(err, user)
    {
        if(err)
        {
            res.send(500);
            throw err;
        }

        /*用户名已存在 */
        if(user != null)
        {
            user.errMsg = 'ACC_EXIST';      //账户已存在
            res.json(user);
        }
        /*默认情况 用户名未使用 */
        else if(user == null)
        {
            /*执行insert方法 */
            collection.insert({
                u_name: req.body.u_name,
                u_pwd: req.body.pwd,
                email: req.body.email,
                avatar: "avatar/default.png"
            }, function(err, ret_user)
            {
                if(err)
                {
                    res.send(500);
                    throw err;
                }
                res.json(ret_user);
            });
        }
    });
});

module.exports = router;
