var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//添加文章的路由
router.post('/add', function(req, res, next) {
  res.send('添加文章');
});
//查看文章的路由
router.get('/view', function(req, res, next) {
  res.send('查看文章');
});

module.exports = router;
