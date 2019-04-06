var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var monk = require('monk');
var db = monk('localhost:27017/website');

router.post('/', multer({
    dest: 'upload'      //不存在则会自己创建
}).single('file'), function(req, res)
{
    if(req.file.length === 0)
    {
        console.log("上传文件为空");
        return;
    }
    else
    {
        var file = req.file;
        var fileInfo = {};
        fs.renameSync('./upload/' + file.filename, './public/videos/' + file.originalname);
        fileInfo.mimetype = file.mimetype;
        fileInfo.originalname = file.originalname;
        fileInfo.size = file.size;
        fileInfo.path = file.path;

        //获取文件名
        var picname = file.originalname.substring(0, file.originalname.indexOf("."));
        var cmd = "ffmpeg -i D:\\Projects\\web\\video_website\\public\\videos\\" + file.originalname + " -r 1 -ss 00:00:05 -vframes 1 D:\\Projects\\web\\video_website\\public\\asset\\" + picname + ".jpg";
        cp.exec(cmd);
        console.log("上传成功");
        //res.location('/');
        return;
        /*var collection = db.get('videos');
        collection.insert({
            v_path: "videos/" + file.originalname,
            //v_coverage:
        }, function(err, video)
        {
            if(err)
            {
                throw err;
            }
        });*/
    }
});

module.exports = router;
