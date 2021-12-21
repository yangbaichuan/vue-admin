
<!-- 流量方产品管理页面 -->
<template>
  <div class="common-list">
    <SearchForm :option="config.search" v-model="param" @on-search="handleQueryList"></SearchForm>
    <div class="common-list-header">
      <h3 class="common-list-title">{{name}}管理</h3>
      <div class="common-list-extra">
        <Button v-if="level === 3" slot="extra" type="primary" @click="handleCreate()" v-access="['add']">新建{{name}}</Button>
      </div>
    </div>
    <TableList
      :loading="loading"
      :columns="config.fields"
      :datas="datas"
      :total="pagination.total"
      :actions="actions"
      :pagination.sync="param"
      @on-pagination-change="handleQueryList"
      border stripe />
  </div>
</template>
<script>
  import { createUrl } from '@/utils/util';
  import SearchForm from '@/components/searchForm';
  import TableList from '@/components/tableList';
  export default {
    name: 'List',
    components: { SearchForm, TableList },
    data () {
      return {
        module: '',
        param: { current: 1, size: 10 },
        loading: false,
        datas: [],
        pagination: {
          total: 0
        },
        showDrawer: false,
        drawerData: {}
      };
    },
    computed: {
      level () {
        return this.$store.getters[`${this.module}/level`];
      },
      name () {
        return this.$store.getters[`${this.module}/name`];
      },
      config () {
        return this.$store.getters[`${this.module}/list`];
      },
      valueKey () {
        return this.$store.getters[`${this.module}/valueKey`] || 'id';
      },
      status () {
        const field = this.config.fields.find(v => v.type === 'state');
        return field ? field.symbols : [];
      },
      authority () {
        return this.$route.meta.authority && this.$route.meta.authority.map(v => v.symbol);
      },
      actions () {
        return (this.config.actions || [])
          .filter(({ symbol }) => !this.authority || this.authority.includes(symbol))
          .map(val => {
            if (val.type === 'link') {
              val.handler = this.handleRedirect;
            } else if (val.type === 'emit') {
              val.handler = this.handleDispatch;
            } else if (val.type === 'state') {
              val.handler = this.handleChangeStatus;
            } else {
              throw new Error('action配置错误： 未知type类型');
            }
            return val;
          });
      }
    },
    watch: {
      $route: {
        handler: 'handleInit',
        immediate: true
      }
    },
    methods: {
      // 初始化
      handleInit ({ meta }) {
        if (!meta.module) throw new Error('module is not defined in router');
        this.module = meta.module;
        if (this.config.param) {
          this.param = Object.assign({}, this.config.param);
        }
        this.handleQueryList();
      },
      // 查询列表
      handleQueryList () {
        this.loading = true;
        this.datas = [];
        this.$store.dispatch(`${this.module}/query`, this.param).then(({ datas, pagination }) => {
          this.datas = datas;
          this.pagination = pagination;
          this.loading = false;
        });
      },
      // 跳转
      handleRedirect (data, { href, before }) {
        const query = before ? before(data) : { [this.valueKey]: data[this.valueKey] };
        if (href.substr(0, 4) === 'http') {
          window.open(createUrl(href, query));
        } else {
          this.$router.push({
            path: href,
            query
          });
        }
      },
      // 调用store
      handleDispatch (data, conf) {
        debugger;
      },
      // 修改状态
      handleChangeStatus (data, conf) {
        const next = this.status.find(v => v.value === this.status.find(n => n.value === data.status).next);
        if (!next) throw new Error('state状态配置错误：未知状态关联关系，请检查状态数组是否配置next字段');
        this.$Modal.confirm({
          title: `确认${next.label}?`,
          content: `您正在执行${next.label}操作，请点击确认继续`,
          loading: true,
          onOk: () => {
            this.$store.dispatch('product/status', { pid: data.id, DEFAULT_STATUS: next.value }).then(() => {
              this.$Modal.remove();
              this.$Message.success(`${next.label}成功`);
              this.handleQueryList();
            });
          }
        });
      },

      // 创建
      handleCreate () {
        this.$router.push({
          path: '/config/scene/form',
          query: { id: 1 }
        });
      },
      // 修改
      handleUpdate (data) {

      },
      // 保存
      handleDrawerConfirm (data) {
        this.$store.dispatch(`product/${data.id ? 'update' : 'create'}`).then(() => {
          this.$Message.success(`${data.id ? '修改' : '创建'}成功`);
          this.showDrawer = false;
          this.handleQueryList();
        });
      },
      // 取消
      handleDrawerCancel () {
        this.showDrawer = false;
      }
    }
  };
</script>
<style lang="less" scoped>
  .common-list{
    .search-form{
      margin-bottom: 20px;
    }
    .common-list-header{
      padding: 14px 20px;
      background: #fff;
      border-radius: 12px 12px 0 0;
      border: 1px solid #eaebec;
      border-bottom: none;
      &::after{
        content: '';
        display: block;
        clear: both;
      }
      .common-list-title{
        float: left;
        line-height: 32px;
      }
      .common-list-extra{
        float: right;
        .ivu-btn{
          margin-left: 10px;
        }
      }
    }
  }
</style>
