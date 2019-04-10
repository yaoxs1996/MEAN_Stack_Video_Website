/*用户个人页面的视频 */

var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/website');

//获取用户上传的视频
router.get('/:id', function(req, res)
{
    var collection = db.get('videos');
    collection.find({up_id: req.params.id}, function(err, videos)
    {
        if(err)
        {
            throw err;
        }
        res.json(videos);
    });
});

//删除视频
router.delete('/:id', function(req, res)
{
    var collection = db.get('videos');
    collection.remove({up_id: req.body.id}, function(err, video)
    {
        if(err)
        {
            throw err;
        }
        res.json(video);
    });
});

module.exports = router;