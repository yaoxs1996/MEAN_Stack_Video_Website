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
		/*else if(!user)
		{
			req.session.error = '用户不存在';
			console.log('用户不存在');
			res.send(404);
		}
		else
		{
			if(user.u_pwd != req.body.u_pwd)
			{
				req.session.error = '密码错误';
				//res.render('index', {message: '密码错误'});
				console.log('密码错误');
				res.send(404);
			}
			else
			{
				req.session.user = user;
				//res.json(user);
				//res.send(200);
				res.status(200).json(user);
			}
		}*/
		res.status(200).json(user);
	});
});

module.exports = router;
