var express = require('express');
var models = require("../db/model");
var router = express.Router();
var utils= require('../utils');
var auth=require('../middlevafy/autoauth');
var multer=require('multer');
var path=require('path');

//图片上传
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("ccc"+file);
        cb(null, '../public/uploads')
    },
    filename: function (req, file, cb) {
        console.log("aaaa"+file);
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
    }
})
var upload = multer({ storage:storage});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// http:/127.0.0.1:3000/users/reg
router.get('/reg',auth.checknotLogin, function(req, res, next) {
  res.render('users/reg.html', { title: '用户注册 '});
});

//路径与上面访问注册页面的路径是一致的,只是动作是post
//这种设计即是RESTful设计原则
//上传头像必须要加upload.single()中间件  single指上传单个文件 其参数是表单中file input框的name属性的值
router.post('/reg',auth.checknotLogin,upload.single('avatar'),function (req,res,next) {
    //获取表单数据
      var user = req.body;
    console.log(user);
    console.log('bbbbb');
      if(user.pwd === user.pwd2)
      {
          models.User.findOne({username:user.username},function (err,doc) {
              if(doc)
              {//如果有值,用户名已存在
                  req.flash('error','用户名已存在');
                  res.redirect('/users/reg');
              }else
              {
                  console.log(req.file);
                  //首先查看头像是否有值
                  if(req.file){
                      //如果存在 则文件上传成功
                      user.avatar = path.join('/uploads',req.file.filename);
                  }else{
                      user.avatar='https://s.gravatar.com/avatar/'+utils.md5(user.email)+'?s=60';
                  }
                  //没有值才能够注册
                  models.User.create(
                      //脱库攻击
                      {username:user.username,
                          password:utils.md5(user.pwd),
                          email:user.email,
                          avatar:user.avatar
                      }, function (err,doc) {
                          if(err)
                          {
                              req.flash('error','服务器忙，请稍后再试');
                              res.redirect("/users/reg");
                          }else
                          {
                              //注册成功,重定向到登陆页面
                              // req.flash('success','注册成功，请登录');
                              res.redirect("/users/login");
                          }
                      })
              }
          })
      }else
      {
          //2次密码不一致
          req.flash('error','两次密码输入不一致');
          res.redirect('/users/reg');
      }
});

router.get('/login',auth.checknotLogin, function(req, res, next) {
  res.render('users/login', { title: '用户登录' });
});

router.post('/login', function(req, res, next) {
    //获取表单数据
    var user = req.body;
    models.User.findOne({username:user.username,
        password: utils.md5(user.pwd)   //这里的pwd必须与html与模板中name名一致
    },function (err,doc) {
          if(doc)
          {
              console.log(doc);
              //若doc存在,那么就是登陆成功
              //登陆成功后就将用户的信息放入session保存
              req.session.user=doc;
              //重定向 是由服务器端向客户端浏览器发出状态是302/301 的响应码
              //告诉客户端浏览器要发出新的请求 地址是’/‘也就是网站的目录
                 // A-->b-->c   从A通过B页面没有停留直接跳转到c   请求了两次
              //转发 forword
                 // A-->b-->c   从A直接跳转到c  只有一次请求   网址在b页面的地址
              //放入成功的消息
              // req.flash('success');   //两个参数代表放入信息  一个参数代表取出信息
              res.redirect("/");
          }else
          {
              //如果doc不存在,那么就是登陆失败
              console.log("err"+err);
              //放入失败的消息
              req.flash('error','登录失败，用户名和密码不匹配');
              res.redirect("/users/login");
          }

    })
});

//退出登录
router.get('/loginout',auth.checkLogin, function(req, res, next) {
    req.session.user=null;
    res.redirect("/");

});


module.exports = router;

