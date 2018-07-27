


// pages/my/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    numCollect:0,//收藏
    numOrder:0,//预约
    numRecord:0,//看房记录
    numRequest:0,//委托
    numHistory:0,//浏览记录
    userPhone:''
  },
  pageTab: function (e) {
    app.pageTab(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasAva: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 判断是否登录
    if (!app.session3rd()) {
      wx.switchTab({
        url: '/pages/home/index/index',
        success: (res) => {
          wx.navigateTo({
            url: '/pages/bindphone/bindphone'
          });
        }
      });
    }
    //获取浏览记录
    // console.log(wx.getStorageSync('browseHistory'))
    var length = !!wx.getStorageSync('browseHistory')[app.getBaseUrl().site_code]? wx.getStorageSync('browseHistory')[app.getBaseUrl().site_code].length :0;
    this.setData({
      numHistory: length
    });
    // 获取其他我的信息
    app.ajax('',{
      label: 'userInfo',
    },(res) => {
      if(res.data.status == 1){
        this.setData({
          numCollect: res.data.data.collect,//收藏
          numOrder: res.data.data.yuyue,//预约
          numRecord: res.data.data.showings,//看房记录
          numRequest: res.data.data.weituo,//委托
          userPhone: res.data.data.user_mobile
        })
      }else{

      }
    },true);


    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }

})