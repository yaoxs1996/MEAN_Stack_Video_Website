//为在主页显示评论构建RESTful API
var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/website');

router.get('/', function(req, res)
{
    var collection = db.get('comment');
    collection.find({}, function(err, comment)
    {
        if(err)
        {
            throw err;
        }
        res.json(comment);
    });
});

router.get('/:id', function(req, res)
{
    var collection = db.get('comment');
    //console.log(req.params);
    collection.find({v_id: req.params.id}, function(err, comment)
    {
        //console.log("这里是评论功能回调函数");
        //console.log(comment);
        if(err)
        {
            res.send(500);
            throw err;
        }
        //console.log(comment);
        res.status(200).json(comment);
    });
});

//增加评论
router.post('/', function(req, res)
{
    var collection = db.get('comment');
    collection.insert({
        v_id: req.body.v_id,
        content: req.body.content,
        from_uid: req.body.from_uid
    },
    function(err, comment)
    {
        if(err)
        {
            throw err;
        }
        res.json(comment);
    }
    );
});

module.exports = router;
