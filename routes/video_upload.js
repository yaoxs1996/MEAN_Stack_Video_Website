var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var cp = require('child_process');
var monk = require('monk');
var db = monk('localhost:27017/website');

router.post('/', multipartMiddleware, function(req, res)
{
    var collection = db.get('videos');
    var file = req.files.file;

    var filepath = file.path;
    var index_1 = filepath.lastIndexOf("\\");
    var index_2 = filepath.length;
    var filename = filepath.substring(index_1 + 1, index_2);        //截取出上传到upload目录之后的文件名 注意+1，不清楚为什么会多出一个反斜杠
    //同步版rename方法，实现文件移动
    fs.renameSync('./upload/' + filename, './public/videos/' + filename);

    /*生成封面*/
    var picname = filename.substring(0, filename.indexOf("."));     //取出无后缀的文件名
    /*FFmpeg命令*/
    var videos_path = "D:\\Projects\\web\\video_website\\public\\videos\\";
    var pics_path = "D:\\Projects\\web\\video_website\\public\\asset\\";
    var ff_args = " -r 1 -ss 00:00:05 -vframes 1 ";       //FFmpeg参数
    var cmd = "ffmpeg -i " + videos_path + filename + ff_args + pics_path + picname + ".jpg";
    cp.exec(cmd);       //执行命令

    /*删除缓存 */
    fs.unlink('./upload/' + filename, function(err)
    {
        if(err)
        {
            return console.error(err);
        }
        console.log("缓存删除成功！");
    });

    /*数据库插入*/
    var videoinfo = req.body.videoinfo;
    collection.insert({
        up_date: new Date().toLocaleString(),
        up_id: videoinfo.up_id,
        v_tag: videoinfo.tag,
        v_path: "videos/" + filename,
        v_coverage: "asset/" + picname + ".jpg",
        v_title: videoinfo.title,
        v_brief: videoinfo.brief,
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

    /*动态更新 */
    var col_dynamics = db.get('dynamics');
    var videoId;
    /*重新取出视频id */
    collection.findOne({v_path: "videos/" + filename}, function(err, video)
    {
        if(err)
        {
            throw err;
        }
        //console.log(video);
        //console.log(JSON.stringify(video));
        videoId = video._id;

        /*动态表插入 */
        col_dynamics.insert({
            user_id: videoinfo.up_id,
            video_id: JSON.stringify(videoId),
            update_time: new Date().toLocaleString(),
            isRead: false
        }, function(err, dynamics)
        {
            if(err)
            {
                throw err;
            }
        });
    });
});

module.exports = router;
