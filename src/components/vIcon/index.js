export default {
  name: 'VIcon',
  props: {
    type: {
      type: String,
      required: true
    },
    color: {
      type: String
    },
    size: {
      type: Number
    }
  },
  render () {
    const props = {
      size: this.size,
      color: this.color
    };
    if (this.type && this.type.includes('_')) {
      props.custom = `iconfont icon-${this.type.slice(1)}`;
    } else {
      props.type = this.type;
    }
    return <Icon {...{ props }} />;
  }
};
