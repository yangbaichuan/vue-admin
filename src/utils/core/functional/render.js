export default {
  name: 'Render',
  functional: true,
  props: {
    render: Function,
    data: undefined,
    config: Object
  },
  render: (h, { props: { data, config, render } }) => {
    return render(h, { data, config });
  }
};
