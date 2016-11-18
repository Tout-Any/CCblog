var express = require('express');
//加载express的路由模块
var router = express.Router();
var model=require('../db/model');

/* 指向首页*/
router.get('/', function(req, res, next) {
  model.Article.find({}).populate('user').exec(function (err,articles) {
    console.log(articles);
    res.render('index', { title: 'CCblog',tit:'我的文章',articles:articles });
  });

});

module.exports = router;
