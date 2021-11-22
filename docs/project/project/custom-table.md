# el-table 组件的二次封装

> 在开发项目的时候，可能会遇到表格字段很多并且多处用到表格，代码就会显示的非常多而且冗杂，因此对 Table 组件进行二次封装，从而精简代码量。

## 封装代码

```vue
<template>
  <div class="custom-table">
    <!-- 头部操作栏 -->
    <div class="header-buttons">
      <el-button v-if="hasAdd" icon="h-icon-add" type="iconButton" @click="handleAdd">
        添加
      </el-button>
      <slot name="header-buttons"></slot>
    </div>
    <el-table :data="tableData">
      <!-- 是否显示序号栏 -->
      <el-table-column v-if="hasIndex" type="index" label="序号" width="80" />
      <el-table-column v-for="row in columns" :key="row.value" :prop="row.value" :label="row.label">
        <template slot-scope="scope">
          <!-- 匹配字典文字 -->
          <span v-if="row.isTransform" :title="row.data[scope.row[row.value]]">
            {{ row.data[scope.row[row.value]] || '--' }}
          </span>
          <!-- 是否为插槽 -->
          <slot v-else-if="row.isSlot" :name="row.name" :scope="scope"></slot>
          <!-- 正常显示的文字 -->
          <span v-else :title="scope.row[row.value]" class="column-text">
            {{ scope.row[row.value] || '--' }}
          </span>
        </template>
      </el-table-column>
      <!-- 是否尾部操作栏 -->
      <el-table-column v-if="hasAction" label="操作" width="120">
        <template slot-scope="scope">
          <slot name="table-buttons" :scope="scope"></slot>
          <el-button v-if="hasEdit" type="link" @click="handleEdit(scope.row, scope.$index)">
            编辑
          </el-button>
          <el-button v-if="hasDelete" type="link" @click="handleDelete(scope.row, scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CustomTable',
  props: {
    // 表格数据
    tableData: {
      required: true,
      type: Array,
      default: () => {
        return [];
      }
    },
    // 每一列对应的字段
    columns: {
      required: false,
      type: Array,
      default: () => {
        return [];
      }
    },
    // 是否有添加按钮
    hasAdd: {
      type: Boolean,
      default: true
    },
    // 是否有编辑按钮
    hasEdit: {
      type: Boolean,
      default: true
    },
    // 是否有删除按钮
    hasDelete: {
      type: Boolean,
      default: true
    },
    // 是否显示操作栏
    hasAction: {
      required: false,
      type: Boolean,
      default: true
    },
    // 是否显示索引
    hasIndex: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 添加操作
    handleAdd() {
      this.$emit('add', { type: 'add' });
    },
    // 编辑操作
    handleEdit(row, index) {
      this.$emit('edit', { type: 'edit', index, row });
    },
    // 删除操作
    handleDelete(row, index) {
      this.$confirm('此操作将删除该内容, 是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        onConfirm: () => {
          this.$emit('delete', { row, index });
        },
        onCancel: () => {}
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-table {
  .header-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 6px 0px;
  }
  .column-text {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
```

## 调用

最简单的调用，根据 hasAdd、hasEdit、hasDelete 等决定是否有添加、编辑、删除操作：

```html
<CustomTable
  :table-data="tableData"
  :columns="columns"
  :has-edit="false"
  @add="handleOpenDialog"
  @delete="deleteOrder"
/>
```

其中，columns 传入的数据格式如下：

```javascript
const columns = [
  {
    label: '订单状态', // 表格label所对应字段
    value: 'status', // 表格prop所对应字段
    isSlot: false, // 是否为插槽
    isTransform: true, // 是否根据字典匹配文字
    data: STATUS_MAP // 所对应的字段
  },
  ....
];
```

尾部加入额外操作栏，通过 v-slot:table-buttons="scope"插入，scope 为当前行所对应的数据：

```html
<CustomTable
  :table-data="tableData"
  :columns="columns"
  :has-edit="false"
  @add="handleOpenDialog"
  @delete="deleteOrder"
>
  <!-- 头部额外操作栏  -->
  <template v-slot:header-buttons>
    <el-button @click="handlePreview">布局预览</el-button>
  </template>
  <!-- 尾部额外操作栏  -->
  <template v-slot:table-buttons="scope">
    <el-button type="link" @click="handleApproval(scope.scope)">审批</el-button>
  </template>
</CustomTable>
```

引入额外列：

```html
<CustomTable
  :table-data="tableData"
  :columns="columns"
  :has-edit="false"
  @add="handleOpenDialog"
  @delete="deleteOrder"
>
  <template v-slot:layout-handle="scope">
    <el-button
      :disabled="scope.scope.$index === 0"
      type="link"
      @click="handleMemberMove(scope.scope.$index, 'up')"
    >
      上移
    </el-button>
    <el-button
      :disabled="scope.scope.$index === formData.members.length - 1"
      type="link"
      @click="handleMemberMove(scope.scope.$index, 'down')"
    >
      下移
    </el-button>
  </template>
</CustomTable>
```

二次封装使得代码更加清晰明了，当然更多表格功能可自行再次添加。
