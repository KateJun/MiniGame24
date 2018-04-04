var app = getApp()
var req = require("../../utils/request.js")
Page({
  data: {
    userInfo: {},
    totalscore: 0,
    num: 0,
    discuss: [
      { minScore: -1, maxScore: 0, desc: '没有什么可以对比的', dis: '可以尝试着换颗脑袋', per: '0.1%', fontSize: 36},
      { minScore: 1, maxScore: 120, desc: '赛扬D 365	', dis: '勉勉强强能算个1+ 1', per: '38%', fontSize: 48}, //<=120
      { minScore: 121, maxScore: 254, desc: '酷睿2 E6600', dis: '加油已经可以运算加减乘除', per: '58%', fontSize: 48},
      { minScore: 255, maxScore: 405, desc: '酷睿i3 7300', dis: '有点厉害', per: '68%', fontSize: 48 },
      { minScore: 406, maxScore: 630, desc: '酷睿i5 7640X', dis: '跪求一败', per: '78%', fontSize: 48 },
      { minScore: 631, maxScore: 800, desc: '酷睿i7 7820X', dis: '人形计算机', per: '88%', fontSize: 48},
      { minScore: 801, maxScore: 1000, desc: '酷睿i9 7980XE	', dis: '无敌是多么寂寞', per: '98%', fontSize: 48},
      { minScore: 1001, maxScore: 10000, desc: '未知生物', dis: '作弊是种怎样的体验？', per: '1%',fontSize:48}
    ],
    resultEvaluation: ['98%', '算力堪比', 'intel i7 7790k', '无敌是种怎样的体验？',48],
    curDis: null,
    roomId:0,
    PIC_SEAL: '../../images/score_seal.png',
    xyEvaluationBg: [20, 0],
    xyEvaluationPercent: [155, 620-565 ],
    xyEvaluationTitle: [500, 620 - 565 ],
    xyEvaluationResult: [320, 660 - 565 ],
    xyEvaluationSum: [0, 770 - 565 ], 
    screenWH: [],
    baseWidth:750,
    allPicInfo:{},
    colorTextWhite: '#ffffff',
    colorTextGreen: '#317e50',
  },
  onLoad: function (options) {
    var that = this
    // var score = 100
    var score = Number(options.total)
    var cur = null
    for (var i = 0; i < that.data.discuss.length; i++) {
      if (score <= that.data.discuss[i].maxScore && score >= that.data.discuss[i].minScore) {
        cur = that.data.discuss[i]
        break
      }
    }
    that.setData({
      userInfo: app.globalData.userInfo,
      totalscore: score,
      grade: options.grade,
      game: options.game,
      num: options.num,
      roomId:options.room_id,
      // grade:"挑战模式",
      // game: null,
      // num: 4,
      // roomId: 1,

      curDis: cur
    })
    // console.log(options.game)
    // wx.setNavigationBarTitle({
    //   title: options.grade,
    // })

    // wx.setStorage({
    //   key: "lastScore",
    //   data: score
    // })
    that.initDisc(that)
    that.getScreenWH()
    that.data.radio = that.data.screenWH[0] / that.data.baseWidth;
    that.getImageInfo(function(call){
      if(call){
        that.drawPage(that)
      }
    })
  },

  initDisc(that){
    var ls = that.data.totalscore
    for (var i = 0; i < that.data.discuss.length; i++) {
      if (ls <= that.data.discuss[i].maxScore && ls >= that.data.discuss[i].minScore) {
        var cur = that.data.discuss[i]
        that.data.resultEvaluation[0] = cur.per
        that.data.resultEvaluation[2] = cur.desc
        that.data.resultEvaluation[3] = cur.dis
        that.data.resultEvaluation[4] = cur.fontSize
        break
      }
    }
  },

  getScreenWH () {
    try {
      var res = wx.getSystemInfoSync();
      this.data.screenWH.push(res.windowWidth);
      this.data.screenWH.push(res.windowHeight);
      return true;
    } catch (e) {
      console.log('Get System info error!');
      return false;
    }
  },

  getImageInfo(callBack){
    var me = this
    wx.getImageInfo({
      src: me.data.PIC_SEAL,
      success: function (res) {
        me.data.allPicInfo= res;
        callBack(true)
      },
      fail: function (res) {
        console.log('获取图片path=' + path + '失败');
        callBack(false)
      }
    })
  },

  drawPage: function (context) {
    var canvas = wx.createCanvasContext("canvasID");
 
    context.drawEvaluation(context, canvas);
 
    canvas.draw();

  },

  drawEvaluation: function (context, canvas) {
    canvas.save();
    //bg
    var x = context.scale(context.data.xyEvaluationBg[0]);
    var y = context.scale(context.data.xyEvaluationBg[1]);
    var width = context.scale(context.data.allPicInfo.width);
    var height = context.scale(context.data.allPicInfo.height);

    canvas.drawImage(context.data.PIC_SEAL, x, y, width, height);

    //percent
    var percent = context.data.resultEvaluation[0];
    var xP = context.scale(context.data.xyEvaluationPercent[0]);
    var yP = context.scale(context.data.xyEvaluationPercent[1]);

    var fontSize = context.scale(60);
    canvas.setFillStyle(context.data.colorTextGreen);
    canvas.setFontSize(fontSize);
    canvas.rotate(-15 * Math.PI / 180);
    canvas.setShadow(1, 1, 0, context.data.colorTextGreen);
    canvas.setShadow(-1, -1, 0, context.data.colorTextGreen);
    canvas.fillText(percent, xP - context.scale(45), yP + fontSize + context.scale(55));
    canvas.restore();
    canvas.save();
    //title
    // var title = context.data.resultEvaluation[1];
    // var x = context.scale(context.data.xyEvaluationTitle[0]);
    // var y = context.scale(context.data.xyEvaluationTitle[1]);
    // var fontSize = context.scale(32);
    // canvas.setFillStyle(context.data.colorTextGreen);
    // canvas.setFontSize(fontSize);
    // canvas.fillText(title, x, y + fontSize - context.scale(4));
    //evaluation
    var evaluation = context.data.resultEvaluation[2];
    var x = context.scale(context.data.xyEvaluationResult[0]);
    var y = context.scale(context.data.xyEvaluationResult[1]);
    var fontSize = context.scale(context.data.resultEvaluation[4]);
    // var fontSize = context.scale(48);
    canvas.setFillStyle(context.data.colorTextWhite);
    canvas.setFontSize(fontSize);
    canvas.setShadow(1, 1, 0, context.data.colorTextWhite);
    canvas.setShadow(-1, -1, 0, context.data.colorTextWhite);
    canvas.fillText(evaluation, x, y + fontSize - context.scale(20));
    canvas.restore();
    canvas.save();
    //sum
    // var sum = context.data.resultEvaluation[3];
    // var x = context.scale(context.data.xyEvaluationSum[0]);
    // var y = context.scale(context.data.xyEvaluationSum[1]);
    // var fontSize = context.scale(40);
    // canvas.setFillStyle(context.data.colorTextBlack);
    // canvas.setFontSize(fontSize);
    // canvas.setTextAlign('center');
    // canvas.fillText(sum, context.data.screenWH[0] / 2 - x, y + fontSize - context.scale(4));
    // canvas.save()
    // canvas.restore();
  },

  scale: function (source) {
    return source * this.data.radio;
  },

  shareImage() {
    wx.navigateTo({
      url: '/pages/share/share',
    })
  },

  onShareAppMessage: function (e) {
    var me = this
    if (e.from == 'button') {//来自页面内按钮
    }

    console.log("分享",me.data.roomId, me.data.grade)
    return {
      title: '我的算力高达' + me.data.totalscore + '，你敢来挑战吗？',
      path: '/pages/count/count?room_id=' + me.data.roomId + '&grade=' + me.data.grade,//透传挑战模式。房间号
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


  onUnload() {
    // wx.navigateBack({
    //   delta:100
    // })
  }
})
