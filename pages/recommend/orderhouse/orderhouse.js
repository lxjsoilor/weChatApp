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
    canPostBool:true,
    hasAgent:true,
    namePostFlag:false

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
      this.setData({
        canPostBool: false
      })
    } else {
      this.setData({
        canPostBool: true
      })
    }
  },
  radioChange:function(res){
    
  },
  // 预约提交
  orderBtn: function(){ 
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
    };
    // 推荐客户给经纪人
    var genderItmeIndex = this.data.genderItme.findIndex((val)=>{
      return val;
    })
    // 如果有托管人就推荐给托管人
    if(!this.data.hasAgent){
      app.ajax('', {
        label: 'XcxFollow1118',
        project_key: this.data.projectKey,
        agent_id: this.data.agentId,
        client_name: this.data.namePost,
        client_sex: genderItmeIndex+1,
        client_mobile: this.data.phoneNum
      }, (res) => {
        if (res.data.msg == '推荐成功') {
          wx.showToast({
            title: '预约成功',
            icon: 'success',
            duration: 2000
          });
          this.emptyData();
          this.canPost();
        }else{
          app.model(res.data.msg)
        }
      })
    }else{
      // 没有托管人就推荐给银行
      app.ajax('',{
        label: ' XcxFollow1119',
        project_key: this.data.projectKey,
        client_name: this.data.namePost,
        client_mobile: this.data.phoneNum,
        client_sex: genderItmeIndex + 1,
      },(result) => {
        if (result.data.msg == '推荐成功'){
          wx.showToast({
            title: '预约成功',
            icon: 'success',
            duration: 2000
          });
          this.emptyData();
          this.canPost();
        }else{
          app.model(result.data.msg)
        }
      })
    }
  },
  // 清空数据函数
  emptyData: function(){
    this.setData({
      namePost:'',
      phoneNum:'',
      genderItme: [true, false],
    });
    app.goBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      projectKey: options.project_key
    })
    // 获取托管人列表
    app.ajax('',{
      label: 'XcxTuoGuanUser',
      // appid: app.globalData.appid,
      estate_id: options.estate_id
    },(result) => {
      if(result.data.msg == '请求成功'){
        this.setData({
          agentRole: result.data.data.user_role,
          agentName: result.data.data.user_name,
          agentPhone: result.data.data.user_mobile,
          agentAtv: result.data.data.upload_url,
          agentId: result.data.data.user_id,
          hasAgent: false,
        })
      };
      setTimeout(() => {
        this.setData({
          namePostFlag: true
        });
      }, 100)
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