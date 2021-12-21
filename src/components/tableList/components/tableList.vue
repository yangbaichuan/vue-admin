<template>
  <div class="table-list">
    <Table
      ref="table"
      stripe
      border
      :columns="listColumns"
      :data="listDatas"
      v-bind="listProps"
      tooltip-theme="light"
      @on-select-all="selectAll"
      @on-select-all-cancel="selectAllCancel"
      @on-select="select"
      @on-select-cancel="selectCancel">
      <template slot-scope="{ row }" slot="actions">
        <slot name="actions" v-bind:row="row">
          <template v-for="(item, index) in getActions(row)">
            <Action v-if="!item.type || item.type !== 'more'" :key="index" :option="item" :data="row" tooltip />
            <Dropdown v-else :key="index" class="table-list-action-dropdown" placement="bottom-end" transfer>
              <a href="javascript:void(0)" class="table-list-action-more">
                <Icon type="ios-more" :size="28" />
              </a>
              <DropdownMenu slot="list">
                <DropdownItem v-for="(child, i) in item.children" :key="i" class="table-list-action-dropdown-item">
                  <Action :option="child" :data="row" :hover="false" />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </template>
        </slot>
      </template>
    </Table>
    <div class="table-list-footer">
      <Page
        v-if="showPagination"
        style="float: right"
        show-total
        :total="total || pagination.total"
        :current="pagination.current"
        :page-size="pagination.size"
        @on-change="handlePageChange"
        @on-page-size-change="handlePageSizeChange" />
    </div>
  </div>
</template>

<script>
  import listParser from '../utils/listParser';
  export default {
    name: 'ListTable',
    components: {
      Action: () => import('./action.js')
    },
    props: {
      // 标题
      title: String,
      // 加载状态
      loading: Boolean,
      // 列配置
      columns: Array,
      // 数据
      datas: Array,
      // 总数
      total: Number,
      // 分页信息
      pagination: {
        type: Object,
        default: () => ({})
      },
      // 是否显示多选列
      showCheckbox: Boolean,
      // 选中的数据
      value: {
        type: Array,
        default: () => []
      },
      // 列表操作
      actions: {
        type: Array,
        default: () => []
      },
      showPagination: {
        type: Boolean,
        default: true
      },
      showSummary: Boolean,
      summaryMethod: Function,
      spanMethod: Function
    },
    data () {
      return {
        selectDatas: []
      };
    },
    computed: {
      listProps () {
        const props = {};
        Object.keys(this.$props).forEach(k => {
          if (!['datas', 'columns', 'pagination', 'showCheckbox', 'value', 'actions'].includes(k)) {
            props[k] = this.$props[k];
          }
        });
        return props;
      },
      listColumns () {
        return [
          ...this.showCheckbox ? [{ type: 'selection', width: 60, align: 'center' }] : [],
          ...listParser(this.columns),
          ...this.actions.length ? [{ title: '操作', slot: 'actions', width: 170, fixed: 'right' }] : []
        ];
      },
      // 列表数据，整合选中数据
      listDatas () {
        if (this.value.length) {
          let datas = JSON.parse(JSON.stringify(this.datas));
          if (this.selectDatas.length) {
            this.selectDatas.forEach(val => {
              const i = datas.findIndex(v => v.id === val.id);
              if (i !== -1) datas = datas.splice(i, 1, _.assign({}, datas[i], { _checked: true }));
            });
          }
          return datas;
        } else {
          return this.datas;
        }
      }
    },
    methods: {
      // 获取操作
      getActions (data) {
        const actions = this.actions.filter(({ control }) => !control || control(data));
        if (actions.length < 4) {
          return actions;
        } else {
          return actions.slice(0, 2).concat([{ type: 'more', children: actions.slice(2, actions.length) }]);
        }
        // return [
        //   ...(actions.length > 3 ? actions.slice(0, 2) : actions),
        //   ...(actions.length > 3 ? [{ type: 'more', children: actions.slice(2, actions.length) }] : [])
        // ];
      },
      // 选择全部
      selectAll () {
        this.datas.forEach(val => {
          const index = this.selectDatas.findIndex(v => v.id === val.id);
          if (index === -1) {
            this.selectDatas.push(val);
          }
        });
        this.selectedChange();
      },
      // 取消选择全部
      selectAllCancel () {
        this.datas.forEach(val => {
          const index = this.selectDatas.findIndex(v => v.id === val.id);
          if (index !== -1) {
            this.selectDatas.splice(index, 1);
          }
        });
        this.selectedChange();
      },
      // 选择某一项
      select (selection, row) {
        const index = this.selectDatas.findIndex(v => v.id === row.id);
        if (index === -1) {
          this.selectDatas.push(row);
        }
        this.selectedChange();
      },
      // 取消选择某一项
      selectCancel (selection, row) {
        const index = this.selectDatas.findIndex(v => v.id === row.id);
        if (index !== -1) {
          this.selectDatas.splice(index, 1);
        }
        this.selectedChange();
      },
      // 选中数据变化
      selectedChange () {
        this.$emit('input', this.selectDatas);
      },
      // 重置columns
      resetColumns () {
        const columns = this.columns.slice();
        const action = this.columns[this.columns.length - 1];
        if (action.slot && action.slot === 'action') {
          if (!action.width) action.width = 120;
          // let action = { title: '操作', slot: 'action', width: 120 };
          const width = _.sum(_.map(columns, 'minWidth'));
          if (this.$refs.table.$el.offsetWidth < width + 120) {
            action.fixed = 'right';
          } else {
            delete action.fixed;
          }
          columns.splice(columns.length - 1, 1, action);
        }
        this.listColumns = columns;
      },
      // 重置选中项
      resetSelected () {
        if (!this.value || this.value.length === this.selectDatas.length) return;
        this.selectDatas = this.value.slice();
      },
      handlePageChange (current) {
        this.$emit('update:pagination', { current, size: this.pagination.size });
        this.$emit('on-pagination-change');
      },
      handlePageSizeChange (size) {
        this.$emit('update:pagination', { current: 1, size });
        this.$emit('on-pagination-change');
      }
    },
    watch: {
      value: {
        handler: 'resetSelected',
        immediate: true
      }
    }
  };
