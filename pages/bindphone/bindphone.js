// pages/bindphone/bindphone.js
const app = getApp()
const md5Fn = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: '',
    codeNum: '',
    unbind: '',
    unbindBool: true,
    timer: 60,
    disabled: false,
    codeText: '获取验证码',
    interval: null,
    focus: true,
    putAgain: true,
    newpop: ''

  },
  inputPhone: function (e) {
    // console.log(e);
    this.setData({
      phoneNum: e.detail.value
    });
    this.canPost();
  },
  inputCode: function (e) {
    this.setData({
      codeNum: e.detail.value
    });
    this.canPost();
  },
  canPost: function () {
    if (app.telCheck(this.data.phoneNum) && this.data.codeNum != '') {
      this.setData({
        unbind: 'unbind',
        unbindBool: false
      })
    } else {
      this.setData({
        unbind: '',
        unbindBool: true
      })
    }
  },
  // 跳过绑定手机号
  pageChange: function (e) {
    wx.switchTab({
      url: '/pages/home/index/index'
    })
  },
  // 获取验证码
  getCode: function () {
    app.getCode(this.data.phoneNum, () => {
      this.setData({
        disabled: true
      });
    }, (res) => {
      wx.showToast({
        title: '验证码已发送',
        icon: 'success',
        duration: 2000
      });
      //设置倒计时
      this.data.interval = setInterval(() => {
        this.setTime()
      }, 1000)
    }, (res) => {
      wx.showToast({
        title: '获取失败',
        image: '/assets/icon/预约失败@2X.png',
        duration: 2000
      });
      this.setData({
        disabled: false
      });
    })
  },
  // 验证码倒计时
  setTime: function () {
    if (this.data.timer <= 0) {
      clearInterval(this.data.interval);
      this.setData({
        codeText: '获取验证码',
        disabled: false,
        timer: 60
      })
    } else {
      var text = `重新获取(${this.data.timer--})`
      this.setData({
        codeText: text,
        disabled: true,
        timer: this.data.timer--,
      })
    }
  },
  bindPhone: function (e) {
    console.log(e);
    if (e.detail.errMsg == 'getUserInfo:ok') {
      // 用户确定授权-开始绑定手机
      wx.login({
        success: data => {
          var info = e.detail;
          console.log(info);
          // app.globalData.userInfo = info.userInfo;
          app.ajax('', {
            label: 'wxBindUser',
            user_mobile: this.data.phoneNum,
            mobile_code: this.data.codeNum,
            appid: app.globalData.appid,
            secret: app.globalData.secretid,
            code: data.code,
            signature: info.signature,
            rawData: info.rawData,
            encryptedData: info.encryptedData,
            iv: info.iv
          }, (res) => {
            if (res.data.status == 1) {
              wx.setStorageSync('session3rd', res.data.data.session3rd);
              wx.setStorageSync('openid', res.data.data.openid);
              wx.showToast({
                title: '绑定成功',
                icon: 'success',
                duration: 2000
              });
              wx.switchTab({
                url: '/pages/home/index/index'
              })
            } else {
              app.model(res.data.msg, '', data => {
                if (res.data.msg == '已经绑定过啦') {
                  if (this.data.newpop == 1) {
                    app.getSession3rd(res => {
                      wx.navigateBack({
                        delta: 1
                      });
                    });
                  } else {
                    app.getSession3rd(res => {
                      wx.switchTab({
                        url: '/pages/home/index/index'
                      })
                    });
                  }
                }
              })
            };
          })
        }
      })
    } else {
      app.model('您拒绝了微信授权，将无法绑定手机');
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.newpop == 1) {
      this.setData({
        newpop: 1
      })
    } else {
      app.model('请先绑定手机号', '', res => {
        this.setData({
          focus: true
        })
      })
    };
    wx.setStorageSync('isFirstLoadApp', '2');
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

})