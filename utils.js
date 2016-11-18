/**
 * Created by asus-pc on 2016/11/17.
 */
//加密技术
//md5算法 是不可逆加密算法  所以安全性较好
exports.md5=function (inputStr) {
    return require('crypto').createHash('md5').update(inputStr).digest('hex');
}