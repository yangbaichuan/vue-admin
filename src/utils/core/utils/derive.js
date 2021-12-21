/**
 * 解析类型字符串
 * @param {string} input
 * @returns {astTree} 由action和params组成的astTree
 */
export const deriveParser = (input) => {
  if (!input) return '';
  if (!_.isString(input)) return input;
  const tokens = input.match(/[[\]{}|$]|[.\w]+/g);
  let current = 0;
  function walk (v) {
    let token = tokens[current];
    if (token === '[') {
      // enter
      token = tokens[++current];
      let node = {
        action: '[]',
        params: []
      };
      while (token !== ']') {
        node = walk(node);
        token = tokens[current];
      }
      current++;
      v.params.push(node);
      return v;
    } else if (token === '{') {
      token = tokens[++current];
      let node = {
        action: '{}',
        params: []
      };
      while (token !== '}') {
        node = walk(node);
        token = tokens[current];
      }
      current++;
      v.params.push(node);
      return v;
    } else if (token === '|') {
      v.action = v.action || '|';
      current++;
      return v;
    } else if (token === '$') {
      token = tokens[++current];
      let node = {
        action: '$$',
        params: []
      };
      while (token !== '$') {
        node = walk(node);
        token = tokens[current];
      }
      current++;
      v.params.push(node);
      return v;
    } else if (/\w+\.\w+/.test(token)) {
      var mts = token.split('.');
      v.params.push({
        action: mts[0],
        params: [mts[1]]
      });
      current++;
      return v;
    } else if (/^\w+$/.test(token)) {
      v.params.push(token);
      current++;
      return v;
    } else {
      throw new Error(token);
    }
  }
  let ast = { action: '', params: [] };
  while (current < tokens.length) {
    ast = walk(ast);
  }
  if (ast.action === '' && ast.params.length === 1) {
    return ast.params[0];
  }
  return ast;
};
