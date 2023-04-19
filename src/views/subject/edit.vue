<template>
  <div class="app-container ms-subject-edit">
    <el-card class="ms-sube-slider" :body-style="{ padding: '0px 20px' }">
      <div slot="header" class="clearfix">
        <span>目录</span>
      </div>
      <ul class="ms-sube-slider-list">
        <li :class="{ active: active === 0, 'ms-sube-slider-item': true }" @click="scrollTo(0)">
          基本信息
        </li>
        <li :class="{ active: active === 1, 'ms-sube-slider-item': true }" @click="scrollTo(1)">
          疾病信息
        </li>
        <li :class="{ active: active === 2, 'ms-sube-slider-item': true }" @click="scrollTo(2)">
          病史信息
        </li>
        <li :class="{ active: active === 3, 'ms-sube-slider-item': true }" @click="scrollTo(3)">
          报告上传
        </li>
      </ul>
    </el-card>
    <div class="ms-sube-card">
      <div class="ms-sube-wrap">
        <!-- 基本信息 -->
        <div class="ms-sube-wrap-item">
          <basic-info ref="basicInfo" :info="info" :studyData="studyData" />
        </div>
        <!-- 疾病信息 -->
        <div class="ms-sube-wrap-item">
          <disease-info ref="diseaseInfo" :info="info" />
        </div>
        <!-- 病史记录 -->
        <div class="ms-sube-wrap-item">
          <history-info :info="info" />
        </div>
        <!-- 报告上传 -->
        <div class="ms-sube-wrap-item">
          <upload-report :info="info" />
        </div>
        <el-button class="btn-name" type="primary" @click="handleUpdateClick">更新</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BasicInfo from './components/BasicInfo.vue';
import DiseaseInfo from './components/DiseaseInfo.vue';
import HistoryInfo from './components/HistoryInfo.vue';
import UploadReport from './components/UploadReport.vue';
import _ from 'lodash';

export default {
  name: 'SubjectCreate',
  components: {
    BasicInfo,
    DiseaseInfo,
    HistoryInfo,
    UploadReport,
  },
  filters: {},
  props: {},
  data() {
    return {
      studyData: [],
      info: null,
      active: 0, // 当前激活的导航索引
    };
  },
  computed: {},
  watch: {},
  created() {
    this.studyList();
  },
  mounted() {
    // 监听滚动事件
    window.addEventListener('scroll', this.onScroll, true);
  },
  destroyed() {
    // 必须移除监听器，不然当该vue组件被销毁了，监听器还在就会出错
    window.removeEventListener('scroll', this.onScroll, true);
  },
  methods: {
    getInfo() {
      const { subjectId } = this.$route.params;
      this.$post(this.urls.subject.info, { subjectId })
        .then((result) => {
          this.info = result;
        })
        .catch(() => {});
    },
    studyList() {
      this.$post(this.urls.study.list, {})
        .then(({ data }) => {
          this.studyData = data;
          this.getInfo();
        })
        .catch(() => {});
    },
    async handleUpdateClick() {
      try {
        const isBasicInfo = await this.$refs.basicInfo.formValidate();
        const isDiseaseInfo = await this.$refs.diseaseInfo.formValidate();
        if (isBasicInfo && isDiseaseInfo) {
          this.$post(this.urls.subject.update, { ...this.info })
            .then(() => {
              this.$message.success('更新成功');
              this.getInfo();
            })
            .catch(() => {});
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    },

    // 滚动监听器
    onScroll: _.throttle(function() {
      const navContents = document.querySelectorAll('.ms-sube-wrap .ms-sube-wrap-item');
      const scrollTop = document.querySelector('.ms-sube-wrap').scrollTop;
      const clientHeight = document.querySelector('.ms-sube-wrap').clientHeight;
      const scrollview = document.querySelector('.ms-sube-wrap').scrollHeight;

      // // 所有锚点元素的 offsetTop
      const offsetTopArr = [];
      for (let index = 0; index < navContents.length; index++) {
        const element = navContents[index];
        offsetTopArr.push(element.offsetTop - 71);
      }
      // 获取当前文档流的 scrollTop
      // 定义当前点亮的导航下标
      let navIndex = 0;
      for (let n = 0; n < offsetTopArr.length; n++) {
        // 如果 scrollTop 大于等于第n个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
        if (scrollTop >= offsetTopArr[n]) navIndex = n; // 那么此时导航索引就应该是n了
        if (scrollTop + clientHeight === scrollview) navIndex = offsetTopArr.length - 1;
      }
      this.active = navIndex;
    }, 500),
    // 跳转到指定索引的元素
    scrollTo(index) {
      // 获取目标的 offsetTop
      // css选择器是从 1 开始计数，我们是从 0 开始，所以要 +1
      const targetOffsetTop =
        document.querySelector(`.ms-sube-wrap .ms-sube-wrap-item:nth-child(${index + 1})`).offsetTop - 71;
      // 获取当前 offsetTop
      let scrollTop = document.querySelector('.ms-sube-wrap').scrollTop;
      // 定义一次跳 50 个像素，数字越大跳得越快，但是会有掉帧得感觉，步子迈大了会扯到蛋
      const STEP = 50;
      // 判断是往下滑还是往上滑
      if (scrollTop > targetOffsetTop) {
        // 往上滑
        smoothUp();
      } else {
        // 往下滑
        smoothDown();
      }
      // 定义往下滑函数
      function smoothDown() {
        // 如果当前 scrollTop 小于 targetOffsetTop 说明视口还没滑到指定位置
        if (scrollTop < targetOffsetTop) {
          // 如果和目标相差距离大于等于 STEP 就跳 STEP
          // 否则直接跳到目标点，目标是为了防止跳过了。
          if (targetOffsetTop - scrollTop >= STEP) {
            scrollTop += STEP;
          } else {
            scrollTop = targetOffsetTop;
          }
          document.querySelector('.ms-sube-wrap').scrollTop = scrollTop;
          // 关于 requestAnimationFrame 可以自己查一下，在这种场景下，相比 setInterval 性价比更高
          requestAnimationFrame(smoothDown);
        }
      }
      // 定义往上滑函数
      function smoothUp() {
        if (scrollTop > targetOffsetTop) {
          if (scrollTop - targetOffsetTop >= STEP) {
            scrollTop -= STEP;
          } else {
            scrollTop = targetOffsetTop;
          }
          document.querySelector('.ms-sube-wrap').scrollTop = scrollTop;
          requestAnimationFrame(smoothUp);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.ms-subject-edit {
  display: flex;
  height: 100%;

  ul li {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .ms-sube-slider {
    flex-shrink: 0;
    width: 220px;
    height: 100%;
    border-radius: 10px;

    .active {
      color: #409eff;
    }

    &-item {
      margin-top: 20px;
      cursor: pointer;
    }
  }

  .ms-sube-card {
    box-sizing: border-box;
    flex: 1;
    margin-left: 20px;
    overflow: hidden;
    color: #303133;
    background-color: #fff;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgb(0, 0, 0, 0.1);
    transition: 0.3s;
  }

  .ms-sube-wrap {
    height: 100%;
    padding: 0 20px;
    overflow: auto;

    &-item {
      padding-top: 20px;
    }
  }
}
</style>
