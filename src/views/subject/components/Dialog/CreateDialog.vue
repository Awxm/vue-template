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
      <el-form-item label="受试者姓名" prop="name">
        <el-input v-model="form.name" :placeholder="namePlaceholder" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" maxlength="11" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="性别" prop="secrecy">
        <el-radio-group v-model="form.secrecy">
          <el-radio v-for="item in secrecy" :key="item.itemValue" :label="item.itemValue">{{ item.itemText }}</el-radio>
        </el-radio-group>
      </el-form-item>
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
      <!-- <el-form-item label="癌种" prop="disease">
      </el-form-item> -->
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
import { mapGetters } from 'vuex';
import { phoneRegular } from '@u/regular';
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
    // 手机号验证
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('电话号码不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (phoneRegular(value)) {
            callback();
          } else {
            callback(new Error('电话号码格式不正确'));
          }
        }
      }, 100);
    };
    return {
      checkPhone,
      namePlaceholder: '请输入受试者姓名',
      stagePlaceholder: '请选择疾病分期',
      diseasePlaceholder: '请选择癌种分类',
      form: null,
    };
  },
  computed: {
    ...mapGetters(['dataDictionarty_code']),
    rules() {
      return {
        name: [{ required: true, message: this.namePlaceholder, trigger: 'blur' }],
        phone: [{ required: true, validator: this.checkPhone, trigger: 'blur' }],
        disease: [{ required: true, validator: this.diseasePlaceholder, trigger: 'blur' }],
      };
    },
    diseaseStaging() {
      return this.dataDictionarty_code['diseaseStaging'].items;
    },
    secrecy() {
      return this.dataDictionarty_code['secrecy'].items;
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
        name: null,
        secrecy: 'secrecy',
        disease: null,
        stage: null,
        phone: null,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
