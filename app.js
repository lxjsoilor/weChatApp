//app.js
const md5Fn = require('./utils/md5.js');
const amapFile = require('./utils/amap-wx.js');
App({
  onLaunch: function () {
    this.getAllSite();
    // 获取列表筛选数据
    this.getFilter();
    this.getRegion();
    console.log('小程序出生');
  },
  getSession3rd(callback){
    wx.login({
      success: res => {
        this.ajax(this.getBaseUrl().site_url, {
          label: 'wxLoginUser',
          appid: this.globalData.appid,
          secret: this.globalData.secretid,
          code:res.code
        },data=>{
          if (data.data.status == 1){
            wx.setStorageSync('session3rd', data.data.data.session3rd);
            wx.setStorageSync('openid', data.data.data.openid)
          }else{
            wx.setStorageSync('session3rd', '');
            wx.setStorageSync('openid', '')
          };
          if (typeof callback === 'function') {
            callback();
          };
        })
      }
    })
  },
  // 本地存储获取session3rdthis
  session3rd(){
    // return '0qux34OZz2K5k4y7cc5'
    return wx.getStorageSync('session3rd')
  },
  // 获取请求数据的地址
  getBaseUrl(){
    // 正式版
    // return wx.getStorageSync('location') || { site_name: '东莞', site_url: 'https://dg.huifang.cn/api/hfw', site_code:'441900'};
    // 测试版
    return wx.getStorageSync('location') || { site_name: '东莞', site_url: 'http://dongguan.huifang.cn/api/hfw', site_code: '441900' };
  },
  globalData: {
    appid:'wx201f6a939b1a5517',
    secretid:'9ff7bb9123d0c3aa369a8a8cfac0e971',
    url: 'https://dg.huifang.cn/api/hfw',
    locationList:[],
    iconObj: {
      coolAir: '空调',
      coolBox: '冰箱',
      bed: '床',
      television: '电视',
      broadband: '宽带',
      heating: '暖气',
      hotWater: '热水器',
      washing: '洗衣机',
      balcony:'阳台',
      closet:'衣柜',
      kitchen:'厨具',
      sofa:'沙发',
      toilet:'卫生间',
      lift:'电梯',
      elefan:'电风扇'
    },
    // 图片加载失败时候的显示背景
    defeatedImg: 'background: url("/assets/icon/null_img.jpg") no-repeat center center;background-size:cover;width:100%;'
  },
  // 返回上一页
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 页面跳转
  pageTab: function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  // 页面跳转不保留原来页面
  pageChange: function(e){
    wx.redirectTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 正则验证
  telCheck: function (num) {
    return /^1[3456789]\d{9}$/.test(parseInt(num));
  },
  // 验证姓名
  nameCheck: function(name){
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
      regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (regEn.test(name) || regCn.test(name)) {
      return true;
    }else{
      return false;
    }
  },
  nameSpace:function(name){
    var reg = /\s+/g;
    if(reg.test(name)){
      return true;
    }else{
      return false;
    }
  },

  // 判断数据是否为空
  judageData(data) {
    var judage;
    if (typeof data === 'number') {
      judage = true;
    } else if (typeof data === 'boolean') {
      judage = data;
    } else {
      if (data && data.length) {
        judage = true;
      } else {
        judage = false;
      }
    }
    return judage;
  },
  // ajax封装
  ajax:function(url,obj,successBack,loading){
    var _this = this;
    if (!loading) {
      _this.showToast();
    };
    wx.request({
      url: url || _this.getBaseUrl().site_url + '?session3rd=' + _this.session3rd(),
      data: obj,
      method: 'POST',
      dataType: 'json',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var resData = res.data;
        if (!loading) {
          _this.hideToast();
        };
        successBack(res);
        // if(res.data.status == 0){
        //   _this.model(res.data.msg)
        // }
      },
      fail: function (res) {
        _this.modal({
          text: '请求失败',
          showCancel: false
        });
        _this.hideToast();
        // console.log(res);
      }
    });
  },
  // 获取所有站点
  getAllSite(){
    wx.request({
      url: 'https://dg.huifang.cn/api/getAllSite',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: (res) => {
        wx.setStorageSync('locationList', res.data.data)
      }
    })
  },
  // 公共的数据请求
  // 热门请求
  hotSearch(callback){
    var tempCount = 0;
    var obj = {};
    obj.data = {};
    this.ajax(this.getBaseUrl().site_url,{
      label:'hotSearchEstate',
      type:1
    },(res => {
        obj.data.estate = res.data.data;
        tempCount++;
      // callback(res)
      if(tempCount == 3){
        callback(obj);
      }
    }));
    this.ajax(this.getBaseUrl().site_url, {
      label: 'hotSearchEstate',
      type:2
    }, (res => {
        obj.data.fang = res.data.data;
      tempCount++;
      // callback(res)
      if(tempCount == 3){
        callback(obj);
      }
    }));
    this.ajax(this.getBaseUrl().site_url, {
      label: 'hotSearchEstate',
      type: 3
    }, (res => {
        obj.data.rent = res.data.data;
      tempCount++;
      // callback(res)
      if(tempCount == 3){
        callback(obj);
      }
    }));
  },
  // 去除html标签
  delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
  },
  // 判断是否是空对象
  isNull(obj){
    return JSON.stringify(obj)=='{}'
  },
  // 根据关键字搜索
  keySearch(keyword,estateType,page,callback,isNew,_this){
    if(keyword.trim()==''){
      return;
    };
    if(isNew){
      this.ajax(this.getBaseUrl().site_url, {
        label: estateType,
        page: page,
        keyword: keyword.trim(), //去前后空格
      }, (res) => {

        if (_this.data.searchVal != keyword){
          callback(false)
        }else{
          callback(res)
        }
      })
    }else{
      this.ajax('', {
        label: estateType,
        page: page,
        house_keyword: keyword.trim(), //去前后空格
      }, (res) => {
        if (_this.data.searchVal != keyword) {
          callback(false)
        } else {
          callback(res)
        }
      },true)
    }
  },
  // 请求可以翻页的数据
  getList(page,data,callback){
    this.ajax(this.getBaseUrl().site_url,data,(res) => {
      callback(res)
    })
  },
  // 获取筛选数据
  getFilter(callback){
    this.ajax(this.getBaseUrl().site_url,{
      label:'publicLabelAndStandardData'
    },(res) => {
      if(res.data.status == 1){
        if (typeof callback === 'function') {
          callback(res);
        };
        // 解决部分安卓手机m²不显示问题
        res.data.data.estate_price.forEach(val=>{
          val.value = val.value.replace('m²','㎡');
        });
        this.globalData.filterData = res.data;
        // console.log(this.globalData.filterData, '------------');
      }
    },true)
  },
  getRegion(callback){
    this.ajax(this.getBaseUrl().site_url,{
      label:'publicRegionList'
    },(res) => {
      // console.log(res)
      if(res.data.status == 1){
        if (typeof callback === 'function') {
          callback(res);
        }
        this.globalData.regionData = res.data;
      }
    },true)
  },
  // 获取验证码
  getCode(phoneNum,judge,successBack,failBack){
    if(phoneNum == ''){
      this.model('请输入手机号码');
      return;
    }
    var tempArr = new Date().toDateString().toUpperCase().split(' ').reverse();
    tempArr.splice(-1, 1);
    var timeStr = tempArr.join('');
    if (this.telCheck(phoneNum)) {
      //禁用按钮
      judge();
      var md5Str = phoneNum + timeStr + 'YQHUIFANG';
      md5Str = md5Fn.hex_md5(md5Str);
      this.ajax('https://dg.huifang.cn/api/publicSmsCode_Wx', {
        user_mobile: phoneNum,
        sms_key: md5Str
      }, (res) => {
        if (res.data.status == 1) {
          successBack(res)
        } else {
          failBack(res);
        }
      })
    } else {
      this.model('手机号码格式不正确');
    }
  },
  // 收藏取消收藏
  tabCollect(id,resid,fanType,_this){
    var obj = {
      label: 'userAddCollection'
    };
    obj.id = resid;
    obj.type = fanType;
    var collectPop = {};
    this.ajax('',obj,(res) => {
      if(res.data.status == 1){
        wx.showToast({
          title: '收藏成功',
          image: '/assets/icon/collected@2X.png',
          duration: 2000
        });
        collectPop = {
          img: '/assets/icon/collected@2X.png',
          text: '收藏成功',
          btnText: '已收藏',
          temp: true
        };
        _this.setData({
          collectPop: collectPop
        })
        
      }else if(res.data.status == 2){
        wx.showToast({
          title: '取消收藏',
          image: '/assets/icon/nocollect@2X.png',
          duration: 2000
        });
        collectPop = {
          img: '/assets/icon/nocollect@2X.png',
          text: '取消收藏',
          btnText: '收藏',
          temp: true
        };
        _this.setData({
          collectPop: collectPop
        })
      }else {
        // this.model(res.data.msg)
        if(res.data.is_login == 0){
          wx.showModal({
            title: '提示',
            content: '您未绑定手机',
            confirmText:'去绑定',
            confirmColor:'#fd7801',
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定');
                wx.navigateTo({
                  url: '/pages/bindphone/bindphone?newpop=1'
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          this.model(res.data.msg)
        }
      };
      
    })
  },
  // 预约看房
  orderHouse(name, phoneNum, estate_id, fang_type, region_id, callback, fang_client_id){
    if(name == ''){
      this.model('姓名不能为空')
      return;
    } else if (this.nameCheck(name)){
      this.model('姓名不能包含特殊符号')
      return;
    } else if (this.nameSpace(name)){
      this.model('姓名不能包含空格符')
      return;
    } else if (!this.telCheck(phoneNum)){
      this.model('手机号码格式不正确');
      return;
    }
    // if(this.telCheck(phoneNum)){
      var obj = {};
      obj.label = 'userAddAppointment';
      obj.client_name = name;
      obj.client_mobile = phoneNum;
      obj.estate_id = estate_id;
      obj.fang_type = fang_type;
      obj.region_id = region_id;
      if(fang_type != 1){
        obj.fang_client_id = fang_client_id;
      };
      // console.log(obj);
      this.ajax('', obj, (res) => {
        callback(res);
      })
    // }else{
    //   this.model('手机格式错误')
    // }
    
  },
  reportHouse(fang_key){
    this.model('确认要举报该房源吗？',true,(res) => {
      if (res.confirm) {
        this.ajax('', {
          label: 'fangReport',
          fang_key: fang_key
        }, (res) => {
          if (res.data.status == 1) {
            wx.showToast({
              title: '举报成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            this.model(res.data.msg)
          }
        })
      }
    })
  },
  // 去地区名重复
  removeDup(str, len) {
    // return str;
    var tempStr = str.substr(0, len);
    var tempStr2 = str.substr(len, str.length - 1);
    var tempArr = tempStr2.split(tempStr);
    if(tempArr.length >= 2) {
      if (tempArr.length == 2) {
        return tempStr2;
      };
      if (tempArr.length > 2) {
        return this.removeDup(tempStr2, len);
      };
    } else {
      if(len>2) {
        return this.removeDup(str, len - 1);
      }else{
        return str
      }
    }
  },
  // 判断是否需要阅读更多
  readMore(str,len){
    var leng = len || 60;
    if(str.length<=leng){
      return 0;
    }else{
      str = str.substr(0,leng) + '...';
      return str
    }
  },
  //点击搜索跳转对应的详情页面
  searchToDetail(e, fanType, searchHistoryData,callback){
    var url = '';
    if (fanType == 1) {
      url = `/pages/newhouse/detail/detail?estate_id=${e.currentTarget.dataset.eid}&estate_key=${e.currentTarget.dataset.estatekey}`
      this.saveHistory(e, 'newHouse',searchHistoryData ,callback);
    } else if (fanType == 2) {
      this.saveHistory(e, 'secondHouse',searchHistoryData ,callback);
      // url = `/pages/secondhouse/detailhouse/detailhouse?fang_key=${e.currentTarget.dataset.fankey}`
      url = `/pages/secondhouse/index/index?estate_id=${e.currentTarget.dataset.eid}`
    } else if (fanType == 3) {
      this.saveHistory(e, 'rentHouse',searchHistoryData ,callback);
      // url = `/pages/renthouse/detail/detail?fang_key=${e.currentTarget.dataset.fankey}`
      url = `/pages/renthouse/index/index?estate_id=${e.currentTarget.dataset.eid}`
    };
    wx.navigateTo({
      url: url
    })
  },
  // 保存搜索记录到本地储存
  saveHistory(e, path, searchHistoryData,callback){
    var name = e.currentTarget.dataset.estate.join('');
    var address = e.currentTarget.dataset.region_name;
    if (!!e.currentTarget.dataset.fankey) {
      var eid = e.currentTarget.dataset.fankey;
    } else {
      var eid = e.currentTarget.dataset.eid;
    };
    var tempObj = searchHistoryData;
    tempObj[path].forEach((val, i) => {
      if (val.eid == eid) {
        tempObj[path].splice(i, 1);
      }
    });
    tempObj[path].unshift({
      name: name,
      address: address,
      eid: eid
    });
    wx.setStorageSync('searchHistory', tempObj);
    callback();
  },
  // 清空搜索记录
  emptyHistory(fanType,callback){
    var tempObj = wx.getStorageSync('searchHistory');
    if(!tempObj){return;};
    if (fanType == 1 && tempObj.newHouse.length == 0){
      return;
    } else if (fanType == 2 && tempObj.secondHouse.length == 0){
      return;
    } else if (fanType == 3 && tempObj.rentHouse.length == 0){
      return;
    }
    this.model('确认清空搜索记录',true,(res)=>{
      if (res.confirm) {
        var tempObj = wx.getStorageSync('searchHistory');
        if (fanType == 1) {
          tempObj.newHouse = [];
        } else if (fanType == 2) {
          tempObj.secondHouse = [];
        } else if (fanType == 3) {
          tempObj.rentHouse = [];
        }
        callback(tempObj);
        wx.setStorageSync('searchHistory', tempObj);
      }
    })
  },
  // 获取高德地图图片
  getMapImg(lat,lon,callback){
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: "e5bff2f3ff7316f473075eee7e990e2c" });
    wx.getSystemInfo({
      success: function () {
        myAmapFun.getStaticmap({
          location: lon+','+lat,
          zoom: 12,
          size: '200*140',
          scale: 2,
          markers: `mid,0xFF0000,A:${lon},${lat}`,
          success: function (data) {
            callback(data)
          },
          fail: function (info) {
            wx.showModal({ title: info.errMsg })
          }
        })
      }
    })
  },
  // 获取高德地图周边信息
  getMapPoiData(lat,lon,keyWordArr,callback){
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: 'e5bff2f3ff7316f473075eee7e990e2c' });
    var tempObj = {};
    var tempIndex = 0;
    keyWordArr.forEach((val,i)=>{
      myAmapFun.getPoiAround({
        location: lon + ',' + lat,
        querykeywords: val,
        success: function (data) {
          //成功回调
          val = val == '公园' ? "其他" : val;
          tempObj[val] = data;
          tempIndex +=1;
          if(tempIndex >= 5){
            callback(tempObj)
          }
        },
        fail: function (info) {
          //失败回调
          console.log(info)
        }
      })
    });
  },
  // 获取定位周边信息 
  getAroundInfo(lat,lon,callback){
    wx.request({
      url: `https://cloud.huifang.cn/map/getAround?lat=${lat}&lon=${lon}`,
      success: function (res) {
        if (res.data.status) {
          callback(res)
        }
      }
    });
  },
  // 我的委托、我的预约删除
  deleteRecoFang(e,_this,str){
    str = str || '房源';
    this.model(`确定删除该${str}?`,true,res=>{
      this.ajax('', {
        label: 'userDelRecoFang',
        client_id: e.currentTarget.dataset.id
      }, (res) => {
        // console.log(res)
        if (res.data.status == 1){
          var tempArr = _this.data.list;
          tempArr.splice(e.currentTarget.dataset.index, 1);
          if (tempArr.length <= 0) {
            _this.setData({
              isNoData: true
            })
          }
          _this.setData({
            list: tempArr
          })
        }
      })
    })
  },
  // 存储浏览记录到本地存储
  saveBrowseHistory(fanType,fanId){
    var tempObj = {};
    tempObj.fanType = fanType;
    tempObj.fanId = fanId;
    var tempAll = wx.getStorageSync('browseHistory') || {};
    var tempArr = tempAll[this.getBaseUrl().site_code] || []
    // 判断有没有重复
    var index = tempArr.findIndex((val) => {
      return ( val.fanType == fanType && val.fanId == fanId ); 
    });
    if(index >=0 ){
      tempArr.splice(index,1);
    };
    tempArr.unshift(tempObj);
    tempAll[this.getBaseUrl().site_code] = tempArr;
    wx.setStorageSync('browseHistory', tempAll);
  },
  // 左滑删除封装
  touchS(_this,e){
    if (e.touches.length == 1) {
      _this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM(_this,e){
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = _this.data.startX - moveX;
      var delBtnWidth = _this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      var index = e.currentTarget.dataset.index;
      var list = _this.data.list;
      list[index].txtStyle = txtStyle;
      _this.setData({
        list: list
      });
    }
  },
  touchE(_this,e){
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = _this.data.startX - endX;
      var delBtnWidth = _this.data.delBtnWidth;
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = _this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      _this.setData({
        list: list
      });
    }
  },
  // 去除搜索列表重复楼盘封装
  uniqueArr(arr){
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i].estate_id == arr[j].estate_id) {
          arr.splice(j, 1);//console.log(arr[j]);
          j--;
        }
      }
    }
    return arr;
  },

  //loading转圈圈 显示
  showToast(text) {
    var _this = this;
    var textNow = '';
    if (_this.judageData(text)) {
      textNow = text
    } else {
      textNow = '加载中...';
    }
    wx.showToast({
      title: textNow,
      icon: 'loading',
      mask:true,
      duration: 10000//loading转转显示10秒钟
    });
  },
  //loading转圈圈 隐藏
  hideToast() {
    wx.hideToast();
  },
  toastAuto(a) {
    wx.showToast({
      title: a,
      icon: 'success'
    });
  },
  model(content, showCancel, succedBack,errorBack){
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: !!showCancel,
      confirmColor: '#fd7801',
      success: function (res) {
        if (res.confirm) {
          if (typeof succedBack === 'function') {
            succedBack(res);
          }
        } else if (res.cancel) {
          if (typeof errorBack === 'function') {
            errorBack(res);
          }
        }
      }
    })
  }
})