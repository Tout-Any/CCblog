//基础模块
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//会话支持模块
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config=require('./dbconfig');
var flash=require('connect-flash');
//数据库模块
// require('./db');
// var settings=require('./settings');

//加载路由文件  routes文件夹专门存放路由文件
//index实际上就是index.js文件中创建的router对象
var index = require('./routes/index');
var users = require('./routes/users');
var article = require('./routes/article');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

//用html格式的文档做模板  要以下方式写
app.set('view engine', 'html');
app.engine('html',require('ejs').__express);

//解析cookie
app.use(cookieParser());
//添加session会话
app.use(session({
  secret: 'CCblog',//secret 用来防止篡改  加密cookie
  cookie: {maxAge: 1000 * 60 * 60 * 30},//设定 cookie 的生存期，这里我们设置 cookie 的生存期为 30 天
  resave:true,     //表示每次请求处理完毕后都更新session数据
  saveUninitialized:true,   //保持新创建但未初始化的session
  store: new MongoStore({ //设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免重启服务器时会话丢失
    url:config.dburl
  })
}));

//解析cookie 取出消息
app.use(flash());

//由于需要给每个页面在渲染时传递session当中保存的user对象 所以可以添加一个中间件 处理session的问题
// 添加一个自己定义的中间件 其实就是一个函数
app.use(function (req,res,next) {
  res.locals.myuser=req.session.user;
  res.locals.success=req.flash('success');   //取信息
  res.locals.error=req.flash('error');   //取信息
  next();
})
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//设置表单格式 需要两种格式   json 和 urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//加载解析cookie
app.use(cookieParser());
//设置静态目录
app.use(express.static(path.join(__dirname, 'public')));

//设置路由处理模块  所有访问"/"网站根目录的请求都由index路由模块处理
app.use('/', index);
//所有与用户user相关的操作请求都访问'/users'这个路径,并且交给users路由模块处理  /users      /users/reg    /users/login
app.use('/users', users);
//所有的路由处理全部模块化 所有访问相同资源的请求都由同一个路由模块处理
//符合了RESTful的设计原则

//负责处理文章的路由
app.use('/article',article);

// catch 404 and forward to error handler
//捕捉错误路由 生成错误对象
app.use(function(req, res, next) {
  var err = new Error('页面找不到');
  err.status = 404;
  //转到下一个中间件 做错误页面的渲染
  next(err);
});

// error handler 错误页面的渲染
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = (req.app.get('env') === 'development' ? err : {});

  // render the error page
  res.status(err.status || 500);
  //渲染错误页面
  res.render('error');
});

//把app暴露给外界
module.exports = app;
