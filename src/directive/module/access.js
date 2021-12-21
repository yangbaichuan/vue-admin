/**
 * 权限指令
 */
export default {
  inserted: (el, { value }, vnode) => {
    const { authority } = vnode.child.$route.meta;
    if (!authority || !authority.length) return;
    const hasAccess = authority.filter(val => value.includes(val.symbol)).length;
    if (!hasAccess) {
      el.remove();
    }
  }
};
