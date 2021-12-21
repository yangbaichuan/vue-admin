<template>
  <div :class="classes">
    <div class="detail-item-label" :style="labelStyle">{{ label }}</div>
    <div class="detail-item-value">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DetailItem',
    props: {
      label: String,
      labelWidth: Number,
      span: Number
    },
    inject: ['DetailInstance'],
    computed: {
      labelWidthNum () {
        return this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.DetailInstance.labelWidth;
      },
      classes () {
        return [
          'detail-item',
          this.labelWidthNum && 'detail-item-row',
          this.span ? `detail-col-${this.span}` : (this.DetailInstance.col && `detail-col-${24 / this.DetailInstance.col}`)
        ];
      },
      labelStyle () {
        const style = {};
        if (this.DetailInstance.labelPosition !== 'top' && (this.labelWidthNum || this.labelWidthNum === 0)) {
          style.width = `${this.labelWidthNum}px`;
        }
        return style;
      }
    }
  };
</script>

<style lang="less" scoped>
  .detail-item{
    width: 100%;
    line-height: 1;
    display: flex;
    color: #333333;
    font-size: 12px;
    flex-direction: column;
    & {
      &-row{
        flex-direction: row;
      }
    }
    .detail-item-label,
    .detail-item-value{
      border-right: 1px solid #E1E0E6;
      border-bottom: 1px solid #E1E0E6;
      padding: 10px 15px;
      line-height: 1.5;
    }
    .detail-item-label{
      width: 100%;
      min-height: 40px;
      background: #F8FAFF;
      color: #838383;
    }
    .detail-item-value{
      background: #fff;
      flex: 1;
    }
  }
  @grid-columns:    24;
  @col-prefix-cls:  ~"detail-col";
  .loop-grid-columns(@index) when (@index > 0) {
    .@{col-prefix-cls}-@{index} {
        width: percentage((@index / @grid-columns))// percentage((1 / @index));
    }
    .loop-grid-columns((@index - 1));
  }
  .loop-grid-columns(@grid-columns);
</style>
