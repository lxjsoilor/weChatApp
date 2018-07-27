// pages/swiper/swiper.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDataBack: false,
    defeatedImg: app.globalData.defeatedImg,
    scrollTop: 100,
    imgArr: [],
    imgListArr: [],
    duration: 500,
    currentPage: 2,
    txtArr: [],
    txtImgType: [],
    txtObj: {
      2: '室内图-3',
      7: '风景图-5',
      11: '室外图-4'
    },
    currentFangType:'',
    currentFangTypePage:'',
    fangTypeAllPage:'',
    classCurrent: [true, false, false],
    isShow: true,
    tempObj: {
      'xg': '效果图',
      'yb': '样板间',
      'sj': '实景图',
      'xc': '现场图',
      'pt': '配套图',
      'pm': '平面图',
      'jt': '交通图',
    }
    // imgWidth:wx.getSystemInfoSync().windowWidth
  },
  pageChange: function (e) {
    var current = e.detail.current;
    var tempIndex = 0;
    
    console.log(current);
    console.log(1111);
    for (var key in this.data.txtObj) {
      tempIndex += 1;
      if (current <= key) {
        var currentPage = this.data.txtObj[key].split('-')[1];
        tempIndex -= 1;
        var tempArr = [];
        (this.data.classCurrent).forEach((val) => {
          tempArr.push(false);
        });
        tempArr[tempIndex] = true;
        var index = tempArr.findIndex((val)=>{
          return val;
        });
        console.log(this.data.txtObj[key].split('-')[0]);
        console.log(currentPage - key + current);
        
        this.setData({
          classCurrent: tempArr,
          scrollTop: 100 * index,
          currentFangType: this.data.txtObj[key].split('-')[0],
          currentFangTypePage: currentPage - key + current,
          fangTypeAllPage: currentPage
        });
        return;
      }
    }

  },
  bindscrollFn(e){
  },
  openSwiper: function (e) {
    if (!!e.currentTarget.dataset.current || e.currentTarget.dataset.current == 0) {
      this.setData({
        duration: 0,
      });
      this.setData({
        currentPage: e.currentTarget.dataset.current
      })
      this.setData({
        duration: 500,
      });
    }
    this.setData({
      isShow: !this.data.isShow,
    })
  },
  toPage: function (e) {
    this.setData({
      duration: 0,
    });
    this.setData({
      currentPage: e.target.dataset.page,
    });
    this.setData({
      duration: 500,
    });
  },
  returnFalse: function () {
    return false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app.ajax('',{
      estate_key: options.estate_key,
      label: 'XcxEstatePhoto'
    },(data)=>{
      var tempArr = [];
      var tempTxtObj = {};
      var tempArr2 = [];
      var tempListArr = [];
      // JS对象无序，不能直接遍历
      var resulte = data.data.data;
      // 去除空的数组
      for(var key in resulte){
        if(resulte[key].length == 0){
          delete resulte[key] 
        }
      }
      var imgIndex = 0;
      
      console.log(resulte)
      imgTypeFn(resulte['xg'], 'xg');
      imgTypeFn(resulte['yb'], 'yb');
      imgTypeFn(resulte['sj'], 'sj');
      imgTypeFn(resulte['xc'], 'xc');
      imgTypeFn(resulte['pt'], 'pt');
      imgTypeFn(resulte['pm'], 'pm');
      imgTypeFn(resulte['jt'], 'jt');
      function imgTypeFn(arr, key) {
        if (!arr) {
          arr = [];
        }
        var index = tempArr.length;
        var isFirstImg = 1;
        arr.forEach((val) => {
          tempArr.push(val);
          tempListArr.push({
            title: _this.data.tempObj[key],
            imgUrl: val,
            firstImg: isFirstImg,
            imgLength: arr.length,
            imgIndex: imgIndex
          });
          imgIndex += 1;
          isFirstImg = 0;
        });
        if (arr.length == 0) {
          tempListArr.push({
            title: _this.data.tempObj[key],
            imgUrl: '',
            firstImg: 1,
            imgLength: arr.length
          });
        } else {
          tempTxtObj[tempArr.length - 1] = _this.data.tempObj[key] + '-' + arr.length;
          tempArr2.push({
            text: _this.data.tempObj[key],
            page: index
          });
        }

      }
      _this.setData({
        imgListArr: tempListArr,
        imgArr: tempArr,
        txtObj: tempTxtObj,
        txtImgType: tempArr2,
        isDataBack: true
      })
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.pageChange({ detail:1})
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