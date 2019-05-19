/*留言板功能 */
var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/website');

/*获取留言板信息 */
router.get('/:id', function(req, res)
{
    var collection = db.get('msgBoard');
    collection.find({user_id: req.params.id}, function(err, msgList)
    {
        if(err)
        {
            throw err;
        }
        res.json(msgList);
    });
});

/*写入留言板 */
router.post('/', function(req, res)
{
    var collection = db.get('msgBoard');
    var col_noti = db.get('notification');

    collection.insert({
        user_id: req.body.up_id,
        sender_id: req.body.user_id,
        send_time: new Date().toLocaleString(),
        send_content: req.body.content,
        avatar: req.body.avatar,
    }, function(err, msgList)
    {
        if(err)
        {
            throw err;
        }

        /*同时写入消息通知表中 */
        col_noti.insert({
            mas_id: req.body.up_id,
            sla_id: req.body.user_id,
            type: 'msg',
            noti_time: new Date().toLocaleString(),
            isRead: false,
            avatar: req.body.avatar,
        }, function(err)
        {
            if(err)
            {
                throw err;
            }
        });

        res.json(msgList);
    });
});

module.exports = router;
