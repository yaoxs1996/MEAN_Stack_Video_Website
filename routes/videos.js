//为主页提供RESTful API
var express = require('express');
var router = express.Router();
var fs = require('fs');     //文件系统
var multer = require('multer');     //上传模块
var upload = multer({dest: 'public/videos/'}).single('up_v');       //实例上传模块，前端使用参数名

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
        //console.log(video.toJSONString());
        if(err)
        {
            throw err;
        }
        res.status(200).json(video);
    });
});

//上传视频
router.post('/', function(req, res)
{
    
    //数据库信息插入
    var collection = db.get('videos');
    collection.insert({
        up_date: new Date().toLocaleString(),
        up_id: req.body.up_id,
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

/*删除视频 */
router.delete('/:id', function(req, res)
{
    var collection = db.get('videos');
    var videoname;
    var picname;

    collection.findOne({_id: req.params.id}, function(err, video)
    {
        if(err)
        {
            throw err;
        }

        videoname = video.v_path;
        picname = video.v_coverage;
        
        /*删除视频文件以及封面 */
        fs.unlink('./public/' + picname, function(err)
        {
            if(err)
            {
                return console.error(err);
            }
            console.log('封面删除成功！');
        });
        fs.unlink('./public/' + videoname, function(err)
        {
            if(err)
            {
                return console.error(err);
            }
            console.log('视频删除成功！');
        });
    });

    collection.remove({_id: req.params.id}, function(err, video)
    {
        if(err)
        {
            throw err;
        }

        res.json(video);
    });
});

module.exports = router;
