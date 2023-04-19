<template>
  <div class="app-container">
    <div class="ad-app-filter">
      <search-box :keyword.sync="keyword" @handleSearchClick="subjectList" @handleClearInput="subjectList" />
      <div class="ad-app-filter__operat">
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleCreateSubjectClick">添加受试者</el-button>
      </div>
    </div>
    <div class="ad-app-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column label="受试者姓名" prop="name" min-width="100" />
        <el-table-column label="病历号" prop="subjectNo" min-width="200" />
        <el-table-column label="性别" prop="secrecy" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.secrecy | statusItemText('secrecy') }}
          </template>
        </el-table-column>
        <el-table-column label="癌种分类" prop="disease" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.disease | statusItemText('cancerSubType') }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" min-width="100" />
        <el-table-column label="疾病分期" prop="stage" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.stage | statusItemText('diseaseStaging') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelectClick(scope.row)">删除</el-button>
            <el-button type="text" @click="handleEditClick(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleConfigClick(scope.row)">配置项目</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :request="subjectList"
      :page.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total="total"
    />
    <subject-create-dialog
      :dialog.sync="dialog"
      :title="title"
      :formData.sync="formData"
      @handleSubmitClick="handleCreateDialogSubmitClick"
    />
    <subject-config-experiment-dialog
      :dialog.sync="configdialog"
      @handleSubmitClick="handleConfigExperimentSubmitClick"
    />
  </div>
</template>

<script>
import subjectCreateDialog from './components/Dialog/CreateDialog.vue';
import subjectConfigExperimentDialog from './components/Dialog/ConfigExperimentDialog.vue';
import page from '@st/mixin/page';
import search from '@st/mixin/search';

export default {
  name: 'Subject',
  components: { subjectCreateDialog, subjectConfigExperimentDialog },
  filters: {
    secrecyFilter(val) {
      let label = '未知';
      switch (val) {
        case 'male':
          label = '男';
          break;
        case 'female':
          label = '女';
          break;
        case 'secrecy':
          label = '未知';
          break;

        default:
          break;
      }
      return label;
    },
  },
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
      // config-dialog
      configdialog: false,
      // loading
      loading: true,
      // 受试者id
      subjectId: null,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.subjectList();
  },
  methods: {
    // 用户列表
    subjectList() {
      this.loading = true;
      this.$post(this.urls.subject.list, {
        keyword: this.keyword,
        ...this.pagination,
      })
        .then(({ data, total }) => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        })
        .catch(() => {});
    },
    // 创建用户
    handleCreateSubjectClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '创建受试者';
    },
    // 删除操作
    handleDelectClick(row) {
      const { name } = row;
      this.$confirm(`是否删除${name}受试者 是否继续？`, { type: 'warning' })
        .then(() => {})
        .catch(() => {});
    },
    handleConfigClick(row) {
      const { subjectId } = row;
      this.subjectId = subjectId;
      this.configdialog = true;
    },
    // 表单操作
    handleEditClick(row) {
      const { subjectId } = row;
      this.subjectId = subjectId;
      this.$router.push({ name: 'SubjectEdit', params: { subjectId } });
    },
    // 状态修改
    handleSwitchChange(value, row) {
      const { nickname, auid, enabled } = row;
      this.$confirm(`此操作将${!value ? '禁用' : '启用'} ${nickname}, 是否继续？`, { type: 'warning' })
        .then(() => {
          this.$post(this.urls.account.update_status, { auid, enabled })
            .then(() => {
              this.$message.success('操作成功');
              this.subjectList();
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
          this.subjectList();
          this.$message.success(message);
        })
        .catch(() => {});
    },
    // 配置接口
    handleConfigExperimentSubmitClick({ studyId }) {
      const subjectId = this.subjectId;
      this.$post(this.urls.subject_study.create, { subjectId, studyId }).then(() => {
        this.$message.success('配置成功');
      });
    },
  },
};
</script>
