<template>
  <div class="app-container">
    <div class="ad-app-filter">
      <search-box :keyword.sync="keyword" @handleSearchClick="studyList" @handleClearInput="studyList" />
      <div class="ad-app-filter__operat">
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleCreateStudyClick">添加实验项目</el-button>
      </div>
    </div>
    <div class="ad-app-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column label="项目名称" prop="name" min-width="100" />
        <el-table-column label="项目编号" prop="registrationNo" min-width="100" />
        <el-table-column label="癌种分类" prop="disease" min-width="100" />
        <el-table-column label="试验分期" prop="stage" min-width="100" />
        <el-table-column label="招募状态" prop="status" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.status | statusItemText('status') }}
          </template>
        </el-table-column>
        <el-table-column label="招募人数" prop="expectedEnrollment" min-width="80" />
        <el-table-column label="招募费用" prop="recruitmentFee" min-width="80" />
        <el-table-column label="中心数量" prop="phone" min-width="80" />
        <el-table-column label="入组数" prop="actualEnrollment" min-width="80" />
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelect(scope.row)">删除</el-button>
            <el-button type="text" @click="handleEditClick(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleAddSubjectClick(scope.row)">添加受试者</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination :request="studyList" :page.sync="pagination.page" :pageSize.sync="pagination.pageSize" :total="total" />
  </div>
</template>

<script>
import page from '@st/mixin/page';
import search from '@st/mixin/search';

export default {
  name: 'Study',
  components: {},
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
    this.studyList();
  },
  methods: {
    // 用户列表
    studyList() {
      this.loading = true;
      this.$post(this.urls.study.list, { keyword: this.keyword, ...this.pagination })
        .then(({ data, total }) => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        })
        .catch(() => {});
    },

    // 创建研究
    handleCreateStudyClick() {
      this.$router.push({ name: 'StudyCreate' });
    },
    // 创建用户
    handleCreateSubjectClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '创建研究';
    },

    // 表单操作
    handleEditClick(row) {
      const { studyId } = row;
      this.$router.push({ name: 'StudyEdit', query: { studyId } });
    },
    // 添加受试者
    handleAddSubjectClick() {
      this.$router.push({ name: 'Subject' });
    },
    // 状态修改
    handleSwitchChange(value, row) {
      const { nickname, auid, enabled } = row;
      this.$confirm(`此操作将${!value ? '禁用' : '启用'} ${nickname}, 是否继续？`, { type: 'warning' })
        .then(() => {
          this.$post(this.urls.account.update_status, { auid, enabled })
            .then(() => {
              this.$message.success('操作成功');
              this.studyList();
            })
            .catch(() => {
              this.$message.success('操作失败');
            });
        })
        .catch(() => {
          row.enabled = !row.enabled;
        });
    },
    // 弹窗确定事件接口
    handleCreateDialogSubmitClick(paramet) {
      const { name, secrecy, disease, stage, phone } = paramet;
      const url = this.urls.subject[this.dialogType === 'create' ? 'create' : 'update'];
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      this.$post(url, { name, phone, secrecy, disease, stage })
        .then(() => {
          this.studyList();
          this.$message.success(message);
        })
        .catch(() => {});
    },
  },
};
</script>
