// pages/helpresult/helpresult.js
var req = require("../../utils/request.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exp:'',
    game:'',
    userInfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  this.setData({
    exp:options.exp,
    game:options.game,
    userInfo:options.user,
  })
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var me = this
    return {
      path: '/pages/help/help?game=' + me.data.game+"&exp="+me.data.exp+'&user='+me.data.userInfo,
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

  testSelf() {
    wx.redirectTo({
      url: '../index/index',
    })
  },

//监听图片下载，获取宽高
  imageLoad: function (e) {
    var width = e.detail.width,    //获取图片真实宽度
         height = e.detail.height,
          ratio = width / height;    //图片的真实宽高比例
    var viewWidth = 718,           //设置图片显示宽度，左右留有16rpx边距
          viewHeight = 718 / ratio;    //计算的高度值
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  }
})