<template>
  <div class="study-exclusion">
    <table-template :tableData="tableData" />
  </div>
</template>

<script>
import TableTemplate from './Criteria/table.vue';
export default {
  name: 'StudyExclusionCriteria',
  components: {
    TableTemplate,
  },
  filters: {},
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
