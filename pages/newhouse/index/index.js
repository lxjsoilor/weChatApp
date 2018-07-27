// pages/newhouse/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shade: true,
    loadMore: 1,
    tab: [true,true,true],
    tabText: ['区域','价格','类型'],
    dataList:[],
    page:1,
    regionList:[],
    priceList:[],
    typeList:[],
    rid:0,
    priceid:1,
    typeid:0,
    minPrice:'',
    maxPrice:'',
    disabled:true
  },

  // 标签切换
  tabFilter:function(e){
    var index = e.currentTarget.dataset.tab;
    var tempTab = [true,true,true];
    tempTab[index] = !this.data.tab[index];
    this.setData({
        tab: tempTab
    });
    this.showShade();
  },
  showShade:function(){
    var index = this.data.tab.findIndex(function(val){
      return !val;
    });
    if(index > -1){
      this.setData({
        shade: false
      });
    }else{
      this.setData({
        shade: true
      });
    }
    
  },
  // 下一页
  nextPage: function(){
    if (this.data.loadMore == 3){
      return;
    }else{
      var page = this.data.page+=1;
      console.log(page)
      this.getList(page);
      this.setData({
        page:page
      })
    }
    
  },
  // 获取区域列表
  getRegion:function(){
    if(!!app.globalData.regionData){
      this.setData({
        regionList: app.globalData.regionData.data
      })
    } else {
      app.getRegion((res) => {
        this.setData({
          regionList: res.data.data
        })
      })
    }
  },
  // 获取价格类型筛选
  getFilter:function(){
    if (!!app.globalData.filterData){
      this.setData({
        priceList: app.globalData.filterData.data.estate_price,
        typeList: app.globalData.filterData.data.estate_type
      })
    }else{
      app.getFilter((res) => {
        this.setData({
          priceList: res.data.data.estate_price,
          typeList: res.data.data.estate_type
        })
      })
    }
  },
  // 选择区域
  selectRegion:function(e){
    var tempArr = this.data.tabText;
    tempArr.splice(0, 1, e.currentTarget.dataset.text);
    this.setData({
      rid: e.currentTarget.dataset.rid,
      page:0,
      loadMore:1,
      dataList:[],
      tabText:tempArr
    });
    this.shadeTab();
    var page = this.data.page+=1;
    this.getList(page);
  },
  // 选择价格
  selectPrice:function(e){
    var tempArr = this.data.tabText;
    tempArr.splice(1, 1, e.currentTarget.dataset.text);
    this.setData({
      priceid: e.currentTarget.dataset.key,
      page: 0,
      loadMore: 1,
      dataList: [],
      tabText: tempArr
    });
    this.shadeTab();
    var page = this.data.page += 1;
    this.getList(page);
  },
  minPriceInp: function (e) {
    this.setData({
      minPrice:e.detail.value
    });
    this.judgePrice();
  },
  maxPriceInp: function (e) {
    this.setData({
      maxPrice:e.detail.value
    });
    this.judgePrice();
  },
  judgePrice: function(){
    if ((this.data.minPrice == '' && this.data.maxPrice != '') || (this.data.minPrice != '' && this.data.maxPrice == '') || (parseInt(this.data.minPrice) < parseInt(this.data.maxPrice))){
      this.setData({
        disabled:false
      })
    } else {
      this.setData({
        disabled:true
      })
    }
  },
  selectPriceBtn:function(){
    var min = 0;
    var max = 0;
    var tempTxt = '';
    var tempArr = this.data.tabText;
    if (this.data.minPrice == ''){
      min = 0;
      max = this.data.maxPrice;
      tempTxt = '元/㎡以下';
      tempArr.splice(1, 1, max + tempTxt);
    }else if(this.data.maxPrice == ''){
      min = this.data.minPrice;
      max = 999999;
      tempTxt = '元/㎡以上';
      tempArr.splice(1, 1, min + tempTxt);
    }else {
      min = this.data.minPrice;
      max = this.data.maxPrice;
      tempTxt = '元/㎡';
      tempArr.splice(1, 1, min + '-' + max + tempTxt);
    };
    var tempPrice = min + '-' + max;
    this.setData({
      priceid: tempPrice,
      page: 0,
      loadMore: 1,
      dataList: [],
      tabText: tempArr
    });
    this.shadeTab();
    var page = this.data.page += 1;
    this.getList(page);
  },
  // 选择类型
  selectType:function(e){
    var tempArr = this.data.tabText;
    tempArr.splice(2, 1, e.currentTarget.dataset.text);
    this.setData({
      typeid: e.currentTarget.dataset.key,
      page: 0,
      loadMore: 1,
      dataList: [],
      tabText: tempArr
    });
    this.shadeTab();
    var page = this.data.page += 1;
    this.getList(page);
  },
  // 根据筛选请求列表
  // 跳转搜索页面
  toSearch:function(){
    wx.navigateTo({
      url:'../search/search'
    })
  },
  shadeTab:function(){
    this.setData({
      tab: [true, true, true],
      shade: true
    })
    return;
  },
  returnFalse:function(){
    return false;
  },
  pageTab:function(e){
    app.pageTab(e)
  },
  // 请求列表数据
  getList(page){
    this.setData({
      loadMore:2,
      isNoData:false
    })
    app.getList(page,{
      label: 'estateList',
      region_id: this.data.rid == 0 ? '' : this.data.rid,
      estate_type:this.data.typeid == 0?'': this.data.typeid,
      estate_price:this.data.priceid == 1?'': this.data.priceid,
      page:page
    },(res) => {
      console.log(res);
      if(res.data.status == 1){
        this.setData({
          dataList: this.data.dataList.concat(res.data.data),
          loadMore: 1
        });
        if (res.data.data.length<=8){
          this.setData({
            loadMore: 3
          });
        }
      } else if(page == 1) {
        this.setData({
          loadMore: 0,
          isNoData: true
        });
      } else {
        this.setData({
          loadMore: 3
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getList(1);
    this.getRegion();
    this.getFilter();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(3)
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
    console.log(90)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})