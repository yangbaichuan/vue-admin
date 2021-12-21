/**
 * 方法库
 */

// 将链接替换成a标签
export const replaceLink = (content) => {
  if (!content) {
    return ''
  }
  const urlPattern = /(https?:\/\/|www\.)[a-zA-Z_0-9\-@]+(\.\w[a-zA-Z_0-9\-:]+)+(\/[\(\)~#&\-=?\+\%/\.\w]+)?/g
  content = content.replace(urlPattern, function(match) {
    var href = match
    if (match.indexOf('http') === -1) {
      href = 'http://' + match
    }
    return '<a target="_blank" href="' + href + '">' + match + '</a>'
  })
  return content
}
