/**
 * 时间格式化
 * @param {*} format
 * @param {*} date
 */
export const dateFormat = (date, format = 'yyyy-MM-dd HH:mm:ss') => {
  if (!date) return undefined;
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/, '/'));
  } else if (typeof date === 'number') {
    date = new Date(date);
  }
  const opt = {
    'y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  let ret;
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(format);
    if (ret) {
      format = format.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      );
    }
  }
  return format;
};

/**
 * 获取最近时间，比如最近一周、最近一月等
 * @param {Number}  day     间隔天数
 * @param {Boolean} before  是否今天之前
 */
export const getDateRange = (start, day, format = 'yyyy-MM-dd HH:mm:ss', before = true) => {
  if (before === true) {
    return [
      dateFormat(new Date(start.getTime() - day * 24 * 60 * 60 * 1000), format),
      dateFormat(start, format)
    ];
  } else {
    return [
      dateFormat(start, format),
      dateFormat(new Date(start.getTime() + day * 24 * 60 * 60 * 1000), format)
    ];
  }
};

export const getNowDate = () => {
  return [`${dateFormat(new Date(), 'yyyy-MM-dd')} 00:00`, `${dateFormat(new Date(), 'yyyy-MM-dd')} 23:59`];
};
