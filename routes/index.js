var express = require('express');
//加载express的路由模块
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CCblog' });   // 渲染首页
});

module.exports = router;
