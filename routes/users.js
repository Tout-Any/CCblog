var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/reg', function(req, res, next) {
  res.send('注册页面');
});
router.get('/login', function(req, res, next) {
  res.send('登陆页面');
});

module.exports = router;
