<template>
  <div class="no_page">
    <img class="no_img" src="@/assets/images/404.svg" alt="" />
    <p>{{ t('com.Sorrypagenotexist') }}</p>
    <div class="no_a">
      <router-link to="/home">
        <el-button type="primary">{{ t('com.homepage') }}</el-button>
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
</script>
<style scoped lang="less">
.no_page {
  text-align: center;
  height: 100%;
  .no_img {
    margin-top: 5%;
    width: 400px;
  }
  p {
    color: #909399;
  }
  .no_a {
    margin-top: 20px;
  }
}
</style>
