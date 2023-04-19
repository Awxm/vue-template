<template>
  <el-dialog
    center
    :title="title"
    width="560px"
    :visible.sync="dialog"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    @closed="handleClosed"
  >
    <el-form ref="form" label-position="right" label-width="140px" :model="form" :rules="rules">
      <el-form-item label="中心名称" prop="siteName">
        <el-input v-model="form.siteName" :placeholder="siteNamePlaceholder" />
      </el-form-item>
      <el-form-item label="主要研究者" prop="principalInvestigator">
        <el-input v-model="form.principalInvestigator" :placeholder="principalInvestigatorPlaceholder" />
      </el-form-item>
      <el-form-item label="招募开始时间" prop="enrollmentStartDate">
        <el-date-picker v-model="form.enrollmentStartDate" type="date" :placeholder="enrollmentStartDatePlaceholder" />
      </el-form-item>
      <el-form-item label="招募结束时间" prop="enrollmentEndDate">
        <el-date-picker v-model="form.enrollmentEndDate" type="date" :placeholder="enrollmentEndDatePlaceholder" />
      </el-form-item>
    </el-form>
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
export default {
  name: 'SubjectCreateDialog',
  components: {},
  filters: {},
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      siteNamePlaceholder: '请输入中心名称',
      principalInvestigatorPlaceholder: '请输入主要研究者',
      enrollmentStartDatePlaceholder: '请选择开始时间',
      enrollmentEndDatePlaceholder: '请选择结束时间',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        siteName: [{ required: true, message: this.siteNamePlaceholder, trigger: 'blur' }],
        principalInvestigator: [{ required: true, message: this.siteNamePlaceholder, trigger: 'blur' }],
        enrollmentStartDate: [{ required: true, message: this.siteNamePlaceholder, trigger: 'blur' }],
        enrollmentEndDate: [{ required: true, message: this.siteNamePlaceholder, trigger: 'blur' }],
      };
    },
  },
  watch: {
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
    handleSubmitClick() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('update:dialog', false);
          this.$emit('handleSubmitClick', this.form);
        } else {
          return false;
        }
      });
    },
    handleCancelClick() {
      this.$emit('update:dialog', false);
    },
    handleClosed() {
      this.$emit('update:formData', null);
      this.form = this.formInit();
    },
    formInit() {
      return {
        siteName: null,
        principalInvestigator: null,
        address: null,
        enrollmentStartDate: null,
        enrollmentEndDate: null,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
