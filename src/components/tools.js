
export function uuid(len, radix) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
      ""
    );
    var uuid = [],
      i;
    radix = radix || chars.length;
  
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
      // rfc4122, version 4 form
      var r;
  
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";
  
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16);
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }
  
    return uuid.join("");
  }
  
  // 格式化时间
  export function formatDate(date, fmt) {
    if (null == date) return "";
    let fData;
    if (isNaN(date)) {
      // 字符串或者Date
      fData = new Date(date);
    } else if (date.toString().length === 10) {
      // 秒
      fData = new Date((date) * 1000);
    } else {
      // 毫秒
      fData = new Date(+date);
    }
    // 转换失败
    if (isNaN(fData.getTime())) {
      return date;
    }
    // 默认返回秒
    if (!fmt) {
      return parseInt((fData.getTime() / 1000).toString());
    }
    // 返回毫秒
    if (fmt === "time") {
      return fData.getTime();
    }
    // 格式化
    var o = {
      "M+": fData.getMonth() + 1, //month
      "d+": fData.getDate(),
      "h+": fData.getHours(),
      "m+": fData.getMinutes(), //minutes
      "s+": fData.getSeconds(),
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (fData.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  }

  