<template>
  <div
    @click="handleFileClick"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
    style="width: 100%; height: 100%"
  >
    <div class="file-item">
      <img v-if="fileType === 'image'" class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
      <el-icon v-else-if="fileType === 'video' && !isHovered" style="font-size: 36px; color: #606266">
        <VideoCamera />
      </el-icon>
      <video v-else-if="fileType === 'video' && isHovered" style="width: 100%; height: 100%" :src="file.url"></video>
      <el-icon v-else-if="fileType === 'audio'" style="font-size: 36px; color: #606266">
        <Headset />
      </el-icon>
      <el-icon v-else style="font-size: 36px; color: #606266">
        <Files />
      </el-icon>
      <span class="el-upload-list__item-actions">
        <span class="el-upload-list__item-preview" @click="handleViewContent(file)">
          <el-icon><View /></el-icon>
        </span>
        <span class="el-upload-list__item-delete" @click="handleRemove(file)">
          <el-icon><Delete /></el-icon>
        </span>
      </span>
    </div>

    <!-- <img
        v-if="fileType === 'image'"
        class="file-thumbnail"
        :src="file.url"
        :alt="file.name"
      /> -->

    <!-- <div
        v-else-if="fileType === 'video'"
        class="file-icon video-icon"
      >
        <el-icon><VideoCamera /></el-icon>
      </div> -->

    <!-- <div
        v-else-if="fileType === 'audio'"
        class="file-icon audio-icon"
      >
        <el-icon><Headset /></el-icon>
      </div>

      <div
        v-else-if="fileType === 'zip'"
        class="file-icon zip-icon"
      >
        <el-icon><Files /></el-icon>
      </div>

      <div
        v-else-if="fileType === 'pdf'"
        class="file-icon pdf-icon"
      >
        <el-icon><Document /></el-icon>
      </div>

      <div
        v-else
        class="file-icon default-icon"
      >
        <el-icon><Document /></el-icon>
      </div> -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Delete, VideoCamera, Headset, Files, Document } from '@element-plus/icons-vue'

const props = defineProps({
  file: {
    type: Object,
    required: true
  }
})
const isHovered = ref(false)
const emit = defineEmits(['remove', 'view-content'])

const fileTypes = {
  image: /\.(jpeg|jpg|gif|png)$/i,
  video: /\.(mp4|webm|ogg)$/i,
  audio: /\.(mp3|wav|ogg)$/i,
  zip: /\.(zip|rar|7z)$/i,
  pdf: /\.pdf$/i
}

const fileType = computed(() => {
  for (const [type, regex] of Object.entries(fileTypes)) {
    if (regex.test(props.file.name)) return type
  }
  return 'default'
})

const handleRemove = () => {
  emit('remove', props.file)
}

const handleViewContent = () => {
  window.open(props.file.url, '_blank')
}
</script>

<style lang="less" scoped>
.file-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