</script>

<style lang="less">
.table-list{
  .table-list-footer{
    text-align: right;
    margin-top: 15px;
  }
  .table-list-action-dropdown{
    margin-left: 15px;
  }
  .table-list-action-more{
    display: inline-block;
    vertical-align: middle;
  }
  .ivu-table{
    th{
      background-color: #fff;
      font-weight: 500;
      height: 60px;
    }
    &-wrapper-with-border{
      border-color: #eaebec;
    }
    &-border{
      th, td{
        border-color: #EFF3F7;
        border-bottom-color: #EAEBEC;
      }
    }
    &-stripe{
      .ivu-table-body, .ivu-table-fixed-body{
        tr {
          &:nth-child(2n){
            td{
              background-color: #fff;
            }
          }
          &:nth-child(2n+1){
            td{
              background: #F8FAFB;
            }
          }
        }
      }
    }
    &-large{
      font-size: 14px;
    }
  }
}
.table-list-action-dropdown-item{
  padding: 0;
  .action{
    background: transparent;
    width: 100%;
    color: #515a6e;
    &:hover{
      color: #2d8cf0;
    }
  }
}
.table-action{
  color: #2d8cf0;
  display: inline-block;
  background: #e4ecf8;
  border-radius: 6px;
  padding: 8px 13px;
  line-height: 1;
  transition: all .3s linear;
  vertical-align: middle;
  &.table-action-hover{
    &:hover{
      background: #c3d8f7;
    }
  }
  & ~ & {
    margin-left: 15px;
  }
  .v-icon{
    margin-right: 5px;
  }
  span{
    display: inline-block;
    margin-left: 5px;
  }
  &-tooltip{
    padding: 0;
    .iconfont, .ivu-icon{
      padding: 8px;
    }
  }
}
</style>
