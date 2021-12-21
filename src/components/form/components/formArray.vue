<template>
  <div class="form-array">
    <Draggable class="form-array-body" :list="param" handle=".form-array-handle">
      <div class="form-array-item" v-for="(item, index) in param" :key="index">
        <div v-if="option.sort && !disabled" class="form-array-handle">
          <Icon type="md-reorder" />
        </div>
        <div class="form-array-conent" :style="isCollapse|getContentStyle(index)">
          <Form ref="arrayForm" :model="param[index]">
            <slot :index="index" :data="param[index]" :parent="param"></slot>
          </Form>
        </div>
        <div class="form-array-action">
          <Icon v-if="option.collapse" :class="[isCollapse[index] && 'active']" type="ios-arrow-down" @click="handleCollapse(index)" />
          <Icon type="ios-remove-circle-outline" size="18" color="#ed4014" @click="handleRemove(index)" />
        </div>
      </div>
    </Draggable>
    <Button type="primary" icon="md-add" size="small" ghost :disabled="disabled" @click="handleAdd">{{addLabel}}</Button>
    <component :is="modalOption.component" v-model="showModal" v-bind="modalOption.props" @on-confirm="handleModalConfirm">
      <Form ref="childForm" :model="modalParam">
        <slot name="modal" :data="modalParam"></slot>
      </Form>
    </component>
  </div>
</template>

<script>
  import { cloneDeep, isEqual } from 'lodash-es';
  const MODAL_TYPES = [
    { value: 'modal', is: 'VModal' },
    { value: 'drawer', is: 'VDrawer' }
  ];
  export default {
    name: 'FormArray',
    components: {
      Draggable: () => import('vuedraggable'),
      VModal: () => import('../../vModal'),
      VDrawer: () => import('../../vDrawer')
    },
    filters: {
      getContentStyle (value, index) {
        if (!value || !value[index]) return {};
        else {
          return {
            height: '54px',
            overflow: 'hidden'
          };
        }
      }
    },
    props: {
      // 配置项
      option: {
        type: Object,
        default: () => ({})
      },
      // 绑定值
      value: {
        type: Array,
        default: () => []
      },
      // 值的类型
      valueType: {
        type: String,
        default: 'string',
        validate: value => ['string', 'number', 'object'].includes(value)
      },
      disabled: Boolean
    },
    data () {
      return {
        isCollapse: [],
        param: [],
        showModal: false,
        modalParam: {}
      };
    },
    computed: {
      addLabel () {
        return `添加${this.option.name}`;
      },
      modalOption () {
        const { type, ...props } = this.option.modalProps || {};
        return {
          component: type ? MODAL_TYPES.find(v => v.value === type).is : 'VDrawer',
          props: {
            title: `添加${this.option.name}`,
            ...props
          }
        };
      }
    },
    watch: {
      value: {
        handler: 'handleResetParam',
        immediate: true
      },
      param: {
        handler: 'handleChange',
        deep: true
      }
    },
    methods: {
      handleResetParam (datas) {
        if (!datas || !datas.length) {
          this.param.splice(0, this.param.lenth);
          return;
        }
        this.$set(this, 'param', cloneDeep(datas));
      },
      handleChange (value) {
        if (isEqual(value, this.value)) return;
        this.$emit('input', [...value]);
      },
      validate (callbacl) {
        let result = true;
        this.$refs.arrayForm.forEach(v => {
          v.validate(valid => {
            if (!valid) result = false;
          });
        });
        callbacl(result);
      },
      handleCollapse (index) {
        this.$set(this.isCollapse, index, !this.isCollapse[index]);
      },
      // 添加
      handleAdd () {
        if (this.option.modalProps) {
          this.showModal = true;
        } else if (this.$refs.arrayForm) {
          this.validate(valid => {
            if (!valid) return;
            this.handleAddChildren();
          });
        } else {
          this.handleAddChildren();
        }
      },
      handleAddChildren (data) {
        this.param.push({});
      },
      handleRemove (index) {
        this.param.splice(index, 1);
      },
      handleModalConfirm () {
        this.$refs.childForm.validate(valid => {
          if (!valid) return;
          this.handleAddChildren(this.modalParam);
          this.showModal = false;
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  .form-array{
    width: 100%;
    .form-array-body{
      width: 100%;
    }
    .form-array-item{
      display: flex;
      width: 100%;
      border-radius: 4px;
    }
    .form-array-handle{
      padding: 0 10px;
      cursor: move;
      .ivu-icon{
        font-size: 24px;
        margin-top: 6px;
      }
    }
    .form-array-conent{
      flex: 1;
      /deep/.ivu-form-item{
        margin-bottom: 20px!important;
      }
    }
    .form-array-action{
      padding-right: 10px;
      font-size: 20px;
      .ivu-icon{
        margin-left: 8px;
        cursor: pointer;
        transition: all .2s ease-out;
        &.active{
          transform: rotateZ( 90deg );
        }
      }
    }
  }
</style>
