<template>
  <div v-if="isBg" :style="`background-image: url(${resolvedSrc})`"></div>
  <img v-else :src="resolvedSrc" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

type SrcType = string | (() => Promise<string>) | Promise<string>

interface IProps {
  src: SrcType
  isBg?: boolean
}

// 定义 Props
const props = defineProps<IProps>()

// 解析后的图片地址
const resolvedSrc = ref<string>('')

// 用于追踪当前的加载请求，避免竞态条件
let currentRequestId = 0

// 解析图片的函数
const loadImage = async () => {
  const requestId = ++currentRequestId // 记录当前请求 ID，防止并发问题
  try {
    let resolved: string
    if (typeof props.src === 'function') {
      resolved = await props.src()
    } else if (props.src instanceof Promise) {
      resolved = await props.src
    } else {
      resolved = props.src
    }
    if (requestId === currentRequestId) {
      resolvedSrc.value = resolved
    }
  } catch (error) {
    console.error('图片加载失败:', props.src, error)
    if (requestId === currentRequestId) {
      resolvedSrc.value = '' // 出错时清空 src
    }
  }
}

// 监听 src 变化并加载图片
watch(() => props.src, loadImage, { immediate: true })

// 透传 img 标签的所有属性（除了 src 和 isBg）
const imageProps = computed(() => {
  const { src, isBg, ...restProps } = props
  return restProps
})
</script>
