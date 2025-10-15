<template>
  <div class="main">
    <div class="line">
      <Line></Line>
    </div>
    <div class="bar">
      <Bar></Bar>
    </div>
  </div>
</template>

<script setup lang="ts">
import Line from './line/index.vue'
import Bar from './bar/index.vue'
</script>

<style scoped lang="less">
.main {
  display: flex;
  height: 100%;
  background: #fff;

  .line {
    width: 100%;
    height: 100%;
  }

  .bar {
    width: 100%;
    height: 100%;
  }
}
</style>
