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
    <el-form ref="form" label-position="right" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="报告" prop="cloudFiles">
        <el-upload
          ref="upload"
          accept=".jpg, .jpeg, .png"
          drag
          action="#"
          :limit="1"
          :auto-upload="false"
          :file-list="form.cloudFiles ? [form.cloudFiles] : []"
          :disabled="disabledUpload"
          :on-exceed="handleExceed"
          :on-error="handleFileError"
          :on-change="handleUploadChange"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" style="margin-top: -10px;line-height: 20px;">
            将文件拖到此处，
            <div v-if="!disabledUpload"><em>注意：文件需小于2M</em></div>
            <div v-else><em>文件正在上传中，请等待...</em></div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="2" :placeholder="remarkPlaceholder" />
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
  name: 'HistoryDialog',
  components: {},
  filters: {},
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    dialogType: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    groupName: {
      type: String,
      default: null,
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: null,
      remarkPlaceholder: '请输入备注',
      cloudFilesPlaceholder: '请上传图片',
      // 优化处理
      time: null, // change事件是否结束 是否可以直接调手动上传事件（目前设置1.5s）
      disabledUpload: false, // 正在上传中 禁止再次选择文件上传
    };
  },
  computed: {
    rules() {
      return {
        cloudFiles: [{ required: true, message: this.cloudFilesPlaceholder, trigger: 'change' }],
      };
    },
    isCreate() {
      return this.dialogType === 'create';
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
    // 上传的Change
    handleUploadChange(file) {
      const { raw, name, size } = file;
      const isLt2M = size / 1024 / 1024 < 2;
      const isImage = name.indexOf('.jpg') > -1 || name.indexOf('.png') > -1 || name.indexOf('.jpeg') > -1;
      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 2M');
      }
      if (!isImage) {
        this.$message.warning('当前仅支持.jpg, .jpeg, .png格式的文件上传');
      }
      if (raw && isLt2M && isImage) {
        this.form.cloudFiles = file;
      }
    },

    async uploadFile() {
      let formData = new FormData();
      const { remark } = this.form;
      const { raw } = this.form.cloudFiles;
      const { subjectId } = this.$route.params;
      formData.append('file', raw);
      formData.append('subjectId', subjectId);
      formData.append('groupName', this.groupName);
      if (remark) formData.append('remark', remark);
      try {
        await this.$post(this.urls.cloud_file.create, formData);
        setTimeout(() => {
          this.$message.success('上传成功');
          this.$emit('update:dialog', false);
          this.$emit('handleSubmitClick', this.form);
        }, 1000);
      } catch (error) {
        this.$message.error('上传异常');
      }
      return formData;
    },

    // 超出限制个数提示
    handleExceed() {
      this.$message.warning('最多能上传1个');
    },
    // 文件异常
    handleFileError() {
      this.$message.warning('上传失败');
    },

    // 弹窗
    handleSubmitClick() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.disabledUpload = true;
          this.uploadFile();
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
      this.disabledUpload = false;
      this.form = this.formInit();
    },
    formInit() {
      return {
        remark: null,
        cloudFiles: null,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
