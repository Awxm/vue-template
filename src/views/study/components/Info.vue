<template>
  <el-card class="info">
    <template slot="header">
      <div class="el-card__title">
        实验基础信息
      </div>
    </template>
    <el-form ref="form" label-position="right" label-suffix="：" label-width="160px" :rules="rules" :model="form">
      <!-- 试验名称 介绍  -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="试验名称" prop="name">
            <el-input v-model="form.name" type="textarea" :rows="2" :placeholder="namePlaceholder" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="试验题目" :rows="2" prop="introduction">
            <el-input v-model="form.introduction" type="textarea" :rows="2" :placeholder="introductionPlaceholder" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 登记号 治疗方案 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="登记号" prop="registrationNo">
            <el-input v-model="form.registrationNo" :placeholder="registrationNoPlaceholder" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="治疗方案" prop="therapeuticSchedule">
            <el-input
              v-model="form.therapeuticSchedule"
              type="textarea"
              :rows="1"
              :placeholder="therapeuticSchedulePlaceholder"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!--  试验分期 试验目的 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="试验分期" prop="stage">
            <el-select v-model="form.stage" :placeholder="stagePlaceholder">
              <el-option
                v-for="item in diseaseStaging"
                :key="item.itemValue"
                :label="item.itemText"
                :value="item.itemValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="试验目的" prop="purpose">
            <el-input v-model="form.purpose" :disabled="disabled" :placeholder="purposePlaceholder" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 项目编号 方案类型 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目编号" prop="protocolNo">
            <el-input v-model="form.protocolNo" :disabled="disabled" :placeholder="protocolNoPlaceholder" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方案类型" prop="protocolType">
            <el-input v-model="form.protocolType" :disabled="disabled" :placeholder="protocolTypePlaceholder" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 申办方 主要研究者 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="申办方" prop="sponsor">
            <el-select v-model="form.sponsor" :disabled="disabled" :placeholder="sponsorPlaceholder">
              <el-option v-for="(item, index) in sponsor" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="主要研究者" prop="principalInvestigator">
            <el-input
              v-model="form.principalInvestigator"
              :disabled="disabled"
              :placeholder="principalInvestigatorPlaceholder"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!--  研究开始时间 研究结束时间 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="研究开始时间" prop="plannedStartDate">
            <el-date-picker
              v-model="form.plannedStartDate"
              :disabled="disabled"
              type="datetime"
              :placeholder="plannedStartDatePlaceholder"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="研究结束时间" prop="plannedEndDate">
            <el-date-picker
              v-model="form.plannedEndDate"
              :disabled="disabled"
              type="datetime"
              :placeholder="plannedEndDatePlaceholder"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 入组人数 当前入组人数 进度 -->
      <el-row>
        <el-col :span="8">
          <el-form-item v-cloak label="入组人数" prop="expectedEnrollment">
            <el-input
              v-model="form.expectedEnrollment"
              :disabled="disabled"
              :placeholder="expectedEnrollmentPlaceholder"
              @input="handleInput($event, 'expectedEnrollment')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="当前入组人数" prop="actualEnrollment">
            <el-input
              v-model="form.actualEnrollment"
              :disabled="disabled"
              :placeholder="actualEnrollmentPlaceholder"
              @input="handleInput($event, 'actualEnrollment')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 招募费用 备注 进度 -->
      <el-row>
        <el-col :span="8">
          <el-form-item v-cloak label="招募费用" prop="recruitmentFee">
            <el-input
              v-model="form.recruitmentFee"
              :disabled="disabled"
              :placeholder="recruitmentFeePlaceholder"
              @input="handleInputTwoDigitRegular($event, 'recruitmentFee')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="进度" prop="progress">
            <el-input v-model="form.progress" :disabled="disabled" :placeholder="progressPlaceholder" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :placeholder="remarkPlaceholder" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { integerRegular, twoDigitRegular } from '@u/regular.js';
