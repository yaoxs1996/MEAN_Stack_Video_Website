var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session = require('express-session');
var multipart = require('connect-multiparty');    //上传相关
global.db = require('./db/mongo');

var app = express();

app.use(session({
  secret: 'secret',
  cookie: {maxAge: 1000*60*30}
}));

//上传相关
app.use(multipart({uploadDir: 'upload'}));

app.use(function(req, res, next)
{
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = "";
  if(err)
  {
    res.locals.message = '<div class="alert alert-danger" style="margin-bottom: 20px;color:red">' + err + '</div>';
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').__express);   //设置对HTML文件的渲染方式

app.use(logger('dev'));
app.use(bodyParser.json());   //用法似乎和下面的express.json相同
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./'));    //与文件上传相关

app.use('/', indexRouter);
app.use('/users', usersRouter);

//自添加的路由
//主页相关
var videoRouter = require('./routes/videos');
app.use('/api/videos', videoRouter);

//用户注册登录等相关
var loginRouter = require('./routes/login');
app.use('/api/login', loginRouter);

var regRouter = require('./routes/register');
app.use('/api/register',regRouter);
//文件上传
var uploadRouter = require('./routes/video_upload');
app.use('/video_upload', uploadRouter);
//var upload_pic = require('./routes/upload_pic');
//app.use('/upload_pic', upload_pic);

//评论功能
var commentRouter = require('./routes/comment');
app.use('/comment', commentRouter);

//个人信息
var userinfoRouter = require('./routes/userinfo');
app.use('/api/user', userinfoRouter);

var userVideoRouter = require('./routes/user_videos');
app.use('/api/user_videos', userVideoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
