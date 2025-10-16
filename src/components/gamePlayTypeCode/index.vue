<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { BizFlag } from '@/api/betting/types'
// 定义 emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const props = defineProps<{
  modelValue: number | undefined
  biz: BizFlag // b(bbs),t(图库),p(竞选),r(心水
}>()
const tempValue = ref<number | undefined>()
const bettingStore = useBettingStore()

const handleChange = (val) => {
  emit('update:modelValue', val)
}

onMounted(async () => {
  tempValue.value = props.modelValue
  if (bettingStore.gameListTypeCode.length === 0) {
    await bettingStore.getListPlayTypeCode(props.biz)
  }
})

watch(
  () => props.modelValue,
  (val) => {
    tempValue.value = val
  }
)
</script>

<template>
  <el-select v-bind="$attrs" v-model="tempValue" @change="handleChange" placeholder="投票类型">
    <el-option
      v-for="item in bettingStore.gameListTypeCode"
      :key="item.playTypeCode"
      :label="item.predictionTypeName"
      :value="item.playTypeCode"
    />
  </el-select>
</template>

<style lang="less" scoped></style>
