// pages/newhouse/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDataBack: false,
    currentPage: 1,
    allPage: 0,
    alertPop: true,
    applyPop: true,
    focus: false,
    test: '',
    HuxType: 0,
    previewImage: '',
    previewImageArr: [],
    previewBanner: '',
    previewBannerArr: [],
    estate_id: '',
    estate_key: '',
    toastShow: true,
    detailData: [],
    detailType: [],
    readMore:true,
    showReadMore: true
  },
  pageTab:function(e){
    app.pageTab(e)
  },
  // 阅读更多
  changeRead:function(){
    this.setData({
      readMore: !this.data.readMore
    })
  },
  
  // 图片预览
  previewBannerFn: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.previewBannerArr
    })
  },

  changePage: function (e) {
    var index = e.detail.current + 1;
    this.setData({
      currentPage: index
    })
  },
  returnFalse: function () {
    return false;
  },

  // 异步请求
  getDetail: function () {
    app.ajax(app.getBaseUrl().site_url, {
      label: 'estateOldDetail',
      estate_key: this.data.estate_key
    }, (res) => {
      // res.data.data.estate_introduce = '客户到达楼盘现场，成交即可享受2万抵5万优惠！客户到达楼盘现场，成交即可享受2万抵5万优惠！客户到达楼盘现场，成交即可享受2万抵5万优惠'
      if (app.readMore(res.data.data.estate_introduce, 80) == 0){
        // 隐藏阅读更多按钮
        this.setData({
          showReadMore:false,
          readMore:false
        })
      }else{
        res.data.data.estate_introduce_short = app.readMore(res.data.data.estate_introduce, 80);
      }
      this.setData({
        detailData: res.data.data,
        allPage: res.data.data.banners.length,
        previewBannerArr: res.data.data.banners,
        isDataBack: true
      });
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      estate_key: options.estate_key
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