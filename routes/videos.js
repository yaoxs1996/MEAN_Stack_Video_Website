//为主页提供RESTful API
var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/website');

//在主页获取并展示视频封面
router.get('/', function(req, res)
{
    var collection = db.get('videos');
    collection.find({}, function(err, videos)
    {
        if(err)
        {
            throw err;
        }
        res.json(videos);
    });
});

//根据id获取视频，与进入视频详情页相关
router.get('/:id', function(req, res)
{
    var collection = db.get('videos');
    collection.findOne({_id: req.params.id}, function(err, video)
    {
        if(err)
        {
            throw err;
        }
        res.json(video);
    });
});

//上传视频
router.post('/', function(req, res)
{
    var collection = db.get('videos');
    collection.insert({
        up_date: Date().now(),
        v_tag: req.body.tag,
        v_path: "videos/" + req.body.videoname,
        v_coverage: "asset/" + req.body.picname,
        v_title: req.body.title,
        v_brief: req.body.brief,
        v_viewcounts: 0,
        like: 0
    }, function(err, video)
    {
        if(err)
        {
            throw err;
        }
        res.json(video);
    });
});

module.exports = router;
