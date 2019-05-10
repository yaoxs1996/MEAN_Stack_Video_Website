/*关注动态功能 */
var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/website');

/*获取更新动态 */
router.get('/', function(req, res)
{
    var collection = db.get('dynamics');
    collection.find({}, function(err, dynamicsList)
    {
        if(err)
        {
            throw err;
        }
        res.json(dynamicsList);
    });
});

/*动态更新
实际功能实现在video_upload.js文件中*/
router.post('/', function(req, res)
{
    var collection = db.get('dynamics');
    collection.insert({
        user_id: req.body.u_name,
        video_id: req.body.v_id,
        update_time: Date.now(),
        isRead: false
    }, function(err, dynamics)
    {
        if(err)
        {
            throw err;
        }
        res.json(dynamics);
    });
});

module.exports = router;
