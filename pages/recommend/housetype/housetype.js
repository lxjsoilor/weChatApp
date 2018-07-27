// pages/newhouse/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDataBack: false,
    defeatedImg: app.globalData.defeatedImg,
    detailData: [],
    currentPage: 1,
    allPage: 0,
    alertPop: false,
    applyPop: true,
    orderPop: true,
    focus: false,
    orderFocus: false,
    test: '',
    HuxType: 0,
    previewImage: '',
    previewImageArr: [],
    previewBanner: '',
    previewBannerArr: [],
    estate_id: '',
    estate_key: '',
    fang_type: '',
    fang_id: '',
    // 预约看房名字和手机
    orderName: '',
    orderPhone: '',
    // 报名
    isReadMore1: [true],
    // 收藏成功
    collectPop: {
      img: '/assets/icon/nocollect@2X.png',
      text: '收藏成功',
      btnText: '收藏',
      temp: false
    },
    toastShow: true,
    detailType: [],
    alert: {
      title: '预约成功',
      content: '客服人员将尽快与您联系',
      img: '/assets/icon/order_success@2X.png'
    },
    readMore: true,
    showActive: false,
    applyDisable: true,
    applyActDisable: true,
    applyData: {},
    applFocus: false,
    applyPhone: '',
    actChangeBtn: true
  },
  // 链接跳转
  pageTab: function (e) {
    app.pageTab(e)
  },
  // 图片预览
  previewImgFn: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.previewImageArr
    })
  },
  actChangeRead: function () {
    this.setData({
      actReadMore: !this.data.actReadMore
    })
  },
  previewBannerFn: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.previewBannerArr
    })
  },
  changeRead: function () {
    this.setData({
      readMore: !this.data.readMore
    })
  },
  newsChangeRead: function (e) {
    var tempArr = this.data.newsReadMore;
    tempArr[e.currentTarget.dataset.index].showNews = !tempArr[e.currentTarget.dataset.index].showNews;
    tempArr[e.currentTarget.dataset.index].btn = !tempArr[e.currentTarget.dataset.index].btn;
    this.setData({
      newsReadMore: tempArr
    })
  },

  toCollect: function () {
    app.tabCollect('estate_id', this.data.estate_id, '1', this);
  },

  returnFalse: function () {
    return false;
  },


  // 异步请求
  getDetail: function () {
    app.ajax('', {
      label: 'XcxEstateHouseTypeInfo',
      housetype_key: this.data.housetype_key,
    }, (res) => {
      this.setData({
        detailData:res.data.data,
        previewBannerArr: [res.data.data.upload_url],
        isDataBack:true
      });
      wx.setNavigationBarTitle({
        title: res.data.data.title//页面标题为路由参数
      })
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      housetype_key: options.housetype_key
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDetail();
    this.setData({
      test: this.data.test.substr(0, 60)
    })
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