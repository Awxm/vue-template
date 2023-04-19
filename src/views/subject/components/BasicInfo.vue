<template>
  <el-card class="ms-subc-basic-info" :body-style="{ padding: '22px 20px 0' }">
    <div slot="header">
      <span>基本信息</span>
    </div>
    <div class="ms-subc-basic-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="受试者姓名" prop="name">
              <el-input v-model="form.name" :placeholder="namePlaceholder" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首字母缩写" prop="acronym">
              <el-input v-model="form.acronym" :placeholder="acronymPlaceholder" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="secrecy">
              <el-radio-group v-model="form.secrecy">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
                <el-radio label="secrecy">未知</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" :placeholder="phonePlaceholde" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="研究中心" prop="siteId">
              <el-select v-model="form.siteId" placeholder="请选择活动区域">
                <el-option v-for="item in studyData" :key="item.studyId" :label="item.name" :value="item.studyId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="form.age" :placeholder="agePlaceholder" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="意向省份" prop="intentionProvince">
              <el-select v-model="form.intentionProvince" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源" prop="source">
              <el-autocomplete
                v-model="form.source"
                :fetch-suggestions="querySearch"
                :placeholder="sourcePlaceholder"
                class="ms-subc-basic-autocomplete"
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <div>{{ item.itemText }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" :placeholder="addressPlaceholder" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { phoneRegular } from '@u/regular';
import { mapGetters } from 'vuex';
export default {
  name: 'SubjectBasicInfo',
  components: {},
  filters: {},
  props: {
    studyData: {
      type: Array,
      default: () => [],
    },
    info: {
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
    const namePlaceholder = '请输入受试者姓名';
    const agePlaceholder = '请输入年龄';
    const phonePlaceholde = '请输入联系电话';
    const siteIdPlaceholder = '请选择研究Id';
    const acronymPlaceholder = '请输入首字母缩写';
    const sourcePlaceholder = '请输入来源';
    const addressPlaceholder = '请输入地址';
    return {
      form: {
        name: null,
        phone: null,
        secrecy: 'secrecy',
        siteId: null,
        intentionProvince: null,
        age: null,
        source: null,
        address: null,
        acronym: null,
      },
      rules: {
        name: [{ required: true, message: namePlaceholder, trigger: 'blur' }],
        phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        siteId: [{ required: true, message: siteIdPlaceholder, trigger: 'change' }],
      },
      restaurants: [],
      namePlaceholder,
      agePlaceholder,
      phonePlaceholde,
      siteIdPlaceholder,
      acronymPlaceholder,
      sourcePlaceholder,
      addressPlaceholder,
    };
  },
  computed: {
    ...mapGetters(['dataDictionarty_code']),
    source() {
      return this.dataDictionarty_code['source'].items;
    },
  },
  watch: {
    info(val) {
      this.form = val;
    },
    source: {
      handler(value) {
        this.restaurants = value;
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.itemValue.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    handleSelect({ itemText }) {
      this.form.source = itemText;
    },
    async formValidate() {
      return await this.$refs.form.validate();
    },
  },
};
</script>
<style lang="scss" scoped>
.ms-subc-basic-autocomplete {
  width: 100%;
}
</style>
