var dian24 = require('../../utils/24dian.js');
var app = getApp()
var req = require("../../utils/request.js")
Page({
  data: {
    disabled: [false, false, false, false],
    grade: '挑战模式',//模式
    diffGrade: "A",//难度档位，连续跳过3次降一档，计算成功升级为下一档
    jump: 0,//跳过次数
    second: 120,//倒计时120s
    beginTime: 120,
    dataBean: null,
    score: { gameIndex: 0, successNum: 0, skipNum: 0, failNum: 0, total: 0 },
    oldScore: 0,
    exp: '',
    expArr: [],
    stop: false,
    roomId: 0,
    showModalStatus:false
  },

  onLoad: function (options) {
    var that = this

    let grade = options.grade
    wx.setNavigationBarTitle({
      title: grade,
    })
    if (grade == '挑战模式') {
      var times = 120
    } else {
      times = 0
    }

    var user = options.user
    //来自分享，需重新获取用户信息
    if (user == null) {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        if (userInfo.avatarUrl == null || userInfo.avatarUrl.length == 0) {
          userInfo.avatarUrl = "../../images/avatar_default.png"
        }
        that.setData({
          userInfo: userInfo
        })

      }, null)
    } else {
      that.setData({
        userInfo: user,
      })
      that.data.oldScore = wx.getStorageSync("lastScore")
      console.log("上次分数", that.data.oldScore)
    }

    console.log("接收到", options.room_id, grade)
    that.setData({
      grade: grade,
      second: times,
      beginTime: times,
      roomId: options.room_id,
    })
    that.creatUnit()
  },

  // 当离开当前页面，或者再次进入该页面，倒计时暂停或者继续，bug遗留
  onUnload() {
    this.setData({
      stop: true
    })
    var me = this
    if (Number(me.data.oldScore) < me.data.score.total) {
      wx.setStorageSync(
        "lastScore",
        me.data.score.total
      )
      console.log("离开页面保存算力", me.data.score.total)
    }else{
      console.log("离开页面不保存算力", me.data.score.total)
    }
  },


  // 初始化数字
  creatUnit() {
    var me = this
    let g = me.data.diffGrade
    if (me.data.game == null) {
      var newData = dian24.count(g)
    } else {
      newData = me.data.game
    }
    if (newData) {
      let nums = newData.data4.split(",")
      me.setData({
        game: null,
        dataBean: newData,
        numbers: nums,
        disabled: [false, false, false, false],
        'score.gameIndex': me.data.score.gameIndex + 1,
      })
      if (me.data.grade == '挑战模式') {
        me.countdown()
      } else {
        me.addtime()
      }
    } else {
      me.creatUnit();
    }
  },

  // 挑战模式倒计时
  countdown: function () {
    var that = this
    var second = that.data.second
    if (second <= 0) {
      console.log("Time End...");
      that.setData({
        second: 0
      });
      wx.redirectTo({
        url: '../result/result?total=' + that.data.score.total + '&num=' + (that.data.score.skipNum + that.data.score.failNum + that.data.score.successNum) + '&grade=' + that.data.grade + '&game=' + JSON.stringify(that.data.dataBean) + "&room_id=" + that.data.roomId,
      })
      return
    }
    var time = setTimeout(function () {
      that.setData({
        second: second - 1
      });
      if (that.data.stop == false) {
        that.countdown()
      }
    }, 1000)
    // console.log("倒计时",second)
  },

  //无尽模式
  addtime() {
    var that = this
    var second = that.data.second
    var time = setTimeout(function () {
      that.setData({
        second: second + 1,
      });
      if (that.data.stop == false) {
        that.addtime()
      }
    }, 1000)
    // console.log("倒计时",second)
  },


  // 选择数字
  usetoCount(e) {
    var me = this,
      num,
      index = Number(e.currentTarget.id),
      // index = Number(e.target.dataset.index),
      disStatus = [],
      num = me.data.numbers[index];
    var oldExp = me.data.exp
    if (oldExp == '回答错误！') {
      oldExp = ''
      me.setData({
        exp: ''
      })
    }
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

  // 使用运算符
  useOperator(e) {
    var me = this
    var o = e.target.dataset.operator
    var oldExp = me.data.exp
    if (oldExp == "回答错误！") {
      oldExp = ''
      me.setData({
        exp: ''
      })
    }
    if (o == "=") {
      if (oldExp == '' || oldExp == '回答错误！' || oldExp.length < 7 || me.data.disabled.indexOf(false) >= 0) {
        return
      }
      me.toCount()

    } else {
      //自动添加乘号
      var oldArr = me.data.expArr
      if (o == "(" && ((oldArr.length > 0 && typeof oldArr[oldArr.length - 1] == "number")
        || (oldArr.length >= 5 && oldArr[oldArr.length - 1] == ")"))) {
        oldExp += "×"
        oldArr.push("*")
      }
      oldExp += o
      oldArr.push(o)

      me.setData({
        expArr: oldArr,
        exp: oldExp,
      });
    }
  },

  // 计算表达式结果
  toCount: function () {
    var me = this,
      oldData = me.data;
    try {
      var result = dian24.dal2Rpn(oldData.exp)
      console.log("计算结果", result)
      if (Number(result) == 24) {
        //改变难度系数
        var oldDiff = oldData.diffGrade,
          newDiff;
        if (oldDiff == "F") {
          newDiff = "A"
        } else {
          newDiff = String.fromCharCode((oldDiff.charCodeAt() + 1))
        }
        // 改变总算力
        var newTotal = Number(oldData.score.total) + Number(oldData.dataBean.calcPow)
        //计算本局耗时
        let useTime = Math.abs((oldData.beginTime - oldData.second)),
          useTimeTxt = '';
        // if (useTime >= 60) {
        //   useTimeTxt += parseInt(useTime / 60) + '分' + (useTime % 60) + '秒'
        // } else {
        useTimeTxt = useTime + '秒';
        // }
        console.log("本局耗时", oldData.beginTime, oldData.second, useTimeTxt)
        me.setData({
          exp: "",
          expArr: [],
          disabled: [false, false, false, false],
          jump: 0,
          diffGrade: newDiff,
          beginTime: oldData.second,
          'score.total': newTotal,
          'score.successNum': Number(oldData.score.successNum) + 1,
          showModalStatus: true,
        })
        //显示对话框
        //TODO 
        
        // wx.showModal({
        //   content: '恭喜你！',
        //   title: '回答正确',
        //   confirmText: '下一题',
        //   showCancel: false,
        //   cancelText: '关闭',
        //   success: function (res) {
        //     if (res.confirm) {
        //       me.creatUnit();
        //     }
        //   }
        // })
        //数据上报
        if (me.data.grade == '挑战模式') {
          var param = {
            openid: app.globalData.userid,
            session_code: app.globalData.session,
            score: newTotal,
            // score: oldData.dataBean.calcPow,
            room_id: me.data.roomId
          }
          console.log("挑战模式play data", param)
          req.play24(param,
            function (s) {
              console.log("上报成功")
            }, function (f) {

            })
        }
      } else {//结果不等于24
        me.setData({
          exp: "回答错误！",
          expArr: [],
          disabled: [false, false, false, false],
          // 'score.failNum': Number(oldData.score.failNum) + 1,
        })
      }
    } catch (e) {//表达式输入错误
      me.setData({
        exp: "回答错误！",
        disabled: [false, false, false, false],
        expArr: []
      })
    }

  },

  //下一局
  getNextUnit() {
    this.creatUnit()
  },
  // 重算
  reCount() {
    this.setData({
      disabled: [false, false, false, false],
      exp: '',
      expArr: [],
    }
    )
  },
  // 跳过
  toSkip() {
    var me = this,
      newJump = me.data.jump,
      oldDiff = me.data.diffGrade,
      newDiff = oldDiff;
    if (newJump >= 3) {
      if (oldDiff != "A") {
        newDiff = String.fromCharCode((oldDiff.charCodeAt() - 1))
      }
      newJump = 0
    } else {
      newJump++
    }
    me.setData({
      'score.skipNum': Number(me.data.score.skipNum) + 1,
      jump: newJump,
      diffGrade: newDiff,
      exp: '',
      expArr: [],
    });
    me.creatUnit();
  },

  clickDialog(e) {
    // var currentStatu = e.currentTarget.dataset.statu
    var act = e.currentTarget.dataset.act
    // var me = this
 
    setTimeout(function () {
      if (act == 'ok') {
        this.creatUnit();
      }
      this.setData({
        showModalStatus: false
      }
      );
    }.bind(this), 200)
  },
 

  onShareAppMessage: function () {
    var me = this
    return {
      path: '/pages/reqhelp/reqhelp?game=' + JSON.stringify(me.data.dataBean) + '&user=' + me.data.userInfo,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
        req.share(app.globalData.userid)
        // wx.navigateTo({
        //   url: '../reqhelp/reqhelp?game=' + JSON.stringify(me.data.dataBean) + '&user=' + me.data.userInfo,
        // })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  }
});