<template>
  <div v-if="!loading" :class="['icon-toggle']" @click="toggle">
    <img v-if="state === 'star'" :src="StarFilled" :style="imageStyle" />
    <img v-else :src="Star" :style="imageStyle" />
  </div>
  <div v-else>
    <el-icon><Loading /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { filterColor } from '@/const/commonSet'
import StarFilled from '@/assets/images/ph--star-fill.svg'
import Star from '@/assets/images/ph--star-light.svg'
import showErrorMessage from '@/utils/showErrorMessage'
import { getIpData } from '@/api/index'
import { favoriteHttp } from '@/api/bss/postContentManagement/index'

const props = defineProps<{
  iconState: 'star' | 'unset'
  ItemInfo: Record<string, any>
  likeFlag: 'p'
}>()
const emit = defineEmits(['update:iconState'])
const itemInfo = computed(() => props.ItemInfo)
const state = computed(() => props.iconState)
const disabledAction = computed(() => itemInfo.value.disabledAction)
const loading = ref(false)
const imageStyle = computed(() => ({
  filter: state.value === 'star' ? filterColor['star-filled'] : filterColor.default
}))
const toggle = async () => {
  if (disabledAction.value) {
    ElMessage({
      message: `请确认模拟用户`,
      type: 'warning'
    })
    return
  }
  if (loading.value) {
    return
  }
  try {
    loading.value = true
    const { targetId, targetRef, selectedUserId } = itemInfo.value
    const req = {
      userId: selectedUserId,
      targetRef,
      targetId,
      likeType: 'l',
      ipInfo: await getIpData(),
      favoriteFlag: props.likeFlag
    }
    const res = (await favoriteHttp(req)) as any

    if (!res.success) {
      showErrorMessage(res)
      return
    }
    emit('update:iconState', state.value === 'star' ? 'unset' : 'star')
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {})
</script>

<style scoped>
.icon-toggle {
  display: inline-block;
  cursor: pointer;
}
img {
  width: 18px;
  height: 18px;
}
</style>
