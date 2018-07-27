// pages/newhouse/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDataBack: false,
    detailData: [],
  },
  pageTab: function (e) {
    app.pageTab(e)
  },
  // 异步请求
  getDetail: function () {
    app.ajax(app.getBaseUrl().site_url, {
      label: 'XcxProjectDetail',
      project_key: this.data.project_key
    }, (res) => {
      console.log(res)
      this.setData({
        detailData: res.data.data,
        isDataBack: true
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      project_key: options.project_key
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDetail();
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