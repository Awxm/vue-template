<template>
  <el-card class="ms-subc-history-info" :body-style="{ padding: '22px 20px 0' }">
    <div slot="header" class="clearfix">
      <span>病史记录</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="handleHistoryClick">添加病史记录</el-button>
    </div>
    <div class="ms-subc-history-wrap">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column label="病例时间" prop="caseTime" min-width="80">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ new Date(scope.row.createTime) | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="病史内容" prop="historyContent" min-width="200" />
        <el-table-column label="病史报告" prop="disease" min-width="120" />
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEditClick(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDeleteClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <history-dialog
      :dialog.sync="dialog"
      :formData.sync="formData"
      :dialogType="dialogType"
      @handleSubmitClick="handleHistoryDialogSubmitClick"
    />
  </el-card>
</template>

<script>
import HistoryDialog from './Dialog/HistoryDialog.vue';
export default {
  name: 'SubjectHistoryInfo',
  components: { HistoryDialog },
  filters: {},
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableData: [],
      // history-dialog
      dialog: false,
      formData: null,
      dialogType: null,
      // loading
      loading: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.historyList();
  },
  mounted() {},
  methods: {
    historyList() {
      this.loading = true;
      const { subjectId } = this.$route.params;
      this.$post(this.urls.history.list, { subjectId })
        .then(({ data, total }) => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        })
        .catch(() => {});
    },
    // 病史信息
    handleHistoryClick() {
      this.dialog = true;
      this.dialogType = 'create';
    },
    // 编辑
    handleEditClick(row) {
      this.formData = row;
      this.dialog = true;
      this.dialogType = 'edit';
    },
    // 删除
    handleDeleteClick(row) {
      this.$confirm('是否删除病史?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const { subjectId } = this.$route.params;
          const { historyId } = row;
          this.$post(this.urls.history.delete, { subjectId, historyId })
            .then(() => {
              this.historyList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 弹窗事件
    handleHistoryDialogSubmitClick() {
      this.historyList();
    },
  },
};
</script>
