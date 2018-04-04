// pages/reqhelp/reqhelp.js
var app = getApp()
var dian24 = require("../../utils/24dian.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,//帮助的朋友信息
    myInfo: null,//我的个人信息
    dataBean: null,
    exp: '',//表达式
    expArr: [],//依次选择的字符
    numbers: [],
    disabled: [false, false, false, false],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this
    //从分享进来需授权获取个人信息
    app.getUserInfo(function (myInfo) {
      if (myInfo.avatarUrl == null || myInfo.avatarUrl.length == 0) {
        myInfo.avatarUrl = "../../images/avatar_default.png"
      }
      me.setData({
        myInfo: myInfo
      })
    })
    // 获取好友求帮题目
    var nums = JSON.parse(options.game).data4.split(",")
    me.setData({
      userInfo: JSON.parse(options.user),
      dataBean: JSON.parse(options.game),
      numbers: nums
    })

    wx.showShareMenu({
      withShareTicket: true,
      success(r) {
        console.log("share  success -----------", r)
      },
      fail(e) {
        console.log("share  fail -----------", e)
      },
      complete() {
        console.log("share  end -----------")
      }
    })
  },

  //输入数字
  usetoCount(e) {
    var me = this,
      num,
      disStatus = [],
      index = Number(e.currentTarget.dataset.index);
    var oldExp = me.data.exp
    if (oldExp == '回答错误！') {
      oldExp=''
      me.setData({
        exp: ''
      })
    }
    num = me.data.numbers[index];
    //自动添加乘号
    var oldArr = me.data.expArr
    if ((oldArr.length > 0 && typeof oldArr[oldArr.length - 1] == "number")
      || (oldArr.length >= 5 && oldArr[oldArr.length - 1] == ")")) {
      oldExp += "×"
      oldArr.push("*")
    }
    oldExp += num
    oldArr.push(Number(num))

    for (var i in me.data.disabled) {
      disStatus[i] = i == index ? true : me.data.disabled[i];
    }

    me.setData({
      disabled: disStatus,
      exp: oldExp,
      expArr: oldArr
    });

  },

  // 输入运算符
  useOperator(e) {
    var o = e.target.dataset.operator
    var me = this
    var oldExp = me.data.exp
    if (oldExp == "回答错误！") {
      oldExp = ''
      me.setData({
        exp: ''
      })
    
    }
    if (o == '=') {
      try {
        if (oldExp == '' || oldExp == '回答错误！' || oldExp.length < 7 || me.data.disabled.indexOf(false) >= 0) {
          return
        }
        var result = dian24.dal2Rpn(oldExp)
        console.log("计算结果", result)
        if (Number(result) == 24) {
          //  wx.showToast({
          //    title: '回答正确！',
          //  })
          wx.redirectTo({
            url: '../helpresult/helpresult?exp=' + oldExp + '&user=' + JSON.stringify(me.data.myInfo) + '&game=' + JSON.stringify(me.data.dataBean),
          })
        } else {
          me.setData({
            exp: "回答错误！",
            expArr: [],
            disabled: [false, false, false, false]
          })
        }
      } catch (e) {
        // wx.showToast({
        //   title: '请重新输入',
        // })
        me.setData({
          exp: "回答错误！",
          disabled: [false, false, false, false],
          expArr:[]
        })
      }
    } else {
      //自动添加乘号    
      var oldArr = me.data.expArr
      if ((oldArr.length > 0 && typeof oldArr[oldArr.length - 1] == "number")
        && o == "(") {
        oldExp += "×"
        oldArr.push("*")
      }
      oldExp += o
      oldArr.push(o)

      me.setData({
        expArr: oldArr,
        exp: oldExp,
      })
    }
  },

  // 重算
  reCount() {
    this.setData({
      disabled: [false, false, false, false],
      exp: '',
      expArr:[]
    }
    )
  },

  testSelf() {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  onHide() {
    console.log("onhide--------")
  },
  onShow() {
    console.log("onshow-----")

  }

})