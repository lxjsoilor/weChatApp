// pages/my/collect/collect.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    delBtnWidth: 80
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getList: function(){
    // 获取本地储存中的浏览记录
    var historyStr = wx.getStorageSync('browseHistory')[app.getBaseUrl().site_code] || [];
    console.log(wx.getStorageSync('browseHistory'))
    if(historyStr.length==0){
      this.setData({
        isNoData:true,
        isDataBack: true
      })
      return;
    }else{
      this.setData({
        isNoData:false,
      })
    }
    var idStr = ''; 
    historyStr.forEach( val => {
      idStr += `${val.fanType}-${val.fanId},`
    });
    console.log(idStr)
    idStr = idStr.substring(0,idStr.length-1);
    app.ajax('',{
      label: 'userBrowsing',
      id_str: idStr
    },(res) => {
      if(!!res.data.data){
        var list = res.data.data;
        list.forEach((val) => {
          val.txtStyle = '0px';
        });
        // 去地区名重复
        res.data.data.forEach(val => {
          val.address = app.removeDup(val.address, 4)
        })
        this.setData({
          list: res.data.data,
          isDataBack:true
        })
      }else{
        this.setData({
          isNoData: true,
          isDataBack: true
        })
      }
    })
  },
  pageTab: function(e){
    if (!e.currentTarget.dataset.status) {
      var url = '';
      if (e.currentTarget.dataset.type == 1) {
        url = `/pages/newhouse/detail/detail?estate_key=${e.currentTarget.dataset.estatekey}&estate_id=${e.currentTarget.dataset.estateid}`
      } else if (e.currentTarget.dataset.type == 2) {
        url = `/pages/secondhouse/detailhouse/detailhouse?fang_key=${e.currentTarget.dataset.estatekey}`
      } else {
        url = `/pages/renthouse/detail/detail?fang_key=${e.currentTarget.dataset.estatekey}`
      }
      wx.navigateTo({
        url: url
      });
    } else {
      app.model('该房源已下线')
    }
  },
  deleteBtn:function(e){
    app.model('确定删除该记录？',true,res=>{
      var fanType = e.currentTarget.dataset.fantype;
      var fanId = e.currentTarget.dataset.fanid;
      // 删除本地存储中的记录
      var historyList = wx.getStorageSync('browseHistory')[app.getBaseUrl().site_code];
      var index = historyList.findIndex((val) => {
        return val.fanType == fanType && val.fanId == fanId;
      });
      if (index != -1) {
        historyList.splice(index, 1);
        var tempArr = this.data.list;
        // 更新页面数据
        tempArr.splice(index, 1);
        this.setData({
          list: tempArr
        });
        // 更新本地存储数据
        var historyObj = wx.getStorageSync('browseHistory');
        historyObj[app.getBaseUrl().site_code] = historyList;
        console.log(historyList);
        console.log(historyObj);
        wx.setStorageSync('browseHistory', historyObj);
        if (historyList.length == 0) {
          this.setData({
            isNoData: true
          })
          return;
        } else {
          this.setData({
            isNoData: false
          })
        }
      }
    })
  },
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(app.globalData.smg)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
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

  touchS: function (e) {
    app.touchS(this, e);
  },
  touchM: function (e) {
    app.touchM(this, e);
  },

  touchE: function (e) {
    app.touchE(this, e);
  },

})