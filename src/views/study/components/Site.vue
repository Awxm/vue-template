<template>
  <div class="study-site">
    <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }">
      <el-table-column label="中心" width="200" prop="siteName" />
      <el-table-column label="主要研究员" prop="principalInvestigator" min-width="180" />
      <el-table-column label="招募时间" prop="enrollmentDate" min-width="180">
        <template slot-scope="scope">
          <span>
            {{ new Date(scope.row.enrollmentStartDate) | parseTime('{y}-{m}-{d}') }}
          </span>
          <span>至 </span>
          <span>{{ new Date(scope.row.enrollmentEndDate) | parseTime('{y}-{m}-{d}') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address" min-width="180" />
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDelectClick(scope.row, scope.$index)">删除</el-button>
          <el-button type="text" @click="handleEditClick(scope.row, scope.$index)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" plain style="margin-top: 20px;" @click="handleSiteCreateClick">添加</el-button>
    <site-dialog :dialog.sync="dialog" :formData.sync="formData" @handleSubmitClick="handleSubmitDialogClick" />
  </div>
</template>

<script>
import SiteDialog from './Site/Dialog';

export default {
  name: 'StudySite',
  components: {
    SiteDialog,
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
    handleSiteCreateClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '添加试验中心';
    },
    // 表单操作
    handleEditClick(row, index) {
      this.dialog = true;
      this.formData = row;
      this.dialogType = 'edit';
      this.title = '编辑试验中心';
      this.index = index;
    },
    handleSubmitDialogClick(paramet) {
      if (this.dialogType === 'create') {
        this.tableData.push(paramet);
      } else {
        this.tableData.splice(this.index, 1, paramet);
      }
    },
  },
};
</script>
