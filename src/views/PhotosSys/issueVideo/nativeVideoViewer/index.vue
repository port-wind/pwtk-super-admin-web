<template>
  <div class="video-viewer">
    <video
      :src="videoSource"
      :poster="posterImage"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      ref="videoPlayer"
      controls
      style="border: 1px solid #e2e8f0; border-radius: 10px"
    ></video>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'VideoViewer',
  props: {
    videoSource: {
      type: String,
      required: true
    },
    posterImage: {
      type: String,
      default: ''
    }
  },
  setup() {
    const videoPlayer = ref(null)
    const duration = ref(0)
    const currentTime = ref(0)

    const onLoadedMetadata = () => {
      duration.value = videoPlayer.value.duration
    }

    const onTimeUpdate = () => {
      currentTime.value = videoPlayer.value.currentTime
    }

    return {
      videoPlayer,
      duration,
      currentTime,
      onLoadedMetadata,
      onTimeUpdate
    }
  }
}
</script>

<style scoped>
.video-viewer {
  max-width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}
video {
  width: 100%;
  max-height: 500px;
  flex: 1;
}
.video-controls {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
