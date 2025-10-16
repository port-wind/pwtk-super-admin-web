<template>
  <!-- <el-form-item :label="props?.lable" prop="props.prop"> -->
  <el-select v-model="remoteId" :placeholder="props.placeholder" clearable :loading="isLoading3">
    <el-option
      v-for="(item, index) in remoteOptions"
      :key="item.templateId"
      :label="item.templateName"
      :value="item[`${props.name}`]"
    />
  </el-select>
  <!-- </el-form-item> -->
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { reqSysTemplateList } from '@/api/site/index'
const props = defineProps(['name', 'lable', 'prop', 'placeholder'])

const remoteId = defineModel('remoteId')

const remoteOptions: any = ref([])
const inputId = ref('')
const isLoading3 = ref(false)

// 单个 ref
watch(remoteId, (newX) => {
  console.log(`x is ${newX}`)
  if (!newX) {
    remoteId.value = ''
  }
})
function handleCycleTime(date) {}

async function remoteIdChange(val) {
  console.log(val)
  // let c = { `${props.name}`: val, page: 1, size: 100 }
  if (val) {
    try {
      let res = await reqSysTemplateList()
      remoteOptions.value = res.data.list
    } catch (err) {}
  } else {
    remoteOptions.value = []
  }
}
</script>
<style lang="less" scoped></style>
