/**
 * Created by asus-pc on 2016/11/18.
 */
exports.checkLogin=function (req,res,next) {
    if(req.session.user){   //如果已登录 则放行
        next();
    }else{
        res.redirect('/users/login');
    }
}

//检查用户没登陆的
exports.checknotLogin=function (req,res,next) {
    if(req.session.user){   //如果已登录 回到首页
        res.redirect('/');
    }else{
        next();    //没登陆 则继续查看
    }
}