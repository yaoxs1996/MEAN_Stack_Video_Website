var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/website');

router.post('/', function(req, res)
{
	var collection = db.get('users');
	collection.findOne({u_name: req.body.u_name}, function(err, user)
	{
		if(err)
		{
			res.send(500);		//服务器内部错误
			throw err;
		}

		/*用户名不存在 */
		if(user == null)
		{
			res.json(user);
		}
		/*密码错误 */
		else if(user.u_pwd != req.body.u_pwd)
		{
			user.status = '404';
			user.errMsg = '密码错误！';
			user.u_pwd = null;
			res.json(user);
		}
		else
		{
			user.status = '200';
			user.errMsg = null;
			user.u_pwd = null;
			res.status(200).json(user);
		}
	});
});

module.exports = router;
