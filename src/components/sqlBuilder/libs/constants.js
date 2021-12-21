/**
 * sql-create常量表
 * @description 此表为常量表，修改内容将会影响使用此组件的全部业务线。修改前请提前知悉使用者。
 */

/**
 * 数据类型
 * @param   id          number      id
 * @param   type        string      数据类型
 * @param   component   object      调用组件
 */
const DATATYPES = [
  { id: 1, type: 'intNum', component: { name: 'InputNumber', value: 0 } },
  { id: 2, type: 'doubleNum', component: { name: 'InputNumber', value: 0 } },
  { id: 3, type: 'string', component: { name: 'Input', type: 'text', placeholder: '请输入' } },
  { id: 4, type: 'stringType', component: { name: 'Select', placeholder: '请选择' } },
  { id: 5, type: 'timeType', component: { name: 'DatePicker', type: 'datetime', format: 'yyyy-MM-dd hh:mm:ss', placeholder: '请选择' } },
  { id: 6, type: 'intType', component: { name: 'Select', placeholder: '请选择' } },
  { id: 7, type: 'dateType', component: { name: 'DatePicker', type: 'date', format: 'yyyy-MM-dd', placeholder: '请选择' } }
];

/**
 * 条件
 * @param   id          number      id
 * @param   name        string      名称
 * @param   value       string      值
 * @param   syntax      string      转换后的值
 * @param   data_types  array       可用于的数据类型
 * @param   noQuotes    Boolean     不需要引号包裹值
 * @param   hasValue    Boolean     没有值
 */
const CONDITIONS = [
  { id: 1, name: '等于', value: 'equal', syntax: '=', data_types: [1, 2, 3, 5, 7] },
  { id: 2, name: '不等于', value: 'not_equal', syntax: '!=', data_types: [1, 2, 3, 5, 7] },
  { id: 3, name: '大于', value: 'greater', syntax: '>', data_types: [1, 2, 5, 7] },
  { id: 4, name: '大于或等于', value: 'greater_or_equal', syntax: '>=', data_types: [1, 2, 5, 7] },
  { id: 5, name: '小于', value: 'less', syntax: '<', data_types: [1, 2, 5, 7] },
  { id: 6, name: '小于或等于', value: 'less_or_equal', syntax: '<=', data_types: [1, 2, 5, 7] },
  { id: 7, name: '在此之间', value: 'between', syntax: 'BETWEEN {{value.0}} AND {{value.1}}', data_types: [1, 2, 5, 7] },
  { id: 8, name: '不在此之间', value: 'not_between', syntax: 'NOT BETWEEN {{value.0}} AND {{value.1}}', data_types: [1, 2, 5, 7] },
  { id: 9, name: '以此开始', value: 'begins_with', syntax: 'LIKE (\'{{value}}%\')', noQuotes: true, data_types: [3] },
  { id: 10, name: '不以此开始', value: 'not_begins_with', noQuotes: true, syntax: 'NOT LIKE (\'{{value}}%\')', data_types: [3] },
  { id: 11, name: '包含此内容', value: 'contains', noQuotes: true, syntax: 'LIKE (\'%{{value}}%\')', data_types: [3] },
  { id: 12, name: '不包含此内容', value: 'not_contains', noQuotes: true, syntax: 'NOT LIKE (\'%{{value}}%\')', data_types: [3] },
  { id: 13, name: '以此结束', value: 'ends_with', noQuotes: true, syntax: 'LIKE (\'%{{value}}\')', data_types: [3] },
  { id: 14, name: '不以此结束', value: 'not_ends_with', noQuotes: true, syntax: 'NOT LIKE (\'%{{value}}\')', data_types: [3] },
  { id: 15, name: '在...之內', value: 'in', syntax: 'IN ({{value}})', data_types: [4, 6] },
  { id: 16, name: '不在...之內', value: 'not_in', syntax: 'NOT IN ({{value}})', data_types: [4, 6] },
  { id: 17, name: '为空', value: 'is_empty', syntax: "= ''", hasValue: false, data_types: [1, 2, 3, 4, 6] },
  { id: 18, name: '不为空', value: 'is_not_empty', syntax: "!= ''", hasValue: false, data_types: [1, 2, 3, 4, 6] },
  { id: 19, name: '为null', value: 'is_null', syntax: 'IS NULL', hasValue: false, data_types: [1, 2, 3, 4, 5, 6, 7] },
  { id: 20, name: '不为null', value: 'is_not_null', syntax: 'IS NOT NULL', hasValue: false, data_types: [1, 2, 3, 4, 5, 6, 7] },
  { id: 21,
    name: '距离当前',
    value: 'date_diff',
    syntax: 'datediff({{key}}, getdate(), {{value.1}}) = {{value.0}}',
    include: ['key', 'value.1', 'value.0'],
    data_types: [5, 7],
    component: [
      { name: 'InputNumber', value: 0 },
      {
        name: 'Select',
        value: 'dd',
        props: {
          multiple: false,
          placeholder: '请选择间隔类型',
          style: { width: '60px' }
        },
        options: [
          { value: 'yyyy', remark: '年' },
          { value: 'mm', remark: '月' },
          { value: 'dd', remark: '日' },
          { value: 'hh', remark: '时' },
          { value: 'mi', remark: '分' },
          { value: 'ss', remark: '秒' }
        ]
      }
    ]
  }
];

export { DATATYPES, CONDITIONS };
