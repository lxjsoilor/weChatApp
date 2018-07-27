// pages/my/collect/collect.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    delBtnWidth: 80,
  },
  pageTab: function (e) {
    if (!e.currentTarget.dataset.status) {
      console.log(e);
      var url = '';
      if (e.currentTarget.dataset.type == '新房') {
        url = `/pages/newhouse/detail/detail?estate_key=${e.currentTarget.dataset.estatekey}&estate_id=${e.currentTarget.dataset.estateid}`
      } else if (e.currentTarget.dataset.type == '二手房') {
        url = `/pages/secondhouse/detailhouse/detailhouse?fang_key=${e.currentTarget.dataset.fankey}`
      } else {
        url = `/pages/renthouse/detail/detail?fang_key=${e.currentTarget.dataset.fankey}`
      };
      wx.navigateTo({
        url: url
      });
    } else {
      app.model('该房源已下线')
    }

  },
  deleteRecoFang(e){
    app.deleteRecoFang(e,this,'预约')
  },
  // 获取我的收藏列表
  getList:function(){
    app.ajax('',{
      label:'userListEstateOrder'
    },(res) => {
      if(res.data.status == 1){
        res.data.data.forEach(val => {
          val.txtStyle = '0px';
        })
        // console.log(res.data.data)
        // res.data.data = res.data.data.reverse();
        this.setData({
          list:res.data.data,
          isDataBack:true
        })
      }else {
        // app.model(res.data.msg)
        this.setData({
          isNoData: true,
          isDataBack: true
        })
      }
    })
  },
  // 我的收藏删除
  // deleteThis:function(e){
  //   var obj = {};
  //   obj.label = 'userDelRecoFang';
  //   obj.client_id = e.currentTarget.dataset.clientid;
  //   app.ajax('',obj,(res) => {
  //     console.log(res)
  //     if(res.data.status == 0){
  //       var tempArr = this.data.list;
  //       tempArr.splice(e.currentTarget.dataset.index,1);
  //       this.setData({
  //         list:tempArr
  //       })
  //     }else {
  //       app.model(res.data.msg)
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(9090)
    this.getList()
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