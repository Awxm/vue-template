<template>
  <el-card class="ms-subc-disease-info" :body-style="{ padding: '22px 20px 0' }">
    <div slot="header">
      <span>疾病信息</span>
    </div>
    <div class="ms-subc-disease-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="癌种分类" prop="disease">
              <el-select v-model="form.disease" :placeholder="diseasePlaceholder">
                <el-option-group v-for="group in cancerClassification" :key="group.itemValue" :label="group.itemText">
                  <el-option
                    v-for="item in group.chlids"
                    :key="item.itemValue"
                    :label="item.itemText"
                    :value="item.itemValue"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="疾病分期" prop="stage">
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="ECOG评分" prop="ecog">
              <el-select v-model="form.ecog" :placeholder="ecogPlaceholder">
                <el-option
                  v-for="item in ecogScoreStandard"
                  :key="item.itemValue"
                  :label="item.itemText"
                  :value="item.itemValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
export default {
  name: 'SubjectDiseaseInfo',
  components: {},
  filters: {},
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const diseasePlaceholder = '请选择癌种分类';
    const ecogPlaceholder = '请选择ECOG评分';
    const stagePlaceholder = '请选择疾病分期';
    return {
      form: {
        disease: null,
        stage: null,
        ecog: null,
      },
      rules: {
        ecog: [{ required: true, message: ecogPlaceholder, trigger: 'change' }],
        disease: [{ required: true, message: diseasePlaceholder, trigger: 'change' }],
      },
      diseasePlaceholder,
      ecogPlaceholder,
      stagePlaceholder,
    };
  },
  computed: {
    ...mapGetters(['dataDictionarty_code']),
    diseaseStaging() {
      return this.dataDictionarty_code['diseaseStaging'].items;
    },
    ecogScoreStandard() {
      return this.dataDictionarty_code['ECOGScoreStandard'].items;
    },
    // 癌种分类
    cancerClassification() {
      const cancerSubType = _.cloneDeep(this.dataDictionarty_code['cancerSubType'].items);
      const cancerTypeGroup = _.cloneDeep(this.dataDictionarty_code['cancerTypeGroup'].items);
      const data = cancerTypeGroup.map((ctg) => {
        const { itemValue } = ctg;
        ctg.chlids = [];
        cancerSubType.map((cst) => {
          const { cancerTypeGroupId } = cst;
          if (cancerTypeGroupId === itemValue) ctg.chlids.push(cst);
        });
        return ctg;
      });
      return data;
    },
  },
  watch: {
    info(val) {
      this.form = val;
    },
  },
  created() {},
  mounted() {},
  methods: {
    async formValidate() {
      return await this.$refs.form.validate();
    },
  },
};
</script>
