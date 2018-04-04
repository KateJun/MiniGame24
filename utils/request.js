var Promise = require('../utils/es6-promise.js')
//异步代理
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

/**
 * 微信用户登录,获取code
 */
function wxLogin() {
  return wxPromisify(wx.login)
}
/**
 * 获取微信用户信息
 * 注意:须在登录之后调用
 */
function wxGetUserInfo() {
  return wxPromisify(wx.getUserInfo)
}
/**
 * 获取系统信息
 */
function wxGetSystemInfo() {
  return wxPromisify(wx.getSystemInfo)
}

// var baseUrl = 'http://172.19.11.51:8080'
var baseUrl = 'https://wnews.mjmobi.com'///cal24/play'

var openIdUrl = baseUrl + '/cal24/get_openid'   //get

var updateUserUrl = baseUrl + '/cal24/update_user_info' //post

var playUrl = baseUrl + '/cal24/play'  //post

var roomByOwnerUrl = baseUrl + '/cal24/get_room_by_owner' //get

var rankUrl = baseUrl + '/cal24/get_rank' //get

var shareUrl = baseUrl + '/cal24/share' //get

/**
 * 
 * 获取openID
 * req: appid, js_code, grant_type, inviter_id(openid)
 * resp: openid, session_code, errcode, errmsg
 */
function getOpenId(param, succes, fail) {
  // return new Promise(function (reslove, reject){
  _getWithParam(openIdUrl, param, succes, fail)
  // })
  // _get(url , succes, fail)
}

/**
 * req: nickName, avatarUrl, gender, city, province, country, language, openid, session_code
    resp: errcode
 */
function update_user_info(data, success, fail) {
  _post(updateUserUrl, data, success, fail)
}

/**
 * req: openid, session_code
 * resp: {room_id, ranks: [{nick_name, openid, avatar_url, score}]}
 * 
 */
function get_owned_play_room(param, success, fail) {
  
  _getWithParam(roomByOwnerUrl, param, success, fail)
}

/**
 * 
 * req: {openid, session_code, score, room_id}
 * resp: {errcode, room_rank, global_rank, rank_percent, new_high_score}
 */
function play24(data, success, fail) {
  _post(playUrl, data, success, fail)
}

/**
 * req: room_id openid
 * resp: {
       user_rank: {room_rank, global_rank, rank_percent},
       room_rank: [{openid, nick_name, avatar_url, score}],
       global_rank: [{openid, nick_name, avatar_url, score}]
      }
 */
function getRank(param, success, fail) {
  _getWithParam(rankUrl, param, success, fail)
}

/**
 * req: {openid}
 * resp: 200 or 404
 */
function share(openid) {
  var param = {
    openid: openid
  }
  _getWithParam(shareUrl, param, function (s) {
    console.log("分享成功")
  }, function (f) { })
}

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _get(url, s, f) {
  console.log(url, "------start---_get----");
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: "GET",
    success: function (res) {
      console.log("data", res.data)
      if (res.statusCode == 200) {
        s(res.data);
      } else {
        f(res)
      }
    },
    fail: function (res) {
      console.log(res)
      f(res);
    }
  });
  // console.log(url, "----end-----_get----");
}

function _getWithParam(url, data, s, f) {
  console.log(url, data,"------start---_get----");
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: "GET",
    data: data,
    success: function (res) {
      console.log("data", res.data)
      if (res.statusCode == 200) {
        s(res.data);
      } else {
        f(res)
      }
    },
    fail: function (res) {
      console.log(res)
      f(res);
    }
  });
  // console.log(url, "----end-----_get----");
}

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _post(url, data, s, f) {
  console.log(url, data,"----_post--start-------");
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: 'POST',
    data:  data ,
    success: function (res) {
      console.log("data", res.data)
      if (res.statusCode == 200) {
        s(res.data);
      } else {
        f(res)
      }
    },
    fail: function (res) {
      console.log(res)
      f(res);
    }
  });
  // console.log(url, "----end-----_post----");
}

module.exports = {
  getOpenId: getOpenId,
  updateUser: update_user_info,
  share: share,
  getRank: getRank,
  play24: play24,
  roomById: get_owned_play_room,
  updateUser: update_user_info,

  wxPromisify: wxPromisify,
  wxLogin: wxLogin,
  wxGetUserInfo: wxGetUserInfo,
  wxGetSystemInfo: wxGetSystemInfo
}