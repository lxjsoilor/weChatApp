const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toHomeBtnFix:430,
    toHomeBtnFixTemp:430,
    startX:0,
    endX:0
  },

  pageTab: function (e) {
    wx.switchTab({
      url: '/pages/home/index/index'
    });
    
  },
  onGotUserInfo:function(e){
    console.log(e);
    // 判断是否同意授权
    if (e.detail.errMsg != 'getUserInfo:fail auth deny'){
      // 同意跳转到首页
      wx.setStorageSync('isImpower', '')
      wx.switchTab({
        url: '/pages/home/index/index'
      });
      
    }else{
      // 保存未授权状态，我的页面需要判断
      wx.setStorageSync('isImpower', 1)
    }
    
  },
  touchStart:function(e){
    this.setData({
      startX: e.touches[0].clientY,
      toHomeBtnFixTemp: this.data.toHomeBtnFix
    })
  },
  touchMove:function(e){
    var disY = e.touches[0].clientY - this.data.startX;
    var positionY = this.data.toHomeBtnFixTemp + disY;
    if(positionY < 60 ){
      positionY = 60;
    }else if(positionY >= 500){
      positionY = 500;
    };
    this.setData({
      toHomeBtnFix: positionY
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 本地存储isFirstLoadApp变为1
    wx.setStorageSync('isFirstLoadApp', '1');
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})