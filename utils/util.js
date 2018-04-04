
var data = require("data.js");
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  //   if (t=='hms'){
  //       return [hour, minute, second].map(formatNumber).join(':');
  //   }else{
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  // }
}

module.exports = {
  formatTime: formatTime,
}
