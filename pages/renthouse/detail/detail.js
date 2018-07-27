// pages/newhouse/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDataBack: false,
    currentPage: 1,
    allPage: 0,
    alertPop: false,
    applyPop: true,
    orderFocus: false,
    test: '',
    HuxType: 0,
    previewBanner: '',
    previewBannerArr: [],
    estate_id: '',
    fang_key: '',
    orderPop:true,
    aroundInfo:{},
    //地图坐标
    markers: [{
      iconPath: "/assets/icon/markers_icon.png",
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 19,
      height: 24
    }],
    // 报名
    isReadMore1: [true],
    alert: {
      title: '预约成功',
      content: '客服人员将尽快与您联系',
      img: '/assets/icon/order_success@2X.png'
    },
    // 收藏成功
    collectPop: {
      img: '/assets/icon/nocollect@2X.png',
      text: '收藏成功',
      btnText: '收藏',
      temp: false
    },
    toastShow: true,
    detailData: [],
    detailType: [],
    applyDisable: true,
    orderPhone:''

  },
  // 图片预览
  previewBannerFn: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.previewBannerArr
    })
  },

  toCollect: function () {
    app.tabCollect('fang_id', this.data.fang_id, '4',this)
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
  // 预约看房
  orderBtn: function () {
    if (!app.session3rd()) {
      wx.showModal({
        title: '提示',
        content: '您未绑定手机',
        confirmText: '去绑定',
        confirmColor: '#fd7801',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.navigateTo({
              url: '/pages/bindphone/bindphone?newpop=1'
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
      return;
    };
    this.setData({
      orderFocus: true,
      orderPop: false
    })
  },
  // 预约看房确定
  closeApply: function () {
    this.setData({
      orderPop: true
      // alertPop: true
    })
  },
  sureBtn: function () {
    this.setData({
      alertPop: false
    })
  },
  orderSureBtn: function () {
    app.orderHouse(this.data.orderName, this.data.orderPhone, this.data.estate_id, 3, this.data.detailData.region_id,(res) => {
      this.closeApply();
      this.setData({
        orderName: '',
        orderPhone: '',
        alertPop: true
      });
      this.canOrder();
      if (res.data.status == 1) {
        this.setData({
          alertPop: true,
          alert: {
            title: '预约成功!',
            content: '客服人员将尽快与您联系',
            img: '/assets/icon/order_success@2X.png'
          }
        })
      } else {
        this.setData({
          alertPop: true,
          alert: {
            title: '您已提交过预约!',
            content: '无需重复提交',
            img: '/assets/icon/order_error@2X.png'
          }
        })
      }
    }, this.data.detailData.client_id);
  },
  orderNameFn: function (e) {
    this.setData({
      orderName: e.detail.value
    });
    this.canOrder()
  },
  orderPhoneFn: function (e) {
    this.setData({
      orderPhone: e.detail.value
    });
    this.canOrder()
  },
  canOrder: function () {
    if (this.data.orderName != '' && this.data.orderPhone != '') {
      this.setData({
        applyDisable: false
      })
    } else {
      this.setData({
        applyDisable: true
      })
    }
  },
  // 异步请求
  getDetail: function () {
    app.ajax('', {
      label: 'rentDetail',
      fang_key: this.data.fang_key
    }, (res) => {
      var tempArr = [];
      res.data.data.scroll_imgs.forEach((val) => {
        tempArr.push(val.upload_url)
      });
      var tempObj = this.data.markers[0];
      tempObj.latitude = res.data.data.estate_latitude;
      tempObj.longitude = res.data.data.estate_longitude;
      // var tempStr = res.data.data.fang_supporting;
      // res.data.data.fang_supporting = tempStr.split(',');
      // 把设施改为英文名称，
      var supportArr = new Array(res.data.data.fang_supporting.length);
      res.data.data.fang_supporting.forEach((val,i)=>{
        for (var key in app.globalData.iconObj){
          if (app.globalData.iconObj[key] == val){
            supportArr.splice(i,1,key)
          }
        };
      });
      res.data.data.estate_address = app.removeDup(res.data.data.estate_address, 4)
      res.data.data.fang_supporting_img = supportArr;
      this.setData({
        detailData: res.data.data,
        estate_id: res.data.data.estate_id,
        allPage: res.data.data.scroll_imgs.length,
        isDataBack: true,
        previewBannerArr: res.data.data.scroll_imgs,
        markers: [tempObj],
        fang_id: res.data.data.fang_id
      });
      // 判断是否已经保存
      if (res.data.data.fang_collection_state == 1){
        this.setData({
          collectPop: {
            img: '/assets/icon/collected@2X.png',
            text: '收藏成功',
            btnText: '已收藏',
            temp: true
          },
        })
      }
      // 存储浏览记录
      app.saveBrowseHistory(3, res.data.data.fang_id);
      // 地图渲染
      app.getMapImg(res.data.data.estate_latitude, res.data.data.estate_longitude, (data) => {
        this.setData({
          mapSrc: data.url
        })
      });
      // 获取周边信息
      app.getAroundInfo(res.data.data.estate_latitude, res.data.data.estate_longitude,(res) => {
        this.setData({
          aroundInfo:res.data.data
        })
      });
    })
  },
  // 举报房源
  reportThis: function () {
    app.reportHouse(this.data.fang_key);
  },
  pageTab: function (e) {
    app.pageTab(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fang_key: options.fang_key
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDetail();

    // this.getType();
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