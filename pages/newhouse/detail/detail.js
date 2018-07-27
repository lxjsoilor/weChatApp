// pages/newhouse/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDataBack:false,
    currentPage:1,
    allPage:0,
    alertPop:false,
    applyPop:true,
    orderPop:true,
    focus: false,
    orderFocus: false,
    test:'',
    HuxType:0,
    previewImage:'',
    previewImageArr:[],
    previewBanner:'',
    previewBannerArr:[],
    estate_id:'',
    estate_key:'',
    fang_type:'',
    fang_id:'',
    // 预约看房名字和手机
    orderName:'',
    orderPhone:'',
    // 报名
    isReadMore1:[true],
    // 收藏成功
    collectPop: {
      img: '/assets/icon/nocollect@2X.png',
      text: '收藏成功',
      btnText: '收藏',
      temp:false
    },
    toastShow: true,
    detailData:[],
    detailType:[],
    alert:{
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
    applyPhone: '' ,
    actChangeBtn: true
  },
  // 图片预览
  previewImgFn:function(e){
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.previewImageArr
    })
  },
  actChangeRead:function(){
    this.setData({
      actReadMore: !this.data.actReadMore
    })
  },
  previewBannerFn:function(e){
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.previewBannerArr
    })
  },
  changeRead:function(){
    this.setData({
      readMore: !this.data.readMore
    })
  },
  newsChangeRead: function (e) {
    var tempArr = this.data.newsReadMore;
    tempArr[e.currentTarget.dataset.index].showNews = !tempArr[e.currentTarget.dataset.index].showNews;
    tempArr[e.currentTarget.dataset.index].btn = !tempArr[e.currentTarget.dataset.index].btn;
    this.setData({
      newsReadMore:tempArr
    })
  },

  toCollect:function(){
    app.tabCollect('estate_id', this.data.estate_id,'1',this);
  },

  changePage:function(e){
    var index = e.detail.current + 1;
    this.setData({
      currentPage:index
    })
  },
  returnFalse:function(){
    return false;
  },
  // 立即报名
  applyBtn:function(e){
    this.setData({
      applyPop: false,
      applFocus: true,
      applyData: e
    });
    return;
  },
  closeApply:function(){
    this.setData({
      applyPop: true,
      orderPop: true,
    })
  },
  // 报名提交
  putIn:function(){
    if (app.nameCheck(this.data.applyName)){
      app.model('姓名不能包含特殊符号');
      return;
    } else if (app.nameSpace(this.data.applyName)) {
      app.model('姓名不能包含空格符')
      return;
    } else if (!app.telCheck(this.data.applyPhone)){
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
        console.log(this.data.detailData)
        var tempDetailData = this.data.detailData;
        tempDetailData.preferential.count++;
        this.setData({
          applyPhone:'',
          applyName:'',
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
  sureBtn:function(){
    this.setData({
      alertPop: false
    })
  },
  // 预约看房
  orderBtn:function(){
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
  orderSureBtn:function(){
    app.orderHouse(this.data.orderName, this.data.orderPhone, this.data.estate_id, 1, this.data.detailData.region_id ,(res) => {
      this.closeApply();
      this.setData({
        orderName:'',
        orderPhone:'',
        alertPop: true
      });
      this.canOrder();
      if(res.data.status == 1){
        this.setData({
          alert:{
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
  orderNameFn:function(e){
    this.setData({
      orderName:e.detail.value
    });
    this.canOrder();
  },
  orderPhoneFn:function(e){
    this.setData({
      orderPhone:e.detail.value
    });
    this.canOrder();
  },
  canOrder:function(){
    if (this.data.orderName != '' && this.data.orderPhone != ''){
      this.setData({
        applyDisable:false
      })
    }else{
      this.setData({
        applyDisable: true
      })
    }
  },
  applyNameFn:function(e){
    this.setData({
      applyName: e.detail.value
    });
    this.canApply()
  },
  applyPhoneFn:function(e){
    this.setData({
      applyPhone: e.detail.value
    });
    this.canApply()
  },
  canApply:function(e){
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
  getDetail:function(){
    app.ajax('',{
      label:'estateDetail',
      estate_key: this.data.estate_key
    },(res) => {
      var tempArr = [];
      // 显示最前两个动态
      // 最新动态阅读更多处理
      if (res.data.data.news.length > 0) {
        // res.data.data.news = res.data.data.news.reverse();
        if(res.data.data.news.length >= 0){
          res.data.data.news = res.data.data.news.splice(0,2);
        }
        // res.data.data.news[1].news_content = '目前，永福锦江国际多种户型在售，30-40㎡单间配套、90㎡两房、';
        res.data.data.news.forEach(val => {
          if (app.readMore(val.news_content,80) === 0){
            tempArr.push({
              btn: true,
              showNews: true,
              showBtn:false
            });
          }else{
            val.news_content_short = app.readMore(val.news_content,80);
            tempArr.push({
              btn: true,
              showNews: false,
              showBtn: true
            });
          };
        });
        
        this.setData({
          newsReadMore: tempArr
        });
        
      };
      // 去除最新活动内容标签并做阅读更多功能处理
      if (JSON.stringify(res.data.data.preferential)!='{}'){
        res.data.data.preferential.news_content = app.delHtmlTag(res.data.data.preferential.news_content);
        this.setData({
          showActive:true
        });
        if (app.readMore(res.data.data.preferential.news_content) === 0){
          this.setData({
            actChangeBtn: false,
            actReadMore: true
          })
        }else{
          res.data.data.preferential.news_content_short = app.readMore(res.data.data.preferential.news_content);
          // console.log(res.data.data.preferential.news_content_short)
        }
      };
      
      this.setData({
        detailData:res.data.data,
        allPage: res.data.data.banners.length,
        previewBannerArr: res.data.data.banners,
        isDataBack:true,
      });
      // 存储浏览记录
      app.saveBrowseHistory(1, res.data.data.estate_id);
      if (res.data.data.estate_collection_state == 1){
        this.setData({
          collectPop: {
            img: '/assets/icon/collected@2X.png',
            text: '收藏成功',
            btnText: '已收藏',
            temp: true
          }
        })
      }
    })
  },
  // 获取主力户型
  getType:function(){
    app.ajax(app.getBaseUrl().site_url,{
      label:'estateHouseTypeList',
      estate_id: this.data.estate_id,

    },(res) => {
      if(res.data.status == 1){
        var tempArr = [];
        res.data.data.forEach((val) => {
          tempArr.push(val.upload_id)
        });      
        this.setData({
          HuxType: res.data.data.length * 154 + 20,
          detailType: res.data.data,
          previewImageArr:tempArr
        });
      }
    })
  },
  readMore:function(e){
    var index = e.currentTarget.dataset.index;
    var tempArr = this.data.isReadMore1;
    tempArr[index] = !tempArr[index];
    this.setData({
      isReadMore1:tempArr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      estate_id: options.estate_id,
      estate_key: options.estate_key
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDetail();
    this.getType();
    this.setData({
      test: this.data.test.substr(0,60)
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