<script setup lang="ts">
import { reqWebsiteManageList } from '@/api/user/index'
import { handleStrMask } from '@/utils/dataFormat'

/**
 * Type
 */
interface WebsiteItem {
  manageId: string
  siteName: string
  siteStatus: string
  oapiUrl: string
  createTime: string
  accessKey: string
}

interface Props {
  useDefault?: boolean
}

/**
 * Data
 */
const emit = defineEmits<{ onSelect: [siteId: string, site?: WebsiteItem] }>()
const props = defineProps<Props>()
const siteId = defineModel('siteId', { type: String, default: '' })
const isLoading = ref(false)
const websiteList = ref<WebsiteItem[]>([])

/**
 * Method
 */
const initData = async () => {
  isLoading.value = true
  try {
    const res = await reqWebsiteManageList({ page: 1, size: 100 })
    console.log('website select:', res)
    if (!res.success) {
      // error message
      return
    }
    websiteList.value = res.data.list
    console.log('websiteList:', websiteList.value)
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}
/**
 * Extract domain from url
 */
// function extractDomain(url: string): string | null {
//   const domainPattern = /^(?:https?:\/\/)?([^\/]+)/
//   const match = url.match(domainPattern)
//   return match ? match[1] : null
// }

onMounted(async () => {
  await initData()
  if (props.useDefault) {
    siteId.value = websiteList.value[0]?.manageId ?? ''
  }

  watch(siteId, (newSiteId) => {
    if (!newSiteId) {
      emit('onSelect', '')
      return
    }
    const site = websiteList.value.find((item) => item.manageId === newSiteId)
    if (site) {
      emit('onSelect', newSiteId, site)
    }
  })
})
</script>

<template>
  <el-select v-model="siteId" placeholder="请选择站点" clearable>
    <el-option
      v-for="item in websiteList"
      :key="item.manageId"
      :label="handleStrMask(item.manageId) + ' - ' + item.siteName"
      :value="item.manageId"
    ></el-option>
  </el-select>
</template>

<style scoped></style>
