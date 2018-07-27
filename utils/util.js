const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const appid = 'wx094cdf5fd752596f';
const baseUrl = 'https://dg.huifang.cn/api/hfw';
wx.setStorageSync('appid', appid);
// wx.setStorageSync('baseUrl', baseUrl);

// 初始化站点信息
// 获取首页列表
const ajax = function(url,data,successBack,loading,errorBack){
  if (!loading) {
    wx.showLoading({
      title: '加载中',
    })
  }
  wx.request({
    url: url,
    data: data,
    header: {
      // 'content-type': 'application/x-www-form-urlencoded',
      // 'Cookie': wx.getStorageSync('cookie'),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: 'POST',
    success: function (res) {
      wx.hideLoading()
      successBack(res);
    },
    fail: function(res){
      errorBack(res);
    } 
  });
}

const Api ={
  // 首页列表
  homeList:(callBack,data) => {
    ajax(baseUrl,{
      label:'estateList',
      page: 1,
    },function(res){
      if (typeof callBack == 'function'){
        callBack(res);
      }
    })
  },
  // 获取验证码
  getCode:(callback,data) => {
    ajax(baseUrl,data,function(res){
      if (typeof callBack == 'function') {
        callBack(res);
      }
    })
  },
  
  // 热门搜索
  hotSearch:(callback)=>{
    ajax(baseUrl,function(res){
      callback(res)
    })
  }
};

module.exports = {
  Api,
}
