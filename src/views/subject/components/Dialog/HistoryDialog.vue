<template>
  <el-dialog
    center
    :title="isCreate ? '创建病史信息' : '编辑病史信息'"
    width="560px"
    :visible.sync="dialog"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    @closed="handleClosed"
  >
    <el-form ref="form" label-position="right" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="病例时间" prop="caseTime">
        <el-date-picker
          v-model="form.caseTime"
          type="datetime"
          :placeholder="caseTimePlaceholder"
          default-time="12:00:00"
        />
      </el-form-item>
      <el-form-item label="病例内容" prop="historyContent">
        <el-input v-model="form.historyContent" type="textarea" :rows="2" :placeholder="historyContentPlaceholder" />
      </el-form-item>
      <el-form-item label="病例报告">
        <el-upload
          ref="upload"
          accept=".jpg, .jpeg, .png"
          drag
          multiple
          :limit="9"
          :auto-upload="false"
          :file-list="form.cloudFiles"
          action="#"
          :disabled="disabledUpload"
          :on-exceed="handleExceed"
          :on-error="handleFileError"
          :on-change="handleUploadChange"
          :on-remove="handleRemove"
          :before-remove="handleBeforeRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" style="margin-top: -10px;line-height: 20px;">
            将文件拖到此处，
            <div v-if="!disabledUpload"><em>注意：单个文件需小于2M,一次最多上传9个文件</em></div>
            <div v-else><em>文件正在上传中，请等待...</em></div>
          </div>
        </el-upload>
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
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: null,
      fileList: [],
      caseTimePlaceholder: '请选择病例时间',
      historyContentPlaceholder: '请输入病史记录',
      // 优化处理
      time: null, // change事件是否结束 是否可以直接调手动上传事件（目前设置1.5s）
      disabledUpload: false, // 正在上传中 禁止再次选择文件上传
    };
  },
  computed: {
    rules() {
      return {
        caseTime: [{ required: true, message: this.caseTimePlaceholder, trigger: 'blur' }],
        historyContent: [{ required: true, message: this.historyContentPlaceholder, trigger: 'blur' }],
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
    handleUploadChange(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 2M');
      }
      if (!(file.name.indexOf('.jpg') > -1 || file.name.indexOf('.png') > -1 || file.name.indexOf('.jpeg') > -1)) {
        this.$message.warning('当前仅支持.jpg, .jpeg, .png格式的文件上传');
      }
      if (this.time) clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.time = null;
        // 符合条件的进入待传列表
        if (this.isCreate) this.form.cloudFiles = [];
        for (let index = 0; index < fileList.length; index++) {
          const { raw, name, size } = fileList[index];
          if (
            raw &&
            size / 1024 / 1024 < 2 &&
            (name.indexOf('.jpg') > -1 || name.indexOf('.png') > -1 || name.indexOf('.jpeg') > -1)
          ) {
            this.form.cloudFiles.push(fileList[index]);
          }
        }
      }, 1000);
    },
    // 上传
    async uploadFile() {
      let formData = new FormData();
      const { caseTime, historyContent, cloudFiles, historyId } = this.form;
      const { subjectId } = this.$route.params;
      let uploadCloudFile = [];
      for (let index = 0; index < cloudFiles.length; index++) {
        const { raw, fileId } = cloudFiles[index];
        if (raw) formData.append('files', raw);
        if (fileId) uploadCloudFile.push(cloudFiles[index]);
      }
      formData.append('caseTime', caseTime);
      formData.append('historyContent', historyContent);
      formData.append('subjectId', subjectId);
      formData.append('cloudFiles', JSON.stringify(uploadCloudFile));
      if (historyId) formData.append('historyId', historyId);
      try {
        await this.$post(this.urls.history[this.isCreate ? 'create' : 'update'], formData);
        setTimeout(() => {
          this.$message.success('上传成功');
          this.$emit('update:dialog', false);
          this.$emit('handleSubmitClick', this.form);
        }, 1000);
      } catch (error) {
        this.disabledUpload = false;
        this.$message.error('上传异常');
      }
      return formData;
    },
    // 删除
    handleRemove(file, fileList) {
      this.form.cloudFiles = fileList;
    },
    handleBeforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 超出限制个数提示
    handleExceed() {
      this.$message.warning('最多能上传九个');
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
        caseTime: null,
        historyContent: null,
        cloudFiles: [],
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
