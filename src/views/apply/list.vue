<template>
  <div class="app-container">
    <div class="ad-app-filter">
      <search-box :keyword.sync="keyword" @handleSearchClick="managementList" @handleClearInput="managementList" />
      <div class="ad-app-filter__operat"></div>
    </div>
    <div class="ad-app-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column label="项目名称" prop="studyName" min-width="180" />
        <el-table-column label="项目编号" prop="registrationNo" min-width="100" />
        <el-table-column label="受试者名称" prop="subjectName" min-width="100" />
        <el-table-column label="癌种分类" prop="disease" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.disease | statusItemText('cancerSubType') }}
          </template>
        </el-table-column>
        <el-table-column label="受试者电话" prop="phone" min-width="100" />
        <el-table-column label="推荐日期" min-width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ new Date(scope.row.createTime) | parseTime }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="形式审查状态" prop="status" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.status | statusItemText('formalAuditStatus') }}
          </template>
        </el-table-column> -->
        <el-table-column label="受试者状态" prop="subjectStatus" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.subjectStatus | statusItemText('checkSubjectStatus') }}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="150" />
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="handleSubjectEditClick(scope.row)">标记患者状态</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <apply-subject-dialog
      :dialog.sync="dialog"
      :title="title"
      :formData.sync="formData"
      @handleSubmitClick="handleSubmitDialogClick"
    />
    <pagination
      :request="managementList"
      :page.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total="total"
    />
  </div>
</template>

<script>
import page from '@st/mixin/page';
import search from '@st/mixin/search';
import ApplySubjectDialog from './commpoents/SubjectDialog';
export default {
  name: 'Study',
  // subjectCreateDialog
  components: { ApplySubjectDialog },
  filters: {},
  mixins: [page, search],
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableData: [],
      // create-dialog
      dialog: false,
      title: null,
      formData: null,
      dialogType: null,
      // loading
      loading: true,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.managementList();
  },
  methods: {
    // 用户列表
    managementList() {
      this.loading = true;
      this.$post(this.urls.subject_study.management, { keyword: this.keyword, ...this.pagination })
        .then(({ data, total }) => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        })
        .catch(() => {});
    },
    // 表单操作
    handleSubjectEditClick(row) {
      this.dialog = true;
      this.formData = row;
      this.dialogType = 'create';
      this.title = '标记患者状态';
    },
    // 表单确认
    handleSubmitDialogClick(paramet) {
      // const { subjectStatus, remark, id, studyId, subjectId } = paramet;
      const { subjectStatus, id, studyId, subjectId } = paramet;
      const url = this.urls.subject_study[this.dialogType === 'create' ? 'subject_status' : ''];
      const message = this.dialogType === 'create' ? '标记成功' : '';
      // this.$post(url, { subjectStatus, remark, id, studyId, subjectId })
      this.$post(url, { subjectStatus, id, studyId, subjectId })
        .then(() => {
          this.managementList();
          this.$message.success(message);
        })
        .catch(() => {});
    },
  },
};
</script>
