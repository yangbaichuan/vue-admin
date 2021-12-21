export default {
  name: 'Action',
  props: {
    // 配置项
    option: {
      type: Object,
      default: () => ({})
    },
    // 数据
    data: Object,
    // 是否提示
    tooltip: Boolean
  },
  data () {
    return {
      showTooltip: true,
      showPoptip: false
    };
  },
  computed: {
    classes () {
      return ['table-action', this.hover && 'table-action-hover', this.tooltip && 'table-action-tooltip'];
    }
  },
  methods: {
    handleClick () {
      if (this.poptip) {
        this.showTooltip = false;
        this.showPoptip = true;
      } else {
        this.handleConfirm();
      }
    },
    handleConfirm () {
      if (this.option.handler) {
        this.option.handler(this.data, this.option);
      } else {
        this.$emit('click', this.data, this.option);
      }
    },
    handleCancel () {
      this.showTooltip = true;
    }
  },
  render () {
    const { icon, name } = this.option;
    let contentEl = '';
    if (this.tooltip) {
      contentEl = <Tooltip placement="top" theme="light" content={name} transfer>
        <Icon type={icon} size="18" />
      </Tooltip>;
    } else {
      contentEl = <div>
        <Icon type={icon} size="18" />
        <span>{name}</span>
      </div>;
    }
    return (
      <a class={this.classes} vOn:click={this.handleClick}>
        {this.poptip ? <Poptip
          value={this.showPoptip}
          title={`您确认${this.name}这条数据吗?`}
          vOn:on-ok={this.handleConfirm}
          vOn:on-cancel={this.handleCancel}
          vOn:on-popper-hide={this.handleCancel}
          confirm transfer>
          {contentEl}
        </Poptip> : contentEl}
      </a>
    );
  }
};
