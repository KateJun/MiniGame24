// pages/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    game: '',
    exp: '',
    nums: []
  },

  /**
   * 生命周期函数--监听页面加载                    
   */
  onLoad: function (options) {
    var me = this
    try {
      var g = JSON.parse(options.game)
      var num = g.data4.split(",")
    } catch (e) {

    }
    me.setData({
      userInfo: JSON.parse(options.user),
      game: JSON.parse(options.game),
      exp: options.exp,
      nums: num
    })

    console.log("help info=", me.data.userInfo, me.data.nums, me.data.exp)
  },

  testAgain() {
    wx.redirectTo({
      url: '../index/index',
    })
  }  
})