/*好友关注相关 */
var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/website');

/*获取关注列表 */
router.get('/:id', function(req, res)
{
    var collection = db.get('follow');
    /*获取一系列的记录 */
    collection.find({user_id: req.params.id},
    function(err, followlist)
    {
        if(err)
        {
            throw err;
        }

        /*未关注任何用户 */
        if(followlist == null)
        {
            followlist.errMsg = 'EMPTY_FOLLOW';
        }
        res.json(followlist);
    });
});

/*添加关注 */
router.post('/', function(req, res)
{
    var collection = db.get('follow');

    /*插入记录 */
    collection.insert({
        user_id: req.body.userId,
        follow_id: req.body.followId,
    }, function(err, follow)
    {
        if(err)
        {
            throw err;
        }
        res.json(follow);
    });
});

/*取消关注 删除对应文档对象 */
router.delete('/', function(req, res)
{
    var collection = db.get('follow');

    if(req.query.id != null)
    {
        collection.remove({_id: req.query.id}, function(err, follow)
        {
            if(err)
            {
                throw err;
            }
            res.json(follow);
        });
    }
    else
    {
        collection.remove({user_id: req.query.userId, follow_id: req.query.followId},
        function(err, follow)
        {
            if(err)
            {
                throw err;
            }
            res.json(follow);
        });
    }
});

module.exports = router;
