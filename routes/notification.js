/*消息通知功能 */
var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/website');

/*获取留言板信息并修改*/
router.get('/:id', function(req, res)
{
    var collection = db.get('notification');
    collection.find({mas_id: req.params.id}, function(err, notiList)
    {
        if(err)
        {
            throw err;
        }
        res.json(notiList);
    });
});

module.exports = router;