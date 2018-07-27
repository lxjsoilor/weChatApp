// pages/sellhouse/sell/sell.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRent: false,
    showSearch: false,
    showType: true,
    showHX: true,
    fanType: -1,
    fanHX: [-1, -1, -1],
    tempFanType: -1,
    tempFanHX: [-1, -1, -1],
    typeText: '',
    HXText: '',
    searchList: [],
    searchVal: '',
    noSearch: true,
    formData: {},
    estateName: '',
    estateId: '',
    regionId: '',
    fanArea: '',
    sellPrice: '',
    rentPrice: '',
    phoneNum: '',
    phoneCode: '',
    canEntrust: true,
    codeText: '获取验证码',
    disabled: false,
    interval: null,
    timer: 60,
    HXSelect: [new Array(9), new Array(10), new Array(10)],
    canEntrustAgain: true,
    searchMore: true
  },
  // 判断委托按钮是否需要高亮
  returnFalse: function () {
    return false;
  },
  // 搜索小区
  searchEstate: function (e) {
    this.setData({
      searchVal: e.detail.value.trim(),
      noSearch: true,
      searchList: [],
      searchMore: false
    });
    if (e.detail.value.trim() == '') {
      this.setData({
        searchMore: true
      })
      return;
    };
    var keyWord = e.detail.value.trim();
    app.keySearch(keyWord, 'estateListByName', '', (res) => {
      if (!res) { return; };
      console.log(res);
      console.log(res.data.data)
      if (!!res.data.data) {
        if (res.data.status == 1) {
          res.data.data.forEach((val) => {
            var tempArr = val.estate_name.split(keyWord);
            tempArr = tempArr.join(`|${keyWord}|`).split('|');
            val.estate_name = tempArr;
          });
          console.log(this.data.searchVal)
          if (this.data.searchVal.trim() == '') {
            return;
          };
          this.setData({
            searchList: res.data.data,
            noSearch: false,
            hasMore: false
          })
        } else {
          this.setData({
            noSearch: false,
            hasMore: true
          })
        }
      } else {
        this.setData({
          noSearch: false,
          hasMore: true
        })
      }
    }, true, this)
  },
  emptySearch: function () {
    this.setData({
      searchVal: '',
      searchList: [],
      noSearch: true,
      searchMore: true
    })
  },
  // 地区选择
  selectEstate: function (e) {
    // 存入数据缓存
    var obj = {};
    obj.estateId = e.currentTarget.dataset.id;
    obj.estateName = e.currentTarget.dataset.name.join('');
    obj.regionId = e.currentTarget.dataset.rid;
    wx.setStorageSync('checkRestate', obj)
    wx.switchTab({
      url: '/pages/sellhouse/sell/sell'
    });

    // 判断提交按钮是否可用
    // this.canReport();
  },
  cancelSearch: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  
  // 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是已经绑定

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
    var siteName = wx.getStorageSync('location').site_name || '东莞';
    this.setData({
      siteName: siteName
    });


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