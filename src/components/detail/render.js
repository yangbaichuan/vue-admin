export default {
  name: 'Render',
  functional: true,
  props: {
    render: Function,
    data: undefined,
    parent: undefined,
    config: Object
  },
  render: (h, { props: { data, parent, config, render } }) => {
    return render(h, { data, parent, config });
  }
};
