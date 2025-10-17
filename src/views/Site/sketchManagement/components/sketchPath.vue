<template>
  <el-tab-pane label="草图路径" :name="secondTabName" class="m_tabs_pane" :lazy="true" @click="handleClick">
    <section id="system_account">
      <section class="header-inside-dialog">
        <h3>层级表示(</h3>
        <el-breadcrumb :separator-icon="ArrowRight" style="display: flex">
          <el-breadcrumb-item :key="item" v-for="(item, index) in childrenHeaderList">
            <span class="like-a" @click="handleChildrenList(item, index)">
              {{ item.name || sketchName }}
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <h3>)</h3>
      </section>
      <section class="single-table main_flex_table">
        <m-table
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-if="childrenHeaderList.length === 1"
          :options="breadcrumbOptions1"
          :total="total"
          pagination
          :currentPage="currentPage"
          :pageSize="pageSize"
          :data="tableData1"
          isEditRow
          :isLoading="isLoading"
          :page-sizes="pageSizes"
          stripe
          size="normal"
          class="cc-table"
        >
          <template #templateName="{ scope }">
            <span
              @click="handleChildrenList({ name: scope.row.templateName, id: scope.row.templateId }, 1)"
              class="like-a"
            >
              {{ scope.row.templateName }}
            </span>
          </template>
          <template #loginId="{ scope }">
            <span>{{ scope.row.loginId }}</span>
            <el-icon v-if="scope.row.loginId" @click="jumpView({ id: scope.row.ownerUserId, tab: 'tab1' })">
              <Position />
            </el-icon>
          </template>
          <template #templateStatus="{ scope }">
            <span>{{ getTemplateStatusLabel(scope.row.templateStatus) }}</span>
          </template>
          <template #isSystem="{ scope }">
            <span>{{ scope.row.isSysTemplate === 'y' ? '是' : '否' }}</span>
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
          <template #websiteInnerName="{ scope }">
            <span
              @click="handleChildrenList({ name: scope.row.websiteInnerName, id: scope.row.websiteId }, 2)"
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
          v-if="childrenHeaderList.length === 3"
          :options="breadcrumbOptions3"
          :total="total3"
          pagination
          :currentPage="currentPage3"
          :pageSize="pageSize3"
          :page-sizes="pageSizes"
          :data="tableData3"
          isEditRow
          :isLoading="isLoading"
          stripe
          size="normal"
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
import { getBingTemplateWebsite, listTemplateBySketchCodeWithPage, reqBingWebsiteDomain } from '@/api/site'
import { defineProps, defineEmits } from 'vue'
import { secondTabName } from '@/views/Site/sketchManagement/components/data'
import showErrorMessage from '@/utils/showErrorMessage'
import { ArrowRight } from '@element-plus/icons-vue'
import {
  sketchOptions,
  templateOptions,
  getWebsiteStatusLabel,
  websiteOptions,
  getDomainTypeLabel,
  getDomainFromLabel,
  getDomainStatusLabel,
  getTemplateStatusLabel
} from './data'
const childrenHeaderList = ref<{ name: string; id: string }[]>([])
const tableData1 = ref()
const tableData2 = ref()
const breadcrumbOptions1 = ref(sketchOptions)
const breadcrumbOptions2 = ref(templateOptions)
const breadcrumbOptions3 = ref(websiteOptions)
const pageSizes = ref<number[]>([5, 15, 30, 50, 100])
const tableData3 = ref()
const currentPage = ref<number>(1)
const currentPage2 = ref<number>(1)
const currentPage3 = ref<number>(1)
const pageSize2 = ref<number>(5)
const pageSize3 = ref<number>(5)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const total2 = ref<number>(0)
const total3 = ref<number>(0)
const isLoading = ref(false)
const router = useRouter()
import { useModalsStore } from '@/stores/modalStore'
import { IlistTemplateBySketchCodeWithPageQueryParams, ISketchData } from '@/api/site/types'
import { useManageSiteStore } from '@/stores/manageSiteStore'

interface IDefineProps {
  currentRowData: ISketchData
}
const props = defineProps<IDefineProps>()
interface IDefineEmits {
  (e: 'cancel'): void
  (e: 'close-button'): void
}
const emit = defineEmits<IDefineEmits>()

const manageSite = useManageSiteStore()
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
const handleClick = () => {
  console.log('handleClick')
}
let ownerUserId: any = null
const sketchCode = computed(() => {
  return props.currentRowData.sketchCode
})
const sketchName = computed(() => {
  return props.currentRowData?.sketchName
})
const handleSearch1 = () => {
  const sendedParameters: IlistTemplateBySketchCodeWithPageQueryParams = {
    sortOrder: 'ASC',
    sortName: 'create_time',
    page: currentPage.value,
    size: pageSize.value,
    sketchCode: sketchCode.value,
    manageSiteId: manageSite.manageSiteId
  }

  listTemplateBySketchCodeWithPage(sendedParameters)
    .then((res) => {
      if (res && res.success) {
        console.log('res.data.list', res.data)
        if (res.data.list.length) {
          ownerUserId = res.data.list[0].ownerUserId
        } else {
          ownerUserId = ''
        }
        tableData1.value = res.data.list
        total.value = Number(res.data.total)
      }
      childrenHeaderList.value.splice(0)
      childrenHeaderList.value.push({
        name: modalsStore.templateInfoModal.modalData?.sketchName,
        id: sketchCode.value
      })
      return res
    })
    .finally(() => {
      isLoading.value = false
    })
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
  childrenHeaderList.value.push({ name: theTemplateObj.value.name, id: theTemplateObj.value.id })
  getBingTemplateWebsite({
    websiteTemplateRef: theTemplateObj.value.id,
    page: currentPage2.value,
    size: pageSize2.value,
    manageSiteId: manageSite.manageSiteId
  }).then((res) => {
    if (res && res.success) {
      tableData2.value = res.data.list
      total2.value = Number(res.data.total)
    } else {
      showErrorMessage(res.errMessage)
    }
  })
}
const theTemplateObj = ref({ id: '', name: '' })
const handleChildrenList = (value: any, index) => {
  theTemplateObj.value = { id: value.id, name: value.name }
  isLoading.value = true
  if (index == 0) {
    childrenHeaderList.value.splice(1)
  } else if (index == 1 && childrenHeaderList.value.length !== 2) {
    theTemplateObj.value = { id: value.id, name: value.name }
    handleSearch2()
  } else if (index == 2 && childrenHeaderList.value.length !== 3) {
    childrenHeaderList.value.splice(2)
    childrenHeaderList.value.push({ name: value.name, id: value.id })
    reqBingWebsiteDomain({
      manageSiteId: manageSite.manageSiteId,
      ownerUserId: ownerUserId,
      websiteRef: value.id,
      sortOrder: 'ASC',
      sortName: 'create_time',
      page: currentPage3.value,
      size: pageSize3.value
    }).then((res) => {
      if (res && res.success) {
        tableData3.value = res.data.list
        total3.value = Number(res.data.total)
      }
    })
  }
  isLoading.value = false
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch1()
}
onMounted(() => {
  if (sketchCode) {
    handleSearch1()
  }
})
</script>
<style scoped>
.main_flex_table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.el-table {
  font-size: 14px !important;
  background-color: pink;
}
</style>
