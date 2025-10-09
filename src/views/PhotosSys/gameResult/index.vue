<script setup lang="ts">
import History from './history.vue'
import Review from './review.vue'
import Calendar from './calendar.vue'

const pageRadio = ref('history')
</script>

<template>
  <el-radio-group v-model="pageRadio" class="select-page-radio">
    <el-radio-button value="history">开奖历史</el-radio-button>
    <el-radio-button value="review">开奖结果</el-radio-button>
    <el-radio-button value="calendar">开奖日期</el-radio-button>
  </el-radio-group>
  <History v-show="pageRadio === 'history'" />
  <Review v-show="pageRadio === 'review'" />
  <Calendar v-show="pageRadio === 'calendar'" />
</template>

<style scoped>
.select-page-radio {
  margin-bottom: 20px;
}
</style>
