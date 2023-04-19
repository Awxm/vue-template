<template>
  <div class="el-input el-input--medium is-disabled">
    <div class="el-input__inner">
      {{ value }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZhStaticInput',
  props: {
    value: {
      type: [Number, String],
      default: () => {},
    },
  },
};
</script>
