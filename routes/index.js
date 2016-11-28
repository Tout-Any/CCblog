var express = require('express');
//加载express的路由模块
var model=require('../db/model');
var router = express.Router();
var markdown=require('markdown').markdown;

/* 指向首页*/
router.get('/', function(req, res, next) {
  model.Article.find({}).populate('user').exec(function (err,articles) {
    // console.log(articles);
    // articles.forEach(function(art){
    //   art.content = markdown.toHTML(art.content);
    // });
    // res.render('index', { title: 'CCblog',tit:'最新文章',articles:articles,createTime:'createTime' });
    res.redirect('/article/list/1/5');
  });
});
module.exports = router;
