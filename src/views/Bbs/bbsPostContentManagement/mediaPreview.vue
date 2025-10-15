<template>
  <div class="media-preview" v-if="attachments && attachments.length > 0">
    <div
      v-for="(attachment, index) in attachments"
      :key="index"
      class="media-item"
      @click="openMediaPreview(attachment)"
    >
      <el-image
        v-if="attachment.fileType === 'p'"
        :src="VITE_CDN_URL + attachment.url"
        :alt="`Image`"
        style="width: 100%; height: 100%; cursor: zoom-in; display: flex; justify-content: center; align-items: center"
        fit="scale-down"
        :preview-src-list="[VITE_CDN_URL + attachment.url]"
        :max-scale="7"
        :min-scale="1"
        :zoom-rate="1.2"
        preview-teleported
        class="el-image-show"
      >
        <template #error>
          <el-icon style="font-size: 50px"><Picture /></el-icon>
        </template>
      </el-image>
      <video v-else-if="attachment.fileType === 'v'" :src="VITE_CDN_URL + attachment.url" controls></video>
      <audio v-else-if="attachment.fileType === 's'" :src="VITE_CDN_URL + attachment.url" controls></audio>
      <el-icon v-else style="font-size: 36px; color: #606266">
        <Files />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Attachment {
  fileType: 'p' | 'v' | 's'
  url: string
}

const { VITE_PROXY_UPLOAD, VITE_SERVER_CALLBACK, VITE_CDN_URL, VITE_STORY_TYPE } = webConfigApi

const props = defineProps<{
  attachments: Attachment[]
}>()

const openMediaPreview = (attachment: Attachment) => {
  // Implement a modal or lightbox to show the full-size image
  console.log('Open media preview:', attachment)
  if (attachment.fileType !== 'p') {
    window.open(VITE_CDN_URL + attachment.url, '_blank')
  }
}
</script>

<style scoped>
.media-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.media-item {
  width: 50px;
  height: 60px;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 0 5px 0 rgba(5, 112, 244, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.media-item img,
.media-item video {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}

.media-item audio {
  width: 100%;
}
</style>
