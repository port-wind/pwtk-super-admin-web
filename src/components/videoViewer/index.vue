<template>
  <div class="video-viewer">
    <video
      :src="videoSource"
      :poster="posterImage"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      ref="videoPlayer"
      controls
    ></video>
    <div class="video-controls">
      <button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button>
      <input type="range" :value="currentTime" :max="duration" @input="onSeek" />
      <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

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
    const isPlaying = ref(false)
    const duration = ref(0)
    const currentTime = ref(0)

    const togglePlay = () => {
      if (videoPlayer.value.paused) {
        videoPlayer.value.play()
        isPlaying.value = true
      } else {
        videoPlayer.value.pause()
        isPlaying.value = false
      }
    }

    const onLoadedMetadata = () => {
      duration.value = videoPlayer.value.duration
    }

    const onTimeUpdate = () => {
      currentTime.value = videoPlayer.value.currentTime
    }

    const onSeek = (event) => {
      videoPlayer.value.currentTime = event.target.value
    }

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return {
      videoPlayer,
      isPlaying,
      duration,
      currentTime,
      togglePlay,
      onLoadedMetadata,
      onTimeUpdate,
      onSeek,
      formatTime
    }
  }
}
</script>

<style scoped>
.video-viewer {
  max-width: 100%;
  height: 100%;
}
video {
  width: 100%;
  height: 100%;
}
.video-controls {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
