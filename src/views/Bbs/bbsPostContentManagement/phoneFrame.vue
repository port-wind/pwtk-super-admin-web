<template>
  <section class="phoneAll" :style="styleObject">
    <img src="@/assets/images/phoneTop.png" alt="" class="statusBar" />

    <!-- Main body slot -->
    <div class="mainBodyContainer">
      <slot name="mainBody"></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Props {
  setHeight?: number
}

const props = defineProps<Props>()

// Compute style conditionally based on setHeight prop
const styleObject = computed(() => {
  if (props.setHeight !== undefined) {
    return { height: props.setHeight + 'px' }
  }
  return {}
})

// Initialize on mount
onMounted(async () => {
  // Wait for the DOM to update
})
</script>

<style lang="less" scoped>
.phoneAll {
  width: 495px;
  box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px 10px 5px 10px;
  margin: 0;
  display: flex;
  flex-direction: column;
  height: 100%;

  .statusBar {
    width: 100%;
    display: block;
  }

  .mainBodyContainer {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    transition: max-height 0.3s ease;
  }
}
</style>
