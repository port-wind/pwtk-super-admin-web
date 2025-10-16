<template>
  <el-tab-pane label="模板路径" :name="thirdTabName" class="m_tabs_pane" :lazy="true" v-if="distinguish">
    <section id="system_account">
      <section class="header-inside-dialog">
        <h3>层级表示(</h3>
        <el-breadcrumb :separator-icon="ArrowRight" style="display: flex">
          <el-breadcrumb-item :key="item" v-for="(item, index) in childrenHeaderList">
            <span class="like-a" @click="handleChildrenList(item, index)">
              {{ item.name }}
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <h3>)</h3>
      </section>
      <section class="main_flex_table">
        <m-table
          v-if="childrenHeaderList.length === 1"
          :options="breadcrumbOptions1"
          :total="total"
          pagination
          :currentPage="currentPage"
          :pageSize="pageSize"
          :page-sizes="pageSizes"
          :data="tableData1"
          isEditRow
          :isLoading="isLoading"
          stripe
          size="normal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template #websiteInnerName="{ scope }">
            <span
              @click="handleChildrenList({ name: scope.row.websiteInnerName, id: scope.row.websiteId }, 1)"
              class="like-a"
            >
              {{ scope.row.websiteInnerName }}
            </span>
          </template>

          <template #userName="{ scope }">
            <span>{{ scope.row.userName }}</span>
            <el-icon v-if="scope.row.userName" @click="jumpView({ id: scope.row.ownerUserId, tab: 'tab1' })">
              <Position />
            </el-icon>
          </template>
          <template #websiteStatus="{ scope }">
            <span>{{ getWebsiteStatusLabel(scope.row.websiteStatus) }}</span>
          </template>
        </m-table>
        <m-table
          v-if="childrenHeaderList.length === 2"
          :options="breadcrumbOptions2"
          :total="total2"
          pagination
          :currentPage="currentPage2"
          :pageSize="pageSize2"
          :page-sizes="pageSizes"
          :data="tableData2"
          isEditRow
          :isLoading="isLoading"
          stripe
          size="normal"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
        >
          <template #domainType="{ scope }">
            <span>{{ getDomainTypeLabel(scope.row.domainType) }}</span>
          </template>
          <template #domainFrom="{ scope }">
            <span>{{ getDomainFromLabel(scope.row.domainFrom) }}</span>
          </template>
          <template #domainStatus="{ scope }">
            <span>
              {{ getDomainStatusLabel(scope.row.domainStatus) }}
            </span>
          </template>
          <template #ownerUserId="{ scope }">
            <span>{{ scope.row.userName }}</span>
            <el-icon v-if="scope.row.userName" @click="jumpView({ id: scope.row.ownerUserId, tab: 'tab1' })">
              <Position />
            </el-icon>
          </template>
        </m-table>
      </section>
    </section>
  </el-tab-pane>
</template>
<script lang="ts" setup>
import { getBingTemplateWebsite, reqBingWebsiteDomain } from '@/api/site'
import { thirdTabName } from '@/views/Site/sketchManagement/components/data'

import { ArrowRight } from '@element-plus/icons-vue'
import {
  templateOptions,
  getWebsiteStatusLabel,
  websiteOptions,
  getDomainTypeLabel,
  getDomainFromLabel,
  getDomainStatusLabel
} from '@/views/Site/sketchManagement/components/data'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const router = useRouter()
const childrenHeaderList = ref<{ name: string; id: string }[]>([])
const tableData1 = ref()
const tableData2 = ref()
const breadcrumbOptions1 = ref(templateOptions)
const breadcrumbOptions2 = ref(websiteOptions)
const pageSizes = ref<number[]>([5, 15, 30, 50, 100])
const currentPage = ref<number>(1)
const currentPage2 = ref<number>(1)
const pageSize2 = ref<number>(5)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const total2 = ref<number>(0)
const isLoading = ref(false)
const props = defineProps({
  templateId: {
    type: String,
    default: ''
  },
  templateName: {
    type: String,
    default: ''
  }
})
import { useModalsStore } from '@/stores/modalStore'
import { IGetBingTemplateWebsiteQueryParams } from '@/api/site/types'
const modalsStore = useModalsStore()
const userId: Ref<string> = ref('')
const jumpView = ({ id, tab }) => {
  userId.value = id
  const routeData = router.resolve({
    path: '/user/userList',
    query: { userId: id, activeTab: tab }
  })
  window.open(routeData.href, '_blank')
}
const distinguish = computed(() => {
  return modalsStore.templateInfoModal?.modalData?.showOtherTabs || false
})
const handleSearch1 = () => {
  if (distinguish.value) {
    const sendedParameters: IGetBingTemplateWebsiteQueryParams = {
      sortOrder: 'ASC',
      sortName: 'create_time',
      page: currentPage.value,
      size: pageSize.value,
      websiteTemplateRef: props.templateId,
      manageSiteId: manageSite.manageSiteId
    }
    getBingTemplateWebsite(sendedParameters)
      .then((res: any) => {
        if (res && res.success) {
          tableData1.value = res.data.list
          total.value = Number(res.data.total)
        }
        childrenHeaderList.value.splice(0)
        childrenHeaderList.value.push({
          name: props.templateName || modalsStore.templateInfoModal.modalData?.templateName,
          id: props.templateId || modalsStore.templateInfoModal.modalData?.templateId
        })
        return res
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}
const handleSizeChange2 = (val: number) => {
  pageSize2.value = val
  handleSearch2()
}
const handleCurrentChange2 = (val: number) => {
  currentPage2.value = val
  handleSearch2()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch1()
}
const handleSearch2 = () => {
  childrenHeaderList.value.splice(1)
  childrenHeaderList.value.push({ name: theWebObj.value.name, id: theWebObj.value.id })
  reqBingWebsiteDomain({
    websiteRef: theWebObj.value.id,
    sortOrder: 'ASC',
    sortName: 'create_time',
    page: currentPage2.value,
    size: pageSize2.value,
    manageSiteId: manageSite.manageSiteId
  }).then((res: any) => {
    if (res && res.success) {
      tableData2.value = res.data.list
      total2.value = Number(res.data.total)
    }
  })
}
const theWebObj = ref({ id: '', name: '' })
const handleChildrenList = (value: any, index) => {
  theWebObj.value = { id: value.id, name: value.name }
  isLoading.value = true
  if (index == 0) {
    childrenHeaderList.value.splice(1)
  } else if (index == 1 && childrenHeaderList.value.length !== 2) {
    theWebObj.value = { id: value.id, name: value.name }
    handleSearch2()
  }
  isLoading.value = false
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch1()
}
onMounted(() => {
  handleSearch1()
})
</script>
<style lang="less" scoped>
.main_flex_table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

:deep(.el-pagination) {
  margin-bottom: 10px;
}
</style>
