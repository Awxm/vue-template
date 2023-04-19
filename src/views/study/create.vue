<template>
  <div class="app-container study-create">
    <div class="study-create-wrap">
      <!-- 研究信息 -->
      <study-create-info ref="studyInfo" />
      <!-- 研究配置 -->
      <el-card style="margin:20px 0;">
        <template slot="header">
          <div class="el-card__title">入排标准、实验中心</div>
        </template>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <template v-for="item in tabs">
            <el-tab-pane v-if="item.show" :key="item.name" :name="item.name" lazy>
              <span slot="label"> {{ item.label }}</span>
            </el-tab-pane>
          </template>
        </el-tabs>
        <study-inclusion-criteria
          v-show="activeName === 'exclusionCriteria'"
          :tableData="exclusionCriteria"
          @handleChange="handleChange($event, 'exclusionCriteria')"
        />
        <study-exclusion-criteria
          v-show="activeName === 'inclusionCriteria'"
          :tableData="inclusionCriteria"
          @handleChange="handleChange($event, 'inclusionCriteria')"
        />
        <study-site v-show="activeName === 'site'" ref="site" :tableData="studySite" @handleChange="handleChange" />
      </el-card>
      <!-- 原始报告 -->
      <study-upload ref="studyUpload" />
    </div>
    <div class="study-create-operation">
      <el-button type="primary" @click="handleSubmitClick">创建</el-button>
    </div>
  </div>
</template>

<script>
import StudyCreateInfo from './components/Info';
import StudySite from './components/Site';
import StudyUpload from './components/Upload';
import StudyExclusionCriteria from './components/ExclusionCriteria';
import StudyInclusionCriteria from './components/InclusionCriteria';
export default {
  name: 'StudyCreate',
  components: { StudyCreateInfo, StudyInclusionCriteria, StudyExclusionCriteria, StudySite, StudyUpload },
  filters: {},
  props: {},
  data() {
    return {
      activeName: 'exclusionCriteria',
      show: false,
      tabs: [
        {
          label: '入组标准',
          name: 'exclusionCriteria',
          show: true,
        },
        {
          label: '排除标准',
          name: 'inclusionCriteria',
          show: true,
        },
        {
          label: '试验中心',
          name: 'site',
          show: true,
        },
      ],
      exclusionCriteria: [],
      inclusionCriteria: [],
      studySite: [],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleTabClick({ name: activeName }) {
      this.activeName = activeName;
      this.activeComponent = this.queryActiveNameComponent(activeName);
    },

    // 根据activeName查询组件
    queryActiveNameComponent(activeName) {
      const { component } = this.tabs.find((item) => item.name === activeName);
      return component;
    },

    // 研究
    async handleSubmitClick() {
      try {
        const cloudFiles = this.$refs.studyUpload.form.cloudFiles;
        const isStudyInfo = await this.$refs.studyInfo.formValidate();
        if (this.exclusionCriteria.length === 0 && this.inclusionCriteria.length === 0) {
          this.$message.error('请完善入组标准或排除标准');
        } else if (this.studySite.length === 0) {
          this.$message.error('请完善试验中心');
        } else if (cloudFiles === null) {
          this.$message.error('请上传原始报告');
        } else if (isStudyInfo) {
          let formData = new FormData();
          const { raw } = cloudFiles;
          if (raw) formData.append('file', raw);
          formData.append('exclusionCriteria', JSON.stringify(this.exclusionCriteria));
          formData.append('inclusionCriteria', JSON.stringify(this.inclusionCriteria));
          formData.append('studySite', JSON.stringify(this.studySite));
          for (const key in this.$refs.studyInfo.form) {
            if (
              (this.$refs.studyInfo.form[key] ?? '') !== '' &&
              !['inclusionCriteria', 'studySite', 'exclusionCriteria', 'cloudFile'].includes(key)
            ) {
              formData.append(key, this.$refs.studyInfo.form[key]);
            }
          }
          await this.$post(this.urls.study.create, formData);
          this.$router.go(-1);
          this.$message.success('添加成功');
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    },

    // change
    handleChange(value, type) {
      this[type].content = value;
    },
  },
};
</script>
<style lang="scss" scoped>
.study-create {
  position: relative;
  padding: 0;
  overflow: hidden;

  &-wrap {
    position: absolute;
    top: 0;
    bottom: 80px;
    width: 100%;
    padding: 20px;
    overflow: auto;
  }

  &-operation {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.08);
  }
}
</style>
