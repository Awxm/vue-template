<template>
  <div class="table">
    <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }">
      <el-table-column label="序号" width="50" />
      <el-table-column label="内容" prop="content" min-width="180" />
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDelectClick(scope.row, scope.$index)">删除</el-button>
          <el-button type="text" @click="handleEditClick(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" plain style="margin-top: 20px;" @click="handleCreateClick">添加</el-button>
    <criteria-dialog
      :dialog.sync="dialog"
      :title="title"
      :formData.sync="formData"
      @handleSubmitClick="handleSubmitDialogClick"
    />
  </div>
</template>

<script>
import CriteriaDialog from './Dialog';
export default {
  name: 'Table',
  components: {
    CriteriaDialog,
  },
  filters: {},
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 弹窗
      dialog: false,
      title: null,
      formData: null,
      dialogType: null,
      index: 0,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleDelectClick(row, index) {
      this.$confirm(`是否删除改项？`, { type: 'warning' })
        .then(() => {
          this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },
    // 创建用户
    handleCreateClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '添加内容';
    },
    // 表单操作
    handleEditClick(row, index) {
      this.dialog = true;
      this.formData = row;
      this.dialogType = 'edit';
      this.title = '编辑内容';
      this.index = index;
    },
    handleSubmitDialogClick(paramet) {
      let ctions = [];
      const { content } = paramet;
      if (this.dialogType === 'create') {
        const pretext = content.replace(/\r\n/g, ',').replace(/\n/g, ',');
        ctions = pretext.split(',');
        ctions = ctions.filter((item) => item !== '');
        for (let index = 0; index < ctions.length; index++) {
          this.tableData.push({ content: ctions[index] });
        }
      } else {
        this.tableData.splice(this.index, 1, paramet);
      }
    },
  },
};
</script>
