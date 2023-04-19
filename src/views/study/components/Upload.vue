<template>
  <el-card class="upload">
    <template slot="header">
      <div class="el-card__title">
        原始报告
      </div>
    </template>
    <el-upload
      ref="upload"
      accept=".pdf"
      drag
      action="#"
      :limit="1"
      :auto-upload="false"
      :file-list="form.cloudFiles ? [form.cloudFiles] : []"
      :disabled="disabledUpload"
      :on-exceed="handleExceed"
      :on-error="handleFileError"
      :on-remove="handleRemove"
      :on-change="handleUploadChange"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" style="margin-top: -10px;line-height: 20px;">
        将文件拖到此处，
        <div v-if="!disabledUpload"><em>注意：文件需小于5M</em></div>
        <div v-else><em>文件正在上传中，请等待...</em></div>
      </div>
    </el-upload>
  </el-card>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'StudyUpload',
  components: {},
  filters: {},
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: null,
      // 提示Placeholder
      cloudFilesPlaceholder: '请上传原始报告',
      // 图片上传
      time: null, // change事件是否结束 是否可以直接调手动上传事件（目前设置1.5s）
      disabledUpload: false, // 正在上传中 禁止再次选择文件上传
    };
  },
  computed: {
    // 必填规则
    rules() {
      return {
        cloudFiles: [{ required: true, message: this.cloudFilesPlaceholder, trigger: 'change' }],
      };
    },
  },
  watch: {
    'formData.cloudFile': {
      handler(cloudFile) {
        if (cloudFile) {
          const { fileName, fileUrl, fileId } = _.cloneDeep(cloudFile);
          this.form = { cloudFiles: { name: fileName, url: fileUrl, fileId } };
        } else this.form = this.formInit();
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
      const isLt2M = size / 1024 / 1024 < 5;
      const isImage = name.indexOf('.pdf') > -1;
      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 5M');
      }
      if (!isImage) {
        this.$message.warning('当前仅支持.pdf格式的文件上传');
      }
      if (raw && isLt2M && isImage) {
        this.form.cloudFiles = file;
      }
    },
    // 删除
    handleRemove() {
      this.form.cloudFiles = null;
    },
    // 超出限制个数提示
    handleExceed() {
      this.$message.warning('最多能上传1个');
    },
    // 文件异常
    handleFileError() {
      this.$message.warning('上传失败');
    },

    formInit() {
      return {
        cloudFiles: null, // 试验名称
      };
    },
  },
};
</script>
