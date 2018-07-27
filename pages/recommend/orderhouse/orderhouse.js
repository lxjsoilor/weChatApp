// pages/newhouse/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 性别选择
    genderItme: [true,false],
    // 是否可以发送亲切
    canPostBool:true

  },
  getDetail:function(){
    setTimeout(() => {
      this.setData({
        isDataBack: true
      })
    }, 1000)
  },
  inputName: function(e) {
    this.setData({
      namePost: e.detail.value
    });
    this.canPost();
  },
  inputPhone: function (e) {
    this.setData({
      phoneNum: e.detail.value
    });
    this.canPost();
  },
  canPost: function () {
    if (app.telCheck(this.data.phoneNum) && this.data.namePost != '') {
      console.log(900)
      this.setData({
        canPostBool: false
      })
    } else {
      this.setData({
        canPostBool: true
      })
    }
  },
  // 预约提交
  orderBtn: function(){ 
    // console.log(90);
    if (this.data.namePost == '') {
      app.model('姓名不能为空')
      return;
    } else if (app.nameCheck(this.data.namePost)) {
      app.model('姓名不能包含特殊符号')
      return;
    } else if (app.nameSpace(this.data.namePost)) {
      app.model('姓名不能包含空格符')
      return;
    } else if (!app.telCheck(this.data.phoneNum)) {
      app.model('手机号码格式不正确');
      return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      estate_key: options.estate_key
    });
    // 获取托管人列表
    app.ajax('',{
      label: 'XcxTuoGuanUser',
      appid: app.globalData.appid,
      estate_id: 4959
    },(result) => {
      console.log(result)
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