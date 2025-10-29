<template>
  <div :class="['icon-toggle', { 'icon-toggle-disabled': loading }]" @click="toggle">
    <img :src="currentIcon" :style="imageStyle" />
  </div>
</template>

<script setup lang="ts">
import { filterColor } from '@/const/commonSet'
import { ref, computed } from 'vue'
import { clickDisabled, useCommentsState } from '@/stores/commentsState'
import { clickPhotoGroupDisabled, usePhotoGroupState } from '@/stores/photoGroupState'
const props = defineProps({
  inactiveIcon: { type: String, required: true },
  activeIcon: { type: String, required: true },
  inactiveColor: { type: String, required: true },
  activeColor: { type: String, required: true },
  initialState: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  postType: { type: String, default: 'p' }
})

const postType = ref(props.postType)
const { photoGroupState: commentsState } =
  postType.value === 'a' ? usePhotoGroupState() : { photoGroupState: useCommentsState().commentsState }

const emit = defineEmits(['update:initialState', 'toggle'])

const isActive = computed({
  get: () => props.initialState,
  set: (val) => {
    // emit('update:initialState', val)
  }
})

const currentIcon = computed(() => (isActive.value ? props.activeIcon : props.inactiveIcon))

const imageStyle = computed(() => ({
  filter: isActive.value ? generateFilter(props.activeColor) : generateFilter(props.inactiveColor)
}))

const toggle = () => {
  if (props.loading || commentsState.disabledAction) {
    if (commentsState.disabledAction) {
      postType.value === 'a' ? clickPhotoGroupDisabled() : clickDisabled()
    }
    return
  }
  emit('update:initialState', isActive.value)
  // emit('toggle', isActive.value)
}

// Function to generate CSS filter from hex color
// Note: This is a simplified version. For production use, you might want to use a more sophisticated color conversion method.
function generateFilter(hex: string): string {
  filterColor[hex]
  // 生成过滤器字符串
  return filterColor[hex] ?? filterColor['thumb-up']
}
onMounted(() => {
  console.log('props.initialState', props.initialState)
})
</script>

<style scoped>
.icon-toggle {
  display: inline-block;
  cursor: pointer;
}

.icon-toggle-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

img {
  width: 18px;
  height: 18px;
}
</style>
