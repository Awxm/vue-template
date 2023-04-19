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
    <el-form ref="form" label-position="right" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="状态" prop="enrollmentStatus">
        <el-select v-model="form.enrollmentStatus" :placeholder="enrollmentStatusPlaceholder">
          <el-option
            v-for="item in medicalReviewStatus"
            :key="item.itemValue"
            :label="item.itemText"
            :value="item.itemValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          rows="4"
          cols="30"
          wrap="off"
          :placeholder="remarkPlaceholder"
        />
      </el-form-item> -->
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
import { mapGetters } from 'vuex';
export default {
  name: 'ApplyEnrollmentDialog',
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
      enrollmentStatusPlaceholder: '请选择状态',
      remarkPlaceholder: '请输入内容',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        enrollmentStatus: [{ required: true, message: this.enrollmentStatusPlaceholder, trigger: 'blur' }],
        remark: [{ required: true, message: this.remarkPlaceholder, trigger: 'blur' }],
      };
    },

    ...mapGetters(['dataDictionarty_code']),

    medicalReviewStatus() {
      return this.dataDictionarty_code['medicalReviewStatus'].items;
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
        enrollmentStatus: null,
        // remark: null,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
