<template>
  <div :class="classes">
    <slot>
      <DetailItem v-for="(item, index) in detailItems" :key="index" :label="item.name">
        <Render v-if="item.render" :render="item.render" :data="data|serialize(item)" :parent="data" :config="item"></Render>
        <template v-else>{{ data|serialize(item) }}</template>
      </DetailItem>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'Detail',
    components: {
      DetailItem: () => import('./detailItem.vue'),
      Render: () => import('./render')
    },
    props: {
      labelWidth: Number,
      labelPosition: {
        type: String,
        default: 'left',
        validator: value => ['left', 'right', 'top'].includes(value)
      },
      col: Number,
      option: {
        type: Array,
        default: () => []
      },
      data: {
        type: Object,
        default: () => ({})
      }
    },
    provide () {
      return { DetailInstance: this };
    },
    filters: {
      serialize (data, { key }) {
        if (!key) return '';
        if (key.includes('.')) {
          return key.split('.').reduce((res, k) => {
            if (res) res = res[k];
            return res;
          }, data);
        } else {
          return data[key];
        }
      }
    },
    computed: {
      classes () {
        const prefix = 'detail';
        return [
          prefix,
          this.labelPosition && `${prefix}-label-${this.labelPosition}`
        ];
      },
      detailItems () {
        if (this.col) {
          const n = Math.ceil(this.option.length % this.col);
          let items = this.option;
          if (n > 0) {
            for (let i = 0; i < this.col - n; i++) {
              items.push({});
            }
          }
          return items;
        } else {
          return this.option;
        }
      }
    }
  };
</script>

<style lang="less">
  .detail{
    display: flex;
    flex-flow: row wrap;
    border-top: 1px solid #E1E0E6;
    border-left: 1px solid #E1E0E6;
    &-label-right{
      .detail-item-label{
        text-align: right;
      }
    }
    &-label-top{
      .detail-item{
        flex-direction: column;
      }
    }
  }
</style>
