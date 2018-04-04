// pages/share/share.js

var app = getApp();
var req = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CANVAS_ID: 'canvas_id',
    PIC_BG: '../../images/score_bg.jpg',
    PIC_LOGO: '../../images/score_logo_top.png',
    PIC_SEAL: '../../images/score_seal.png',
    PIC_SQURE: '../../images/score_square.png',
    PIC_QR: '../../images/score_qr_new.jpg',
    screenWH: [],
    allPicInfo: {},
    baseWidth: 750,
    radio: 1,

    xyLogo: [0, 10],
    xyNums: [20, 235],
    xyPhoto: [100, 375],
    whPhoto: [160, 160],
    xyScore: [280, 405],
    xyEvaluationBg: [20, 565],
    xyEvaluationPercent: [155, 620],
    xyEvaluationTitle: [500, 620],
    xyEvaluationResult: [320, 660],
    xyEvaluationSum: [0, 770],
    xyShareBg: [0, -340],
    xyShareText: [75, -340 + 55],
    xyShareQR: [750 - 20 - 300, -340 + 20],

    margin20: 20,
    font26: 26,
    font32: 32,
    font36: 36,
    font48: 48,
    font40: 40,
    font60: 60,
    font80: 80,

    colorTextBlack: '#3e4a53',
    colorTextBlue: '#61ada8',
    colorTextGreen: '#317e50',
    colorTextWhite: '#ffffff',
    result: ['1', '2', '7', '7'],
    resultText: ['通过加减乘除', '得出24!'],
    resultScoreTitle: '我的最终算力评分',
    resultScore: '321',
    resultEvaluation: ['98%', '算力堪比', 'intel i7 7790k', '无敌是种怎样的体验？', 48],
    resultShareText: ['这里是24点算力测评', '据说', '只有智力', '不同于普通人', '的', '才喜欢玩', '长按识别立即体验'],

    userInfo: {},
    userImg: '',
    userNickName: '',
    hasUserInfo: false,
    discuss: [
      { minScore: -1, maxScore: 0, desc: '没有什么可以对比的', dis: '可以尝试着换颗脑袋', per: '0.1%', fontSize: 36 },
      { minScore: 1, maxScore: 120, desc: '赛扬D 365	', dis: '勉勉强强能算个1+1', per: '38%', fontSize: 48 }, //<=120
      { minScore: 121, maxScore: 254, desc: '酷睿2 E6600', dis: '加油已经可以运算加减乘除', per: '58%', fontSize: 48 },
      { minScore: 255, maxScore: 405, desc: '酷睿i3 7300', dis: '有点厉害', per: '68%', fontSize: 48 },
      { minScore: 406, maxScore: 630, desc: '酷睿i5 7640X', dis: '跪求一败', per: '78%', fontSize: 48 },
      { minScore: 631, maxScore: 800, desc: '酷睿i7 7820X', dis: '人形计算机', per: '88%', fontSize: 48 },
      { minScore: 801, maxScore: 1000, desc: '酷睿i9 7980XE	', dis: '无敌是多么寂寞', per: '98%', fontSize: 48 },
      { minScore: 1001, maxScore: 10000, desc: '未知生物', dis: '作弊是种怎样的体验？', per: '1%', fontSize: 48 }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.initPhoto()
    that.loadHeader(function () {
      if (that.getScreenWH()) {
        // that.data.radio = that.data.screenWH[2] ;
        that.data.radio = that.data.screenWH[0] / that.data.baseWidth;
        that.getAllPicInfo(function (result) {
          if (result) {
            that.drawPage(that);
          }
        });
      }
    })

  },

  loadHeader(c) {
    var context = this
    wx.downloadFile({
      url: context.data.userImg,
      success(res) {
        console.log('tempimage', res)
        if (res.statusCode == 200) {
          context.data.userImg = res.tempFilePath
        } else {
          context.data.userImg = "../../images/avatar_default.png"
        }
        c()
      },
      fail(res) {
        context.data.userImg = "../../images/avatar_default.png"
        c()
      }
    })
  },

  initPhoto: function () {
    var that = this;
    that.data.userInfo = app.globalData.userInfo;
    that.data.userImg = app.globalData.userInfo.avatarUrl;
    try {
      var ls = wx.getStorageSync("lastScore")
      if (ls == '') {
        ls = 0
      }
    } catch (e) {
      ls = 0
    }
    that.data.resultScore = ls
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
  getScreenWH: function (call) {
    try {
      var res = wx.getSystemInfoSync();
      this.data.screenWH.push(res.windowWidth);
      this.data.screenWH.push(res.windowHeight);
      this.data.screenWH.push(res.pixelRatio);
      return true;
    } catch (e) {
      wx.getSystemInfo({
        success: function (res) {
          this.data.screenWH.push(res.windowWidth);
          this.data.screenWH.push(res.windowHeight);
          this.data.screenWH.push(res.pixelRatio);
          return (true)
        },
      })
      console.log('Get System info error!');
      return false;
    }
  },

  getAllPicInfo: function (callback) {
    var allPicRelativePath = [this.data.PIC_BG, this.data.PIC_LOGO, this.data.PIC_SEAL, this.data.PIC_SQURE, this.data.PIC_QR];

    this.getOnePicInfo(this, allPicRelativePath, this.data.allPicInfo, function (result) {
      if (result) {
        if (callback) {
          callback(true);
        }
      } else {
        console.log('获取图片信息失败');
        if (callback) {
          callback(false);
        }
      }
    });
  },

  getOnePicInfo: function (context, allPicRelativePath, allPicInfo, callback) {
    if (allPicRelativePath.length < 1) {
      if (callback) {
        callback(true);
      }
      return;
    }
    var path = allPicRelativePath[0];
    allPicRelativePath.splice(0, 1);
    wx.getImageInfo({
      src: path,
      success: function (res) {
        allPicInfo[path] = res;
        context.getOnePicInfo(context, allPicRelativePath, allPicInfo, callback);
      },
      fail: function (res) {
        console.log('获取图片path=' + path + '失败');
        if (callback) {
          callback(false);
        }
      }
    })
  },

  drawPage: function (context) {
    const canvas = wx.createCanvasContext(context.data.CANVAS_ID);

    context.drawBg(context, canvas);
    context.drawLogo(context, canvas);
    context.drawAnswer(context, canvas);
    context.drawPhoto(context, canvas);
    context.drawScore(context, canvas);
    context.drawEvaluation(context, canvas);
    context.drawShare(context, canvas);

    canvas.draw();

  },

  drawBg: function (context, canvas) {
    canvas.save();
    canvas.drawImage(context.data.PIC_BG, 0, 0, context.data.screenWH[0], context.data.screenWH[1]);
    canvas.restore();
  },

  drawLogo: function (context, canvas) {
    var xyLogo = context.data.xyLogo;
    canvas.save();
    var width = context.scale(context.data.allPicInfo[context.data.PIC_LOGO].width);
    var height = context.scale(context.data.allPicInfo[context.data.PIC_LOGO].height);
    canvas.drawImage(context.data.PIC_LOGO, context.scale(xyLogo[0]), context.scale(xyLogo[1]), width, height);
    canvas.restore();
  },

  drawAnswer: function (context, canvas) {
    canvas.save();
    var xyNums = context.data.xyNums;
    var width = context.scale(context.data.allPicInfo[context.data.PIC_SQURE].width);
    var height = context.scale(context.data.allPicInfo[context.data.PIC_SQURE].height);
    var leftMargin = context.scale(context.data.margin20);
    canvas.setFillStyle(context.data.colorTextBlack);
    var fontSize = context.scale(context.data.font80);
    canvas.setFontSize(fontSize);
    //4个结果数字
    for (var i = 0; i < 4; i++) {
      var x = context.scale(xyNums[0]) + (leftMargin * i) + (width * i);
      var y = context.scale(xyNums[1]);
      canvas.drawImage(context.data.PIC_SQURE, x, y, width, height);
      canvas.fillText(context.data.result[i], x + (width - fontSize / 2) / 2, y + fontSize);
    }
    canvas.restore();
    canvas.save();
    //右侧文字
    var x = context.scale(xyNums[0]) + (leftMargin * 4) + (width * 4);
    var fontSize = context.scale(context.data.font36);
    canvas.setFillStyle(context.data.colorTextBlack);
    canvas.setFontSize(fontSize);
    canvas.fillText(context.data.resultText[0], x, y + fontSize - context.scale(4));

    var fontSizeNew = context.scale(context.data.font48);
    canvas.setFillStyle(context.data.colorTextBlack);
    canvas.setFontSize(fontSizeNew);
    // canvas.setShadow(1, 1, 0, context.data.colorTextBlack);
    // canvas.setShadow(-1, -1, 0, context.data.colorTextBlack);
    canvas.fillText(context.data.resultText[1], x, y + fontSize + fontSizeNew + context.scale(4));
    canvas.restore();
  },

  drawPhoto: function (context, canvas) {
    var x = context.scale(context.data.xyPhoto[0]);
    var y = context.scale(context.data.xyPhoto[1]);
    var width = context.scale(context.data.whPhoto[0]);
    var height = context.scale(context.data.whPhoto[1]);
    canvas.save();
    canvas.arc(x + width / 2, y + height / 2, width / 2, 0, 2 * Math.PI);
    canvas.clip();
    canvas.drawImage(context.data.userImg, x, y, width, height);
    canvas.restore();

  },

  drawScore: function (context, canvas) {
    //title
    canvas.save();
    var x = context.scale(context.data.xyScore[0]);
    var y = context.scale(context.data.xyScore[1]);
    var fontSize = context.scale(context.data.font32);
    canvas.setFillStyle(context.data.colorTextBlack);
    canvas.setFontSize(fontSize);
    canvas.fillText(context.data.resultScoreTitle, x, y + fontSize - context.scale(4));
    canvas.restore();
    canvas.save();
    //score
    var newFontSize = context.scale(context.data.font80);
    canvas.setFontSize(newFontSize);
    canvas.setFillStyle(context.data.colorTextBlue);
    var newY = y + context.scale(fontSize + context.data.margin20);
    // canvas.setShadow(1, 1, 0, context.data.colorTextBlue);
    // canvas.setShadow(-1, -1, 0, context.data.colorTextBlue);
    canvas.fillText(context.data.resultScore, x, newY + newFontSize - context.scale(4));
    canvas.restore();
  },

  drawEvaluation: function (context, canvas) {
    canvas.save();
    //bg
    var x = context.scale(context.data.xyEvaluationBg[0]);
    var y = context.scale(context.data.xyEvaluationBg[1]);
    var width = context.scale(context.data.allPicInfo[context.data.PIC_SEAL].width);
    var height = context.scale(context.data.allPicInfo[context.data.PIC_SEAL].height);

    canvas.drawImage(context.data.PIC_SEAL, x, y, width, height);
    canvas.restore();
    canvas.save();
    //percent
    var percent = context.data.resultEvaluation[0];
    var xP = context.scale(context.data.xyEvaluationPercent[0]);
    var yP = context.scale(context.data.xyEvaluationPercent[1]);

    var fontSize = context.scale(context.data.font60);
    canvas.setFillStyle(context.data.colorTextGreen);
    canvas.setFontSize(fontSize);
    canvas.rotate(-15 * Math.PI / 180);
    // canvas.setShadow(1, 1, 0, context.data.colorTextGreen);
    // canvas.setShadow(-1, -1, 0, context.data.colorTextGreen);
    canvas.fillText(percent, xP - context.scale(190), yP + fontSize + context.scale(35));
    canvas.restore();
    canvas.save();
    //title
    var title = context.data.resultEvaluation[1];
    var x = context.scale(context.data.xyEvaluationTitle[0]);
    var y = context.scale(context.data.xyEvaluationTitle[1]);
    var fontSize = context.scale(context.data.font32);
    canvas.setFillStyle(context.data.colorTextGreen);
    canvas.setFontSize(fontSize);
    canvas.fillText(title, x, y + fontSize - context.scale(4));
    canvas.restore();
    canvas.save();
    //evaluation
    var evaluation = context.data.resultEvaluation[2];
    var x = context.scale(context.data.xyEvaluationResult[0]);
    var y = context.scale(context.data.xyEvaluationResult[1]);
    var fontSize = context.scale(context.data.resultEvaluation[4]);
    canvas.setFillStyle(context.data.colorTextWhite);
    canvas.setFontSize(fontSize);
    // canvas.setShadow(1, 1, 0, context.data.colorTextWhite);
    // canvas.setShadow(-1, -1, 0, context.data.colorTextWhite);
    canvas.fillText(evaluation, x, y + fontSize - context.scale(4));
    canvas.restore();
    canvas.save();
     //sum
    var sum = context.data.resultEvaluation[3];
    var x = context.scale(context.data.xyEvaluationSum[0]);
    var y = context.scale(context.data.xyEvaluationSum[1]);
    var fontSize = context.scale(context.data.font40);
    canvas.setFillStyle(context.data.colorTextBlack);
    canvas.setFontSize(fontSize);
    // canvas.setTextAlign('center');
    canvas.fillText(sum, context.data.screenWH[0] / 2 - x - (fontSize*sum.length)/2, y + fontSize - context.scale(4));

    canvas.restore();
  },

  // draw二维码+左边文字
  drawShare: function (context, canvas) {
    canvas.save();
    //bg
    canvas.setFillStyle(context.data.colorTextWhite);
    var x = context.scale(context.data.xyShareBg[0]);
    var y = context.data.screenWH[1] + context.scale(context.data.xyShareBg[1]);

    canvas.fillRect(x, y, context.data.screenWH[0], -context.scale(context.data.xyShareBg[1]));
    canvas.restore();
    canvas.save();
    //text
    var text = context.data.resultShareText;
    var xText = context.scale(context.data.xyShareText[0]);
    var yText = context.data.screenWH[1] + context.scale(context.data.xyShareText[1]);
    var lineSpace = context.scale(context.data.margin20);
    var fontSize = context.scale(context.data.font26);
    var fontSizeBold = context.scale(context.data.font32);
    canvas.setFillStyle(context.data.colorTextBlack);
    canvas.setFontSize(fontSize);
    canvas.fillText(text[0], xText, yText + fontSize - context.scale(4)); 
    canvas.fillText(text[1], xText, yText + fontSize - context.scale(4) + lineSpace + fontSize * 1); 
    canvas.fillText(text[2], xText, yText + fontSize - context.scale(4) + lineSpace * 2 + fontSize * 2);
    canvas.restore();
    canvas.save();

    canvas.setFontSize(fontSizeBold);
    // canvas.setShadow(1, 1, 0, context.data.colorTextBlack);
    // canvas.setShadow(-1, -1, 0, context.data.colorTextBlack);
    canvas.fillText(text[3], xText + fontSize * text[2].length, yText + fontSize - context.scale(4) + lineSpace * 2 + fontSize * 2);
    canvas.restore();
    canvas.save();

    canvas.setFontSize(fontSize);
    canvas.fillText(text[4], xText + fontSize * text[2].length + fontSizeBold * text[3].length, yText + fontSize - context.scale(4) + lineSpace * 2 + fontSize * 2);
    canvas.restore();
    canvas.save();

    canvas.setFontSize(fontSizeBold);
    // canvas.setShadow(1, 1, 0, context.data.colorTextBlack);
    // canvas.setShadow(-1, -1, 0, context.data.colorTextBlack);
    canvas.fillText(text[5], xText, yText + fontSizeBold - context.scale(4) + lineSpace * 3 + fontSize * 2 + fontSizeBold * 1);
    canvas.restore();
    canvas.save();

    canvas.setFontSize(fontSize);
    canvas.fillText(text[6], xText, yText + fontSizeBold - context.scale(4) + lineSpace * 4 + fontSize * 2 + fontSizeBold * 2);
    canvas.restore();
    canvas.save();
    //qr
    var x = context.scale(context.data.xyShareQR[0]);
    var y = context.data.screenWH[1] + context.scale(context.data.xyShareQR[1]);
    var width = context.scale(context.data.allPicInfo[context.data.PIC_QR].width);
    var height = context.scale(context.data.allPicInfo[context.data.PIC_QR].height);

    canvas.drawImage(context.data.PIC_QR, x, y, width, height);
    canvas.restore();
  },

  scale: function (source) {
    return source * this.data.radio;
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return {
      title: '',
      path: '/pages/index/index',
      imageUrl: e,
      // imageUrl: 'http://mj-img.mjmobi.com/dsp/3f7876bb-489d-455d-9cfc-e3d187310687.jpg',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
        // wx.redirectTo({
        //   url: '/pages/index/index',
        // })
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

  save() {
    var me = this
    wx.canvasToTempFilePath({
      canvasId: me.data.CANVAS_ID,
      // x: 0,
      // y: 0,
      // width: me.data.screenWH[0],
      // height: me.data.screenWH[1],
      // destWidth: me.data.screenWH[0],
      // destHeight: me.data.screenWH[1],
      success(res) {
        var image = res.tempFilePath
        console.log(image)
        wx.previewImage({
          urls: [image],
          current: image
        })

      }
    })
  },
})