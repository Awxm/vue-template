<template>
  <div class="study-inclusion">
    <table-template :tableData="tableData" />
  </div>
</template>

<script>
import TableTemplate from './Criteria/table.vue';
export default {
  name: 'StudyInclusionCriteria',
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
    return {
      content: null,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
