<template>
  <el-select v-bind="$attrs" v-model="state" placeholder="手机区号" filterable clearable @change="onChange">
    <!-- :value="item.english_name" -->
    <el-option
      v-for="item in phoneCode"
      :key="item.english_name"
      :label="'+' + item.phone_code"
      :value="item.phone_code"
    >
      <span style="float: left">+{{ item.phone_code }}</span>
      <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
        {{ (lang == 'en' ? item.english_name : item.chinese_name) + '(' + item.country_code + ')' }}
      </span>
    </el-option>
  </el-select>
</template>
<script setup lang="ts">
import codeList from '@/assets/json/phone.json'
const props = defineProps({
  modelValue: {
    type: String
  }
})
const phoneCode = codeList
const lang = localStorage.getItem('language')
const state = ref()
// value.value = props.toValue + ''
const emit = defineEmits(['update:modelValue'])
// 选择项事件
const onChange = (value) => {
  if (value) {
    emit('update:modelValue', '+' + value)
  } else {
    emit('update:modelValue', value)
  }
}
// 更新事件
// const doUpdateValue = (val) => {
//   value.value = val + ''
// }
// 重置事件
// const reset = () => {
//   value.value = ''
// }
// defineExpose({
//   doUpdateValue,
//   reset
// })

onMounted(() => {
  if (props.modelValue) {
    state.value = props.modelValue
  }
})

watch(
  () => props.modelValue,
  (newVal) => {
    state.value = newVal
  }
)
</script>
<style scoped lang="less"></style>
