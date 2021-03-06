var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/website');

//读取个人信息
router.get('/:id', function(req, res)
{
    var col_user = db.get('users');

    //获取用户信息
    col_user.findOne({u_name: req.params.id}, function(err, user)
    {
        if(err)
        {
            throw err;
        }
        res.json(user);
    });
});

/*获得用户列表 */
router.get('/', function(req, res)
{
    var collection = db.get('users');
    collection.find({}, {fields: {u_name: 1, avatar: 1}}, function(err, users)
    {
        if(err)
        {
            throw err;
        }
        res.json(users);
    });
});

//修改个人信息
router.put('/:id', function(req, res)
{
    var collection = db.get('users');
    collection.update({u_name: req.params.id},
    {
        u_name: req.body.u_name,
        u_pwd: req.body.u_pwd,
        sex: req.body.sex,
        email: req.body.email,
        avatar: req.body.avatar
        //birth: req.body.birth
    }, function(err, user)
    {
        if(err)
        {
            throw err;
        }
        res.json(user);
    });
});

module.exports = router;