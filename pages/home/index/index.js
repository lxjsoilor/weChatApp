// pages/home/index/index.js
const app = getApp()
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    salePrice: true,
    bgW:'',
    dataList:[],
    currentSite:'东莞',
    isDataBack:false,
    gradual:'',
    advSlider:[],
    isMoreAdv:false,
    imgHeight:'height:115px;'
    // hasIndicator:'indicatorDots: true'
  },
  // 监听滚动事件
  onPageScroll: function (e) {
    if(e.scrollTop > 140){
      this.setData({
        bgW : 'get_bg_w'
      })
    }else {
      this.setData({
        bgW : ''
      })
    }
    var scrollHeight = e.scrollTop;
    if(e.scrollTop > 200){
      scrollHeight = 200;
    } else if (e.scrollTop < 50){
      scrollHeight = 0;
    }
    var tempAph = scrollHeight / 200;
    this.setData({
      gradual: `background-color:rgba(255,255,255,${tempAph})`
    })

    
  },
  // q切换城市
  toTabCity:function(){
    wx.navigateTo({
      url: '../location/location'
    })
  },
  toSearch:function(){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  pageTab:function(e){
    app.pageTab(e)
  },
  toSellHouse:function(){
    wx.switchTab({
      url: '/pages/sellhouse/sell/sell'
    })
  },
  // 获取当前定位城市
  getCurrentSite(){
    app.ajax('https://dg.huifang.cn/api/hfw',{
      label:'publicCurrentSite'
    },res=>{
      // console.log(res)
      if(false){
        var locationStorage = wx.getStorageSync('location');
        app.model('您当前的定位是东莞，是否切换至东莞？',true,res=>{
          var obj = {
            site_name:'东莞',
            site_code: 441900,
            site_url:'https://dg.huifang.cn/api/hfw',
            firstChange:true
          }
          wx.setStorageSync('location', obj);
          this.onShow()
        })
        // }
      }
    })
  },
  // 获取广告轮播图
  getAdvSlider:function(){
    app.ajax(app.getBaseUrl().site_url,{
      label:'publicAdList'
    },(res) => {
      if(res.data.status == 1){
        var temp = false;
        if(res.data.data.length >1){
          temp = true;
        };
        // res.data.data.forEach((val)=>{
        //   val.img = val.img.replace('.jpg','.png');
        // })
        this.setData({
          advSlider:res.data.data,
          isMoreAdv:temp
        })
      }
    },true)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('checkRestate', '');

    // 获取session3rd，存到本地
    app.getSession3rd();

    var viewWidth = wx.getSystemInfoSync().windowWidth;
    if (viewWidth == 375){
      this.setData({
        imgHeight:'height:115px;'
      })
    } else if (viewWidth == 320){
      this.setData({
        imgHeight: 'height:100px;'
      })
    } else if (viewWidth == 414) {
      this.setData({
        imgHeight: 'height:120px;'
      })
    }else{
      this.setData({
        imgHeight: 'height:115px;'
      })
    };

    // 判断是否是第一次加载小程序,是的话,跳转到微信授权页面
    // 第一次进入app，isFirstLoadApp没有值会跳转页面
    if (wx.getStorageSync('isFirstLoadApp') == ''){
      wx.navigateTo({
        url: '../impower/impower',
      });
      
    };

    
  },
  getList: function(){
    this.setData({
      dataList:[],
      isNoData:false,
      isDataBack:false
    });
    app.ajax(app.getBaseUrl().site_url, {
      label: 'estateList',
      page: 1
    }, (res) => {
      if (res.data.status == 1) {
        this.setData({
          dataList: res.data.data,
          isDataBack: true
        });
      } else {
        this.setData({
          isDataBack: true,
          isNoData: true
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getList();
    this.getCurrentSite();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var location = wx.getStorageSync('location');
    if (location.firstChange) {
      this.getList();
      location.firstChange = false;
      wx.setStorageSync('location', location)
    }else{
      app.ajax(app.getBaseUrl().site_url, {
        label: 'estateList',
        page: 1
      }, res => {
        if (res.data.status == 1) {
          this.setData({
            dataList: res.data.data,
            isDataBack: true
          });
        } else {
          this.setData({
            isDataBack: true,
            isNoData: true
          })
        }
      },true)
    }
    this.getAdvSlider()
    this.setData({
      currentSite: app.getBaseUrl().site_name
    });
    
    // 判断用户是否已经经过了授权页面
    if (wx.getStorageSync('isFirstLoadApp') == '1') {
      // 判断是否已经绑定手机号码
      if (!app.session3rd()) {
        wx.navigateTo({
          url: '/pages/bindphone/bindphone?'
        });
      };
    }
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