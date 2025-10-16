<template>
  <div id="look">
    <videos :videoSrc="$route.query.mediumId" :type="$route.query.type" ref="videoRef" />
  </div>
</template>
<script setup lang="ts">
import videos from '@/components/common/video.vue'
</script>
<style scoped lang="less">
#look {
  width: 100%;
  height: 100%;
}
</style>
