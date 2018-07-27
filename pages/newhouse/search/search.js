// pages/home/search/search.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fanType: 1,
    searchType: '新房',
    searchTypeField: 'estateList',
    searchTypePop: true,
    searchVal: '',
    hotSearch: {
      estate:[],
      fang:[],
      rent:[]
    },
    searchRes: [],
    searchIng: true,
    noSearch: true,
    searchPage: 1,
    hasMore: true,
    searchMore: false,
    canNext: true,
    searchHistory: {
      newHouse: [],
      secondHouse: [],
      rentHouse: []
    },
  },
  //页面跳转并且保存搜索记录
  pageTab: function (e) {
    app.searchToDetail(e, this.data.fanType, this.data.searchHistory, () => {
      this.setData({
        searchHistory: wx.getStorageSync('searchHistory')
      })
    });

  },
  // 触发输入
  searchInp: function (e) {
    this.setData({
      searchVal: e.detail.value.trim(),
      searchRes: [],
      searchPage: 1,
      hasMore: true,
      searchMore: false,
      canNext: true,
      searchTypePop: true
    });
    this.searchByKey();
  },
  // 清空搜索
  emptySearch: function () {
    this.setData({
      searchVal: '',
      searchRes: [],
      searchPage: 1,
      hasMore: true,
      searchMore: false,
      canNext: true
    })
  },
  // 清空历史记录
  emptyHistory: function () {
    app.emptyHistory(this.data.fanType, (tempObj) => {
      this.setData({
        searchHistory: tempObj
      });
    })
  },
  // 切换按钮
  searchToggle: function () {
    this.setData({
      searchTypePop: !this.data.searchTypePop
    });
  },
  nextPage: function (e) {
    if (!this.data.canNext) { return; }
    var page = this.data.searchPage += 1;
    this.setData({
      searchPage: page
    });
    this.searchByKey();
  },
  newHouseBtn: function (e) {
    this.setData({
      searchType: '新房',
      searchTypeField: 'estateList',
      fanType: 1,
      searchRes: []
    });
    this.searchToggle();
    this.searchByKey();
  },
  secondBtn: function () {
    this.setData({
      searchType: '二手房',
      searchTypeField: 'fangList',
      fanType: 2,
      searchRes: []
    });
    this.searchToggle();
    this.searchByKey();
  },
  rentBtn: function () {
    this.setData({
      searchType: '租房',
      searchTypeField: 'rentList',
      fanType: 3,
      searchRes: []
    });
    this.searchToggle();
    this.searchByKey();
  },
  // 返回上一页
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 点击热门搜索
  hotSearchBtn(e) {
    this.setData({
      searchVal: e.currentTarget.dataset.keyword
    });
    this.searchByKey();
  },
  // 关键字搜索请求
  searchByKey() {
    this.setData({
      searchIng: true,
      noSearch: true,
      canSearch: false,
      searchMore: false
    });
    app.keySearch(this.data.searchVal, this.data.searchTypeField, this.data.searchPage, (res) => {
      if(!res){ return; };
      var key = this.data.searchVal.trim();
      if (res.data.status == 1) {
        console.log(res.data.data);
        res.data.data.forEach((val) => {
          var tempArr = val.estate_name.split(key);
          tempArr = tempArr.join(`|${key}|`).split('|');
          val.estate_name = tempArr;
        });
        if (res.data.data.length < 10) {
          this.setData({
            searchRes: this.data.searchRes.concat(res.data.data),
            searchMore: false,
            noSearch: false,
            hasMore: false,
            canNext: false
          })
        } else {
          this.setData({
            searchRes: this.data.searchRes.concat(res.data.data),
            searchMore: true,
            searchIng: false,
            noSearch: true
          })
        }

      } else {
        if (this.data.searchPage > 1) {
          this.setData({
            searchIng: false,
            noSearch: false,
            hasMore: false
          })
        } else {
          this.setData({
            searchRes: [],
            searchIng: false,
            noSearch: false,
            hasMore: true
          })
        }
      }
    },true,this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.hotSearch(res => {
      var obj = {};
      if (!!res.data.estate) {
        obj.estate = res.data.estate.splice(0, 4);
      } else {
        obj.estate = [];
      };
      if (!!res.data.fang) {
        obj.fang = res.data.fang.splice(0, 4);
      } else {
        obj.fang = [];
      };
      if (!!res.data.rent) {
        obj.rent = res.data.rent.splice(0, 4);
      } else {
        obj.rent = []
      };
      this.setData({
        hotSearch: obj
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!!wx.getStorageSync('searchHistory')) {
      this.setData({
        searchHistory: wx.getStorageSync('searchHistory')
      })
    } else {
      this.setData({
        searchHistory: {
          newHouse: [],
          secondHouse: [],
          rentHouse: []
        }
      })
    };
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