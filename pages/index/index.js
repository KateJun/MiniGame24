
var app = getApp()
var dian24 = require('../../utils/24dian.js');
var req = require("../../utils/request.js")
Page({
  data: {
    specification: '选择模式后，点击数字及运算符；\n输入计算表达式。将给出的牌数用尽并得出24即为一局完成。',
    userInfo: null,//{ avatarUrl:"../../images/avatar_default.png"},
    gradeArr: [{ name: '挑战模式', value: '../../images/button_tiaozhan.png' }, { name: '无尽模式', value: '../../images/button_wujin.png' }, { name: '排行榜', value: '../../images/button_rank.png'  }],
    grade: '挑战模式',
    roomId: 1,
  },

  onLoad: function () {
    var that = this;
    // dian24.valid(1,2,3,4);

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      if (userInfo.avatarUrl == null || userInfo.avatarUrl.length == 0) {
        userInfo.avatarUrl = "../../images/avatar_default.png"
      }
      console.log("index user call back",userInfo)
      that.setData({
        userInfo: userInfo
      })

    }, function (openid, session) {
      that.getRoom()
    }) 
    // wx.getStorage({
    //   key: 'lastScore',
    //   success: function (res) {
    //     that.setData({
    //       lastScore: res.data
    //     })
    //   },fail(){
    //     that.setData({
    //       lastScore:0
    //     })
    //   }
    // }) 

  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.getDefaultScore()
  },

  getDefaultScore(){
    var that = this
    try {
      var lastS = wx.getStorageSync("lastScore")
      if (lastS =='') {
        lastS = 0
      }
    } catch (e) {
      lastS = 0
    }
    that.data.lastScore= Number(lastS)
  },


  onReady() {
    this.getRoom()
  },



  getRoom() {
    var me = this
    var openid = app.globalData.userid
    var session = app.globalData.session
    if (openid == '' || session == '' || typeof (openid) == "undefined" || typeof (session) == "undefined" || openid == '0' || session == '0' || openid.length == 0 || session.length == 0) {
      return
    }
    var data = {
      openid: openid,
      session_code: session
    }
    console.log("room",data)
    req.roomById(
      data,
      function (s) {
        me.setData({
          roomId: s.room_id
        })
      }, function (e) {

      })
  },


  radioChange: function (e) {
    this.setData({
      grade: e.detail.value
    })
  },
  //计算页
  gotoCount: function (e) {
    var dataId = e.currentTarget.id;
    console.log(dataId);
    var me = this;
    switch (dataId) {
      case '排行榜'://排行榜
        console.log();
        wx.navigateTo({ url: '../rank/rank?room_id=' + me.data.roomId + "&total=" + me.data.lastScore });
        break;
      case '挑战模式': //挑战模式
      case '无尽模式'://无尽模式
        wx.navigateTo({ url: '../count/count?grade=' + dataId + '&room_id=' + me.data.roomId + '&user=' + JSON.stringify(me.data.userInfo) });// "&total=" + me.data.lastScore +
        break;
      default:
        break;
    }

  },

  onShareAppMessage(){
    return {
      path: '/pages/index/index' ,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  }

})
