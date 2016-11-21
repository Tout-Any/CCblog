/**
 * Created by maggie on 16/11/16.
 */
var express = require('express');
var models = require("../db/model");
//加载express的路由模块
var router = express.Router();
var utils= require('../utils');
var auth=require('../middlevafy/autoauth');
var markdown=require('markdown').markdown;

// var multer=require('multer');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('index');
    // res.redirect('/article/list/1/2');
});
// 发布文章  http://127.0.0.1:3000/article/add
router.get('/post',auth.checkLogin,function(req, res, next) {
    res.render('article/post.html',{title:'发布文章'});
});
router.post('/post',auth.checkLogin,function(req, res, next) {
    var article=req.body;
    models.Article.create({
        title:article.title,
        content:article.content,
        user:req.session.user._id
    },function (err,article) {
        if(err){
            req.flash('error','发布失败，请稍后再试');
            res.redirect('/article/post');

        }else{
            console.log(req.body);
            // req.flash('success','发布成功');
            res.redirect('/');
        }
    });
});
//查看文章详情页
router.get('/detail/:id', function (req, res) {
    models.Article.findById(req.params.id).populate('user').exec(function(err,art){
        art.content = markdown.toHTML(art.content);
        console.log(req.params.id);
        console.log(art);
        res.render('article/detail',{title:'文章详情',article:art});
    });
});
//搜索  get /article/list/3/2   第三页 每一页有两条数据   没有搜索关键字
//搜索  post /article/list/3/2   第三页 每一页有两条数据   有搜索关键字
router.all('/list/:pageNum/:pageSize',function (req,res,next) {
    var searchBtn=req.query.search;
    var pageNum=req.params.pageNum&&req.params.pageNum>0?parseInt(req.params.pageNum):1;
    var pageSize=req.params.pageSize&&req.params.pageSize>0?parseInt(req.params.pageSize):2;
    var query={};
    var keyword=req.query.keyword;
    if(searchBtn){
        //将搜索关键字繁华如session中 这样其就不会丢失
        req.session.keyword = keyword;
    }
    if(keyword){
        //设置查询条件
        query['title'] = new RegExp(req.session.keyword,"i");
    }

    console.log(pageNum, pageSize);
    //查询这个关键字的结果一共有多少条
    models.Article.count(query,function (err,count) {
//         //查询符合关键字的当前页数据
        models.Article
            .find(query)
            .sort({'createTime':-1})
            .skip((pageNum-1)*pageSize)
            .limit(pageSize)
            .populate('user')
            .exec(function (err,articles) {
                res.render('index.html',
                    {
                        tit:'最新文章',
                        title:'文章列表',
                        articles:articles,  //页面要显示的数据
                        count:count,    //查询出的数据一共多少条
                        pageSize:pageSize,  //当前页有几条
                        pageNum:pageNum,   //当前是第几页
                        keyword:keyword
                    });
            });
    })
});


module.exports = router;
