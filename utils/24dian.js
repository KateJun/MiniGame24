var data = require("data.js");
function isOperator(value) {
  var operatorString = "+-*/()×÷";
  return operatorString.indexOf(value) > -1
}

function getPrioraty(value) {
  switch (value) {
    case '+':
    case '-':
      return 1;
    case '*':
    case '×':
    case '/':
    case '÷':
      return 2;
    default:
      return 0;
  }
}

function getResult(fir, sec, cur) {
  switch (cur) {
    case '+':
      return fir + sec;
    case '-':
      return fir - sec;
    case '*':
    case '×':
      return fir * sec;
    case '/':
    case '÷':
      return fir / sec;
    default:
      return 0;
  }
}

function prioraty(o1, o2) {
  return getPrioraty(o1) <= getPrioraty(o2);
}

function dal2Rpn(exp) {
  var inputStack = [];
  var outputStack = [];
  var outputQueue = [];

  for (var i = 0, len = exp.length; i < len; i++) {
    var cur = exp[i];
    if (i < len - 1) {
      var cur2 = exp[i + 1];
      if (!isOperator(cur2) && !isOperator(cur)) {
        cur = cur + cur2;
        i++;
      }
    }
    if (cur != ' ') {
      inputStack.push(cur);
    }
  }
  // console.log('step one');
  while (inputStack.length > 0) {
    var cur = inputStack.shift();
    if (isOperator(cur)) {
      if (cur == '(') {
        outputStack.push(cur);
      } else if (cur == ')') {
        var po = outputStack.pop();
        while (po != '(' && outputStack.length > 0) {
          outputQueue.push(po);
          po = outputStack.pop();
        }
        if (po != '(') {
          throw "error: unmatched ()";
        }
      } else {
        while (prioraty(cur, outputStack[outputStack.length - 1]) && outputStack.length > 0) {
          outputQueue.push(outputStack.pop());
        }
        outputStack.push(cur);
      }
    } else {
      outputQueue.push(new Number(cur));
    }
  }
  // console.log('step two');
  if (outputStack.length > 0) {
    if (outputStack[outputStack.length - 1] == ')' || outputStack[outputStack.length - 1] == '(') {
      throw "error: unmatched ()";
    }
    while (outputStack.length > 0) {
      outputQueue.push(outputStack.pop());
    }
  }
  // console.log('step three');
  console.log(outputQueue);
  return evalRpn(outputQueue);

}

function evalRpn(rpnQueue) {
  var outputStack = [];
  while (rpnQueue.length > 0) {
    var cur = rpnQueue.shift();

    if (!isOperator(cur)) {
      outputStack.push(cur);
    } else {
      if (outputStack.length < 2) {
        throw "unvalid stack length";
      }
      var sec = outputStack.pop();
      var fir = outputStack.pop();

      outputStack.push(getResult(fir, sec, cur));
    }
  }
  if (outputStack.length != 1) {
    throw "unvalid expression";
  } else {
    console.log(outputStack);
    return outputStack[0];
  }
}

function createRandomNum(maxNum) {
  return Math.ceil(Math.random() * maxNum);
}

//根据ABCDEF档位，随机出一组数
function count(g) {
  let d;
  switch (g) {
    case "A":
      d = data.dataA;
      break;
    case "B":
      d = data.dataB;
      break;
    case "C":
      d = data.dataC;
      break;
    case "D":
      d = data.dataD;
      break;
    case "E":
      d = data.dataE;
      break;
    case "F":
      d = data.dataF;
      break;
    default:
      d = data.DataA;
      break;
  }
 let index = createRandomNum(d.length);
  console.log(d[index]);
  return d[index];
}


/** 
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second = 2 * 1000;
/* 毫秒级倒计时 */
function countdown(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: dateformat(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    countdown(that);
  }
    , 10)
}

// 时间格式化输出，如3:25:19 86。每10ms都会调用一次
function dateformat(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = Math.floor((second - hr * 3600) / 60);
  // 秒位
  var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = Math.floor((micro_second % 1000) / 10);
  return hr + ":" + min + ":" + sec + " " + micro_sec;
}


module.exports = {
  // calc24: calc24,
  count: count,
  dal2Rpn: dal2Rpn,
  evalRpn: evalRpn
}