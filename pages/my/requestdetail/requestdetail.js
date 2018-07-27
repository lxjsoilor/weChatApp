// pages/my/requestdetail/requestdetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reqDetail:[],
    user_mobile:'',
  },
  relationAgent: function(){
    if (!!this.data.user_mobile){
      wx.makePhoneCall({
        phoneNumber: this.data.user_mobile //仅为示例，并非真实的电话号码
      });
    }else{
      // wx.showToast({
      //   title: '暂无可联系置业顾问',
      //   icon: 'none',
      //   duration: 2000
      // })
      app.model('暂无可联系置业顾问')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getReqDetail: function (options){
    app.ajax('',{
      label:'userRecoFangDetail',
      client_key: options.client_key
    },res => {
      // console.log(res)
      if(res.data.status == 1){
        this.setData({
          reqDetail:res.data.data,
          user_mobile: res.data.data.reco_list.user_mobile,
          isDataBack:true
        })
      }
    })
  },
  onLoad: function (options) {
    this.getReqDetail(options)
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
  
  }

})