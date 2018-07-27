// pages/newhouse/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDataBack: false,
    defeatedImg: app.globalData.defeatedImg,
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
    previewPhotoImageArr: [],
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
    detailData: [],
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
    actChangeBtn: true,
    isSelfPage: true,
    allEstatePhoto: 0
  },
  // 链接跳转
  pageTab: function(e){
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
  previewPhotoFn: function(e){
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.previewPhotoImageArr
    })
  },
  actChangeRead: function () {
    this.setData({
      actReadMore: !this.data.actReadMore
    })
  },
  previewBannerFn: function (e) {
    var url = e.currentTarget.dataset.url;
    console.log(url);
    console.log(this.data.previewBannerArr)
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

  changePage: function (e) {
    var index = e.detail.current + 1;
    this.setData({
      currentPage: index
    })
  },
  returnFalse: function () {
    return false;
  },
  // 立即报名
  applyBtn: function (e) {
    this.setData({
      applyPop: false,
      applFocus: true,
      applyData: e
    });
    return;
  },
  closeApply: function () {
    this.setData({
      applyPop: true,
      orderPop: true,
    })
  },
  // 报名提交
  putIn: function () {
    if (app.nameCheck(this.data.applyName)) {
      app.model('姓名不能包含特殊符号');
      return;
    } else if (app.nameSpace(this.data.applyName)) {
      app.model('姓名不能包含空格符')
      return;
    } else if (!app.telCheck(this.data.applyPhone)) {
      app.model('手机号码格式不正确')
      return;
    }
    var e = this.data.applyData;
    app.ajax('', {
      label: 'actJoinin',
      estate_id: this.data.estate_id,
      news_type: e.currentTarget.dataset.newtype,
      news_id: e.currentTarget.dataset.newid,
      join_name: this.data.applyName,
      join_phone: this.data.applyPhone
    }, (res) => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '报名成功',
          icon: 'success',
          duration: 2000
        });
        this.closeApply();
        var tempDetailData = this.data.detailData;
        tempDetailData.preferential.count++;
        this.setData({
          applyPhone: '',
          applyName: '',
          detailData: tempDetailData
        });
        this.canApply()
      } else {
        // wx.showToast({
        //   title: res.data.msg,
        //   image: '/assets/icon/order_error@2X.png',
        //   duration: 2000
        // })
        app.model(res.data.msg)
      }
    })
  },
  sureBtn: function () {
    this.setData({
      alertPop: false
    })
  },
  // 预约看房
  orderBtn: function (e) {
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
    // 判断是否是赚赚分享
    if (this.data.isSelfPage){
      this.setData({
        orderFocus: true,
        orderPop: false
      })
    }else{
      app.pageTab(e);
    }
    
  },
  // 预约看房确定
  orderSureBtn: function () {
    app.orderHouse(this.data.orderName, this.data.orderPhone, this.data.estate_id, 1, this.data.detailData.region_id, (res) => {
      this.closeApply();
      this.setData({
        orderName: '',
        orderPhone: '',
        alertPop: true
      });
      this.canOrder();
      if (res.data.status == 1) {
        this.setData({
          alert: {
            title: '预约成功!',
            content: '客服人员将尽快与您联系',
            img: '/assets/icon/order_success@2X.png'
          }
        })
      } else {
        this.setData({
          alert: {
            title: '您已提交过预约!',
            content: '无需重复提交',
            img: '/assets/icon/order_error@2X.png'
          }
        })
      }
    });
  },
  orderNameFn: function (e) {
    this.setData({
      orderName: e.detail.value
    });
    this.canOrder();
  },
  orderPhoneFn: function (e) {
    this.setData({
      orderPhone: e.detail.value
    });
    this.canOrder();
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
  applyNameFn: function (e) {
    this.setData({
      applyName: e.detail.value
    });
    this.canApply()
  },
  applyPhoneFn: function (e) {
    this.setData({
      applyPhone: e.detail.value
    });
    this.canApply()
  },
  canApply: function (e) {
    if (this.data.applyName != '' && this.data.applyPhone != '') {
      this.setData({
        applyActDisable: false
      })
    } else {
      this.setData({
        applyActDisable: true
      })
    }
  },
  // 异步请求
  getDetail: function () {
    app.ajax('', {
      label: 'XcxProjectDetail',
      project_key: this.data.project_key
    }, (res) => {
      var tempArr = [res.data.data.upload_url];
      this.setData({
        isDataBack:true,
        detailData:res.data.data,
        detailType: res.data.data.huxingData ? res.data.data.huxingData:[],
        HuxType: res.data.data.huxingData ? res.data.data.huxingData.length * 154 + 20 : 0,
        previewBannerArr: tempArr
      });
      // 获取地图图片
      app.getMapImg(res.data.data.estate_latitude, res.data.data.estate_longitude, (mapImg) => {
        this.setData({
          mapSrc: mapImg.url
        })
      });
      // 获取地图周边信息
      app.getMapPoiData(res.data.data.estate_latitude, res.data.data.estate_longitude, ['医院','教育','商业','交通','公园'],(mapData)=>{
        var mapDataObj = {};
        for (var key in mapData){
          mapDataObj[key] = [];
          if(mapData[key].poisData.length > 0){
            mapData[key].poisData.forEach((val, index) => {
              if (index < 5) {
                mapDataObj[key].push(val.name + '、')
              }
            })
          }else{
            mapDataObj[key].push(`附近暂无相关${key}位置信息`)
          }
          
        };
        this.setData({
          mapDataObj:mapDataObj
        })
      });
      // 获取楼盘相册
      // console.log(res.data.data)
      this.getEstatePhoto(res.data.data.estate_key);

    })
  },
  // 获取主力户型
  getType: function () {
    app.ajax(app.getBaseUrl().site_url, {
      label: 'estateHouseTypeList',
      estate_id: this.data.estate_id,
      
    }, (res) => {
      if (res.data.status == 1) {
        var tempArr = [];
        res.data.data.forEach((val) => {
          tempArr.push(val.upload_id)
        });
        this.setData({
          HuxType: res.data.data.length * 154 + 20,
          detailType: res.data.data,
          previewImageArr: tempArr
        });
      }
    })
  },
  readMore: function (e) {
    var index = e.currentTarget.dataset.index;
    var tempArr = this.data.isReadMore1;
    tempArr[index] = !tempArr[index];
    this.setData({
      isReadMore1: tempArr
    })
  },
  // 获取楼盘相册
  getEstatePhoto: function (estate_key){
    app.ajax('',{
      label: 'XcxEstatePhoto',
      estate_key: estate_key
    },(result)=>{
      console.log(result);
      var tempArr = [];
      result.data.data
      for(var key in result.data.data){
        result.data.data[key].forEach((val)=>{
          tempArr.push(val);
        })
      };
      var tempArrLength = tempArr.length;
      var tempArrSplice3 = tempArr.splice(0, 3);
      this.setData({
        allEstatePhoto: tempArrLength,
        estatePhoto: tempArrSplice3,
        previewPhotoImageArr: tempArrSplice3
      });
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      project_id: options.project_id,
      project_key: options.project_key,
      isSelfPage: !!options.is_self_page ? true : false
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