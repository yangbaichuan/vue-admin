/**
 * 根据配置渲染组件
 */

/**
 * 构造子级渲染数组
 * @param {Function} h         渲染函数
 * @param {Array}    children  子级
 */
const createChildrenRender = (h, children) => {
  if (Array.isArray(children)) {
    return children.map(({ component, props, style, children, slot }) => {
      if (!children || typeof children === 'string') {
        return h(component, { slot, props, style }, children);
      } else {
        return h(component, { slot, props, style }, createChildrenRender(h, children));
      }
    });
  } else {
    return '';
  }
};
/**
 * 函数式组件
 */
export default {
  name: 'RenderComponent',
  functional: true,
  props: {
    component: undefined,
    props: Object,
    style: Object,
    children: Array
  },
  render: (h, { props: { component, props, style, children, slot } }) => {
    return h(component, { props, style }, createChildrenRender(h, children));
  }
};
