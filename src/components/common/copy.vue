<template>
  <div id="copy">
    <a href="javascript:void(0);">
      <el-icon class="copy" @click="copyInfo(content, title)">
        <copy-document />
      </el-icon>
    </a>
  </div>
</template>
<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
// 点击复制
import useClipboard from 'vue-clipboard3'
const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})
const { content, title } = toRefs(props)
const { toClipboard } = useClipboard()
const copyInfo = async (val, name) => {
  try {
    await toClipboard(val.toString())
    ElMessage.success(name + t('pop.ReplicatingSuccess'))
  } catch (e) {
    ElMessage.warning(t('pop.Yoursupportcopying') + ':', e)
  }
}
</script>
<style scoped lang="less">
#copy {
  display: inline;
  margin-left: 5px;
  font-size: 12px;
  cursor: copy;
  a {
    cursor: copy;
    color: #67c23a;
  }
}
</style>
