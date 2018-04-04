// pages/rank/rank.js
var app = getApp()
var req = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    channel: [{ name: "周总排行榜", id: "r0", checked: "true" }, { name: "我的PK排行榜", id: "r1" }],
    currentPage: "r0",
    myCalcPow: 0,

    emptyText: "还没测试过你的算力",
    emptyBtn: "立即开始一局",  //立即PK好友
    listArr: [],
    globalRank:[],
    roomRank:[],
    userRank:null,
    windowH: null,
    windowW: null,
    userInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '排行榜',
    })
    var me = this
    try {
      var res = wx.getSystemInfoSync()
      me.setData({
        windowH: (res.windowHeight - 150),
        windowW: (res.windowWidth)
      })
    } catch (e) {
      wx.getSystemInfo({
        success: function (res) {
          me.setData({
            windowH: (res.windowHeight - 150),
            windowW: (res.windowWidth)
          })
        },
      })
    }
    me.setData({
      myCalcPow: options.total,
      roomId: options.room_id,
    })
    me.data.userInfo = app.globalData.userInfo
    this.getList()

  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
        req.share(app.globalData.userid)
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  },

  //tab切换
  tabClick: function (e) {
    var me = this;
    var v = e.detail.value
    var arr=null
    if (v == me.data.channel[0].id){
      arr = me.data.globalRank
    }else{
      arr = me.data.roomRank
    }
    me.setData({
      currentPage: v,
      listArr:arr
    })
  },

  //点击按钮
  clickBtn: function (e) {
    var me=this
    var  id = e.target.id
    if (id == 'again' || (id == 'empty' && me.data.myCalcPow <= 0)){
    wx.redirectTo({ 
      url: '../count/count?grade=挑战模式&room_id=' + me.data.roomId + '&user=' + JSON.stringify(me.data.userInfo) 
      });
    }
  },

  getList: function () {
    wx.showToast({
      title: '数据加载中...',
      icon:'loading',
    })
    var me = this

    // var p = app.globalData.userInfo
    // let arr = new Array()
    // for (var i = 0; i < 20; i++) {
    //   let name = (i % 3 == 0 ? "无敌的寂寞" :"无敌的寂寞寂寞寂寞是谁的错我你她")
    //   var temp = {
    //   score : 10000 + i,
    //   ind : i + 1,
    //   nick_name:name,
    //   avatar_url:"../../images/avatar_default.png",
    //   showLevel: me.data.myCalcPow < 100+i-5,
    //   }
    //   arr.push(temp)
    // }

    var d = {
      room_id: me.data.roomId,
      openid: app.globalData.userid
    }

    /**
     * 
     * {
     * global_rank:[{avatar_url:"",nick_name:"",score:0,openid:""}],
     * room_rank:[{}],
     * user_rank:{global_rank:4,rank_percent:0.333,room_rank:0}
     * }
     * 
     **/   
    req.getRank(d,
      function (s) {
        wx.hideToast()
        var globalRank = s.global_rank
        var roomRank = s.room_rank
        var userRank = s.user_rank
        for(let i =0 ;i < globalRank.length; i++){
            globalRank[i].ind=(i+1)
        }
        for (let j = 0; j < roomRank.length; j++) {
          let r = roomRank[j]
          // if(r.openid == app.globalData.userid){
          //   roomRank.splice(j,1)
          //   j--
          // }else{
            roomRank[j].ind = (j + 1)
          // }
        }
        me.setData({
          listArr: globalRank,
          globalRank:globalRank,
          roomRank:roomRank,
          userRank: userRank
        })
      },
      function (e) {
        wx.hideToast()
        wx.showToast({
          title: '加载失败',
          duration: 1500,
          icon: 'fail'
        })
        // me.setData({
        //   listArr: arr
        // })
      }
    )
  }

})