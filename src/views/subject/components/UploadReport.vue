<template>
  <div class="ms-subc-report">
    <el-card
      v-for="(tabel, index) in tableData"
      :key="index"
      style="margin: 20px 0"
      :body-style="{ padding: '0 20px 20px' }"
    >
      <div slot="header">
        <span> {{ tabel.itemText }} </span>
      </div>
      <div class="ms-subc-report">
        <el-row :gutter="16">
          <el-col
            v-for="report in tabel.report"
            :key="report.fileId"
            style="margin-top: 20px;"
            :span="3"
            :xl="{ span: 3 }"
            :lg="{ span: 4 }"
            :md="{ span: 6 }"
            :sm="{ span: 8 }"
          >
            <div class="report-item" :title="report.remark">
              <el-image style="width: 100%; height: 100%" :src="report.fileUrl" fit="cover" />
              <div v-if="report.remark" class="report-item-title">{{ report.remark }}</div>
              <span class="report-item-actions">
                <!-- <span class="report-item__preview"><i class="el-icon-zoom-in"></i></span> -->
                <span class="report-item__delete" @click="handleDeledClick(report)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-col>
          <el-col
            style="margin-top: 20px;"
            :span="3"
            :xl="{ span: 3 }"
            :lg="{ span: 4 }"
            :md="{ span: 6 }"
            :sm="{ span: 8 }"
          >
            <div class="report-create" @click="handleReportCreate(tabel)">
              <i class="el-icon-plus"></i>
              <span>添加{{ tabel.itemText }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <upload-dialog
      :dialog.sync="dialog"
      :title="title"
      :formData.sync="formData"
      :dialogType="dialogType"
      :groupName="groupName"
      @handleSubmitClick="handleReportSubmitClick"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import UploadDialog from './Dialog/UploadDialog.vue';
export default {
  name: 'SubjectUploadReport',
  components: { UploadDialog },
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
      // 弹窗
      dialog: false,
      formData: null,
      title: null,
      dialogType: null,
      groupName: null,
    };
  },
  computed: {
    ...mapGetters(['dataDictionarty_code']),
  },
  watch: {},
  created() {
    this.cloudFileList();
  },
  mounted() {},
  methods: {
    cloudFileList() {
      const { subjectId } = this.$route.params;
      this.$post(this.urls.cloud_file.list, { subjectId })
        .then((data) => {
          const { subjectReport } = _.cloneDeep(this.dataDictionarty_code);
          const tableData = subjectReport.items;
          for (let index = 0; index < tableData.length; index++) {
            const { itemValue } = tableData[index];
            tableData[index].report = [];
            if (data[itemValue]) tableData[index].report = data[itemValue];
          }
          this.tableData = tableData;
        })
        .catch(() => {});
    },
    handleReportCreate(tabel) {
      const { itemText, itemValue } = tabel;
      this.groupName = itemValue;
      this.title = `创建${itemText}`;
      this.dialog = true;
      this.dialogType = 'create';
    },
    // 删除
    handleDeledClick(report) {
      const { fileId } = report;
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const { subjectId } = this.$route.params;
          this.$post(this.urls.cloud_file.delete, { subjectId, fileId })
            .then(() => {
              this.$message.success('删除成功');
              this.cloudFileList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    //
    handleReportSubmitClick() {
      this.cloudFileList();
    },
  },
};
</script>
<style scoped lang="scss">
.ms-subc-report {
  .report-item {
    position: relative;
    height: 100px;

    ::v-deep .el-image {
      display: block;
    }

    &-title {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 24px;
      padding: 0 12px;
      overflow: hidden;
      font-size: 14px;
      line-height: 24px;
      color: #fff;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: rgba(51, 51, 51, 0.6);
    }

    &-actions {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 20px;
      color: #fff;
      text-align: center;
      cursor: default;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;

      &::after {
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        content: '';
      }

      &:hover {
        opacity: 1;

        span {
          display: inline-block;
        }
      }

      span {
        display: none;
        line-height: 1.8;
        cursor: pointer;
      }
    }
  }

  .report-create {
    height: 100%;
    font-size: 12px;
    line-height: 100px;
    text-align: center;
    cursor: pointer;
    border: 1px solid #eaecf1;
    border-radius: 4px;

    i {
      margin-right: 8px;
    }
  }
}
</style>
