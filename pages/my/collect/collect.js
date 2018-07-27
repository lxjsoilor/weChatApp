// pages/my/collect/collect.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lit:[],
    delBtnWidth: 80
  },
  pageTab:function(e){
    // console.log(e);
    if (!e.currentTarget.dataset.status){
      var url = '';
      if (e.currentTarget.dataset.type == 1) {
        url = `/pages/newhouse/detail/detail?estate_key=${e.currentTarget.dataset.estatekey}&estate_id=${e.currentTarget.dataset.estateid}`
      } else if (e.currentTarget.dataset.type == 3) {
        url = `/pages/secondhouse/detailhouse/detailhouse?fang_key=${e.currentTarget.dataset.estatekey}`
      } else {
        url = `/pages/renthouse/detail/detail?fang_key=${e.currentTarget.dataset.estatekey}`
      }
      wx.navigateTo({
        url: url
      });
    }else{
      app.model('该房源已下线')
    }
    
  },
  // 获取我的收藏列表
  getList(){
    app.ajax('',{
      label:'userListCollect'
    },(res) => {
      if(!!res.data.data){
        // 去地区名重复
        res.data.data.forEach(val=>{
          val.address = app.removeDup(val.address, 4)
        })
        this.setData({
          list:res.data.data,
          isNoData: false,
          isDataBack: true
        })
      }else {
        this.setData({
          isNoData:true,
          isDataBack: true
        })
        // app.model(res.data.msg)
      }
    })

  },
  // 我的收藏删除
  deleteThis:function(e){
    app.model('确定删除该收藏?',true,()=>{
      var obj = {};
      obj.label = 'userAddCollection';
      obj.id = e.currentTarget.dataset.id;
      obj.type = e.currentTarget.dataset.type;
      app.ajax('', obj, (res) => {
        if (res.data.status == 2) {
          var tempArr = this.data.list;
          tempArr.splice(e.currentTarget.dataset.index, 1);
          if(tempArr.length<=0){
            this.setData({
              isNoData: true
            })
          }
          this.setData({
            list: tempArr
          })
        } else {
        }
      })
    })
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList()
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