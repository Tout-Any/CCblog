#### $watch 监视$scope中的数据
1，监视普通变量
2，监视数组

angularjs中混合使用原生js代码修改$sope中的值时不会生效 需要使用$scope.apply()强制生效
定时器
原生的定时器setInterval  setTimeout在angularjs 中混合使用需要调用$scope.apply()让修改生效
angular 中提供了$setInterval $setTimeout 替代原生定时器
使用时要在定义控制器时，通过参数注入进来
百度搜索的jsonp地址
使用angularjs的$http.jsonp()方法提交请求 需要两个参数 
 1，第一个参数wd是关键字  2，cb是回掉函数的名字  在angular中回掉函数的名字必须是JSON_CALLBACK 提交数据
http://suggestion.baidu.com/su?wd=ai&cb=test
