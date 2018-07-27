// pages/sellhouse/sell/sell.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRent:false,
    showSearch:false,
    showType: true,
    showHX: true,
    fanType: -1,
    fanHX: [-1,-1,-1],
    tempFanType: -1,
    tempFanHX: [-1, -1, -1],
    typeText:'',
    HXText:'',
    searchList:[],
    searchVal:'',
    noSearch:true,
    formData:{},
    estateName:'',
    estateId:'',
    regionId:'',
    fanArea:'',
    sellPrice:'',
    rentPrice:'',
    phoneNum:'',
    phoneCode:'',
    canEntrust:true,
    codeText: '获取验证码',
    disabled:false,
    interval: null,
    timer:60,
    HXSelect:[new Array(9),new Array(10),new Array(10)],
    canEntrustAgain:true,
    searchMore:true
  },
  sellTab:function(){
    this.setData({
      isRent:false
    });
    this.canReport();
  },
  rentTab:function(){
    this.setData({
      isRent:true
    });
    this.canReport();
  },
  toSearch:function(e){
    // this.setData({
    //   showSearch:true,
    //   searchFocus:true
    // })
    app.pageTab(e)
  },
  cancelSearch:function(){
    this.setData({
      showSearch:false
    })
  },
  toShowType:function(){
    this.setData({
      showType:false
    })
  },
  toShowHX: function () {
    this.setData({
      showHX: false
    })
  },
  cancelBottom: function(){
    var tempTypeArr = this.data.tempFanType;
    var tempHXArr = this.data.tempFanHX; 
    this.setData({
      showHX: true,
      showType: true,
      fanType: tempTypeArr,
      fanHX: tempHXArr
    })
  },
  // 房屋类型选额
  selectType:function(e){
    this.setData({
      fanType: e.currentTarget.dataset.type
    })
  },
  selectHX:function(e){
    // console.log(e.currentTarget);
    var index = e.currentTarget.dataset.index;
    var hx = e.currentTarget.dataset.hx;
    var tempArr = this.data.fanHX;
    tempArr[index] = hx;
    this.setData({
      fanHX: tempArr
    });
    
  },
  selectTypeSure:function(){
    var index = this.data.fanType;
    if(index != -1){
      if(index == 1){
        this.setData({
          typeText:'住宅'
        })
      }else if(index == 2){
        this.setData({
          typeText: '商铺'
        })
      }else if(index == 3){
        this.setData({
          typeText: '写字楼'
        })
      }else if(index == 4){
        this.setData({
          typeText: '别墅'
        })
      };
      this.setData({
        tempFanType:index
      });
      // 判断提交按钮是否可用
      this.canReport();
      
    }else{
      app.model('请选择您的房源类型')
    };
    this.setData({
      showType: true
    })
  },
  selectHXSure:function(){
    var i = this.data.fanHX.findIndex(val => {
      return val == -1
    });
    if(i == -1){
      var text = this.data.fanHX[0] + '室 ' + this.data.fanHX[1] + '厅 ' + this.data.fanHX[2] + '卫';
      this.setData({
        HXText: text,
        tempFanHX: this.data.fanHX
      });
      // 判断提交按钮是否可用
      this.canReport();
    }else {
      app.model('请将户型资料填完整')
    };
    this.setData({
      showHX: true
    })
  },
  // 立即委托
  requestBtn:function(e){
    // 防止用户重复点击
    if (!this.data.canEntrustAgain){
      return;
    }
    this.setData({
      canEntrustAgain:false
    })
    var obj = {};
    var data = this.data;
    obj.fang_sale = data.fanType;
    obj.estate_id = data.estateId;
    obj.fang_area = data.fanArea;
    obj.fang_type = data.isRent?'3':'2';
    obj.fang_housetype = data.fanHX.join('-');
    obj.fang_price = data.isRent?data.rentPrice:data.sellPrice;
    obj.client_mobile = data.phoneNum;
    obj.code = data.phoneCode;
    obj.region_id = data.regionId;
    obj.label = 'userSellFang';
    app.ajax('',obj,(res) => {
      this.setData({
        canEntrustAgain: true
      })
      if(res.data.status == 1){
        wx.setStorageSync('checkRestate', '');
        // 重置所有的信息
        this.setData({
          estateName:'',
          fanArea:'',
          typeText:'',
          HXText:'',
          sellPrice:'',
          rentPrice:'',
          phoneNum:'',
          phoneCode:'',
          timer:0,
          fanType: -1,
          fanHX: [-1, -1, -1],
          tempFanType: -1,
          tempFanHX: [-1, -1, -1],
        });
        this.canReport();
        app.pageTab(e)
      }else {
        app.model(res.data.msg)
      }
    })
  },
  // 判断委托按钮是否需要高亮
  returnFalse:function(){
    return false;
  },
  canReport:function(){
    var data = this.data;
    var name = data.estateName != '';
    var area = data.fanArea != '';
    var mold = data.fanType != -1;
    var Hx = data.fanHX.findIndex(val => { return parseInt(val) == -1 }) == -1;
    var sellP = data.sellPrice != '';
    var rentP = data.rentPrice != '';
    // var phoneN = data.phoneNum != '';
    var phoneN = app.telCheck(data.phoneNum);
    var code = data.phoneCode != '';
    // console.log(name, area, mold,Hx,sellP,rentP,phoneN,code);
    if(name && area && mold && Hx && phoneN && code){
      if (this.data.isRent && rentP){
        this.setData({
          canEntrust:false
        });
      } else if (!this.data.isRent && sellP){
        this.setData({
          canEntrust: false
        });
      }else{
        this.setData({
          canEntrust: true
        });
      }
    }else {
      this.setData({
        canEntrust: true
      });
    }
  },
  // 搜索小区
  searchEstate:function(e){
    this.setData({
      searchVal:e.detail.value.trim(),
      noSearch:true,
      searchList:[],
      searchMore:false
    });
    if (e.detail.value.trim() == '') { 
      this.setData({
        searchMore: true
      })
      return; 
    };
    var keyWord = e.detail.value.trim();
    app.keySearch(keyWord,'estateListByName','',(res) => {
      if(!res){ return;};
      // console.log(res);
      // console.log(res.data.data)
      if(!!res.data.data){
        if (res.data.status == 1) {
          res.data.data.forEach((val) => {
            var tempArr = val.estate_name.split(keyWord);
            tempArr = tempArr.join(`|${keyWord}|`).split('|');
            val.estate_name = tempArr;
          });
          // console.log(this.data.searchVal)
          if (this.data.searchVal.trim() == '') {
            return;
          };
          this.setData({
            searchList: res.data.data,
            noSearch: false,
            hasMore: false
          })
        } else {
          this.setData({
            noSearch: false,
            hasMore: true
          })
        }
      }else{
        this.setData({
          noSearch: false,
          hasMore: true
        })
      }
    },true,this)
  },
  emptySearch:function(){
    this.setData({
      searchVal:'',
      searchList:[],
      noSearch:true,
      searchMore:true
    })
  },
  // 地区选择
  selectEstate:function(e){
    this.setData({
      estateId: e.currentTarget.dataset.id,
      estateName: e.currentTarget.dataset.name.join(''),
      regionId: e.currentTarget.dataset.rid,
      showSearch: false
    });

    // 判断提交按钮是否可用
    this.canReport();
  },
  // 获取面积
  selectArea:function(e){
    this.setData({
      fanArea:e.detail.value
    });
    // 判断提交按钮是否可用
    this.canReport();
  },
  // 获取价格
  selectSellPrice:function(e){
    this.setData({
      sellPrice:e.detail.value
    });
    // 判断提交按钮是否可用
    this.canReport();
  },
  selectRentPrice:function(e){
    this.setData({
      rentPrice: e.detail.value
    });
    // 判断提交按钮是否可用
    this.canReport();
  },
  // 获取电话号码
  selectPhone:function(e){
    this.setData({
      phoneNum: e.detail.value
    });
    // 判断提交按钮是否可用
    this.canReport();
  },
  // 获取验证码
  selectCode:function(e){
    this.setData({
      phoneCode:e.detail.value
    });
    // 判断提交按钮是否可用
    this.canReport();
  },
  getCode:function(){
    if(this.data.disabled){return;};
    app.getCode(this.data.phoneNum,() => {
      this.setData({
        disabled: true
      });
    },(res) => {
      wx.showToast({
        title: '验证码已发送',
        icon: 'success',
        duration: 2000
      });
      //设置倒计时
      this.data.interval = setInterval(() => {
        this.setTime()
      }, 1000)
    },(res) => {
      wx.showToast({
        title: '获取失败',
        image: '/assets/icon/order_error@2X.png',
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
  // 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是已经绑定
    
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
    var siteName = wx.getStorageSync('location').site_name || '东莞';
    this.setData({
      siteName: siteName
    });

    // console.log(wx.getStorageSync('checkRestate'))
    // 判断是否有进行小区选择
    if (!!wx.getStorageSync('checkRestate')){
      this.setData(wx.getStorageSync('checkRestate'));
    }else{
      this.setData({
        estateId: '',
        estateName: '',
        regionId: '',
      });
    };
    this.canReport();
    if (!app.session3rd()) {
      wx.switchTab({
        url: '/pages/home/index/index',
        success:(res)=>{
          wx.navigateTo({
            url: '/pages/bindphone/bindphone'
          });
        }
      });
    }
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