import _ from 'lodash';
import { mapGetters } from 'vuex';
// import StaticInput from './components/StaticInput';
export default {
  name: 'StudyInfo',
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
      namePlaceholder: '请输入试验名称',
      introductionPlaceholder: '请输入介绍',
      registrationNoPlaceholder: '请输入登记号',
      therapeuticSchedulePlaceholder: '请输入治疗方案',
      stagePlaceholder: '请输入试验分期',
      purposePlaceholder: '请输入试验目的',
      protocolNoPlaceholder: '请输入项目编号',
      protocolTypePlaceholder: '请输入方案类型',
      protocolVersionPlaceholder: '请输入版本',
      sponsorPlaceholder: '请选择申办方',
      principalInvestigatorPlaceholder: '请输入主要研究者',
      plannedStartDatePlaceholder: '请输入研究开始时间',
      plannedEndDatePlaceholder: '请输入研究结束时间',
      expectedEnrollmentPlaceholder: '请输入入组人数',
      actualEnrollmentPlaceholder: '请输入当前入组人数',
      progressPlaceholder: '请输入进度',
      recruitmentFeePlaceholder: '请输入招募费用',
      remarkPlaceholder: '请输入备注',
    };
  },
  computed: {
    ...mapGetters(['dataDictionarty_code']),
    // 必填规则
    rules() {
      return {
        name: [{ required: true, message: this.namePlaceholder, trigger: 'change' }],
        introduction: [{ required: true, message: this.introductionPlaceholder, trigger: 'change' }],
        registrationNo: [{ required: true, message: this.registrationNoPlaceholder, trigger: 'change' }],
        // therapeuticSchedule: [{ required: true, message: this.therapeuticSchedulePlaceholder, trigger: 'change' }],
        stage: [{ required: true, message: this.stagePlaceholder, trigger: 'change' }],
        // purpose: [{ required: true, message: this.purposePlaceholder, trigger: 'change' }],
        protocolNo: [{ required: true, message: this.protocolNoPlaceholder, trigger: 'change' }],
        // protocolType: [{ required: true, message: this.protocolTypePlaceholder, trigger: 'change' }],
        // protocolVersion: [{ required: true, message: this.protocolVersionPlaceholder, trigger: 'change' }],
        sponsor: [{ required: true, message: this.sponsorPlaceholder, trigger: 'change' }],
        // principalInvestigator: [{ required: true, message: this.principalInvestigatorPlaceholder, trigger: 'change' }],
        // plannedStartDate: [{ required: true, message: this.plannedStartDatePlaceholder, trigger: 'change' }],
        // plannedEndDate: [{ required: true, message: this.plannedEndDatePlaceholder, trigger: 'change' }],
        // expectedEnrollment: [{ required: true, message: this.expectedEnrollmentPlaceholder, trigger: 'change' }],
        // actualEnrollment: [{ required: true, message: this.actualEnrollmentPlaceholder, trigger: 'change' }],
        // progress: [{ required: true, message: this.progressPlaceholder, trigger: 'change' }],
        // recruitmentFee: [{ required: true, message: this.recruitmentFeePlaceholder, trigger: 'change' }],
        // remark: [{ required: true, message: this.remarkPlaceholder, trigger: 'change' }],
      };
    },
    sponsor() {
      return [
        '君实',
        '特瑞思',
        '信达',
        '东曜',
        '新码生物',
        '东阳光药业',
        '康方',
        '嘉和生物',
        '美雅珂生物',
        '康方',
        '信达',
        '合生',
        '科济',
        '美雅柯',
        '信达',
        '德琪医药',
        '康方',
        '必贝特',
        '苏州韬略',
        '葆元生物',
        '康方',
        '启德医药',
        '以岭药业',
        '优卡迪',
        '华兰生物',
        '默沙东',
        '科技生物',
        '新码生物',
        '科伦',
        '润新生物',
        '天广实生物',
        '领晟医药',
        '华博生物医药技术（上海）有限公司',
        '卡替',
      ];
    },

    diseaseStaging() {
      return this.dataDictionarty_code['diseaseStaging'].items;
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
    handleInput(value, type) {
      this.form[type] = integerRegular(value);
    },
    handleInputTwoDigitRegular(value, type) {
      this.form[type] = twoDigitRegular(value);
    },
    async formValidate() {
      return await this.$refs.form.validate();
    },

    formInit() {
      return {
        name: null, // 试验名称
        introduction: null, // 介绍
        registrationNo: null, // 登记号
        therapeuticSchedule: null, // 治疗方案
        stage: null, // 试验分期
        purpose: null, // 试验目的
        protocolNo: null, // 项目编号
        protocolType: null, // 方案类型
        protocolVersion: null, // 版本
        sponsor: null, // 申办方
        principalInvestigator: null, // 主要研究者
        plannedStartDate: null, // 研究开始时间
        plannedEndDate: null, // 研究结束时间
        expectedEnrollment: null, // 入组人数
        actualEnrollment: null, // 当前入组人数
        progress: null, // 进度
        recruitmentFee: null, // 招募费用
        remark: null, // 备注
        status: null, // 状态
      };
    },
  },
};
</script>
