<template>
  <el-dialog
    center
    title="配置研究项目"
    width="1200px"
    :visible.sync="dialog"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    @closed="handleClosed"
  >
    <div class="ad-app-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="选择项" width="100" align="center">
          <template slot-scope="scope">
            <el-radio v-model="form.studyId" :label="scope.row.studyId">{{ `` }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" min-width="200" />
        <el-table-column label="编号" prop="secrecy" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.secrecy }}
          </template>
        </el-table-column>
        <el-table-column label="分期" prop="stage" min-width="180" />
        <el-table-column label="癌种分类" prop="disease" min-width="180" />
        <el-table-column label="可筛选人数" prop="expectedEnrollment" min-width="180" />
        <el-table-column label="费用" prop="recruitmentFee" min-width="180" />
        <el-table-column label="创建时间" prop="createTime" min-width="180">
          <template slot-scope="scope">
            <span>{{ new Date(scope.row.createTime) | parseTime('{y}-{m}-{d}') }} </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :request="handleConfigExperiment"
      :page.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total="total"
    />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmitClick">
        确认
      </el-button>
      <el-button @click="handleCancelClick">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import page from '@st/mixin/page';
export default {
  name: 'ConfigExperimentDialog',
  components: {},
  filters: {},
  mixins: [page],
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: null,
      loading: false,
      tableData: [],
    };
  },
  computed: {},
  watch: {
    dialog(value) {
      if (value) this.handleConfigExperiment();
    },
    formData: {
      handler(form) {
        if (form) this.form = _.cloneDeep(form);
        else this.form = this.formInit();
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 获取配置实验项目
    handleConfigExperiment() {
      this.loading = true;
      this.$post(this.urls.study.list, {})
        .then(({ data, total }) => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        })
        .catch(() => {});
    },
    // 选中的表格
    handleSelectionChange() {},
    // 弹窗
    handleSubmitClick() {
      if (this.form.studyId) {
        this.$emit('update:dialog', false);
        this.$emit('handleSubmitClick', this.form);
      } else {
        this.$message.error('请选择一个研究项目');
      }
    },
    handleCancelClick() {
      this.$emit('update:dialog', false);
    },
    handleClosed() {
      this.$emit('update:formData', null);
      this.disabledUpload = false;
      this.form = this.formInit();
    },
    formInit() {
      return {
        studyId: null,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
