// pages/home/location/location.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationList: [],
    text: app.globalData.searchTip
  },
  // 获取站点信息
  getAllLocation:function(){
    var locationList = wx.getStorageSync('locationList');
    this.setData({
      locationList: locationList
    });
  },
  // 获取当前选中站点的信息
  getCurrentSite:function(){
    var currentSite = wx.getStorageSync('location') || { site_name: '东莞', site_url: 'https://dg.huifang.cn/api/hfw', site_code: '441900' };
    this.setData({
      currentSite: currentSite
    })
  },
  selectSite:function(e){
    var obj = {};
    obj.site_name = e.currentTarget.dataset.name;
    obj.site_code = e.currentTarget.dataset.code;
    obj.site_url = e.currentTarget.dataset.url.replace('http','https') + '/api/hfw';
    obj.firstChange = true;
    wx.setStorageSync('location',obj);
    app.getFilter();
    app.getRegion();
    wx.switchTab({
      url: '/pages/home/index/index'
    })
  },
  goBack:function(){
    app.goBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllLocation();
    this.getCurrentSite();
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

})