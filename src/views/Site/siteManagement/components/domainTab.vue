<template>
  <section id="system_account">
    <section>
      <mSearch
        :isLoading="isLoading"
        :formOptions="bindedSearchOptions"
        :buttonOptions="searchBtnOptions"
        @query="handleSearch"
        ref="searchRef"
      >
        <template v-if="props.domainType === 2" #autoCompleteDomain="{ scope, form }">
          <AutoComplete
            v-model="form.domain"
            placeholder="域名"
            keyword="domain"
            :is-page="true"
            :is-list="true"
            :displayFields="['domain']"
            :trigger-on-focus="true"
            :httpFunc="reqUnBingWebsiteDomain"
            :searchObj="{ websiteRef: '', type: '2', page: currentPage, size: pageSize }"
          ></AutoComplete>
        </template>
        <template v-else #autoCompleteDomain="{ scope, form }">
          <AutoComplete
            v-model="form.domain"
            placeholder="域名"
            keyword="domain"
            :is-page="false"
            :is-list="false"
            :displayFields="['domain']"
            :trigger-on-focus="true"
            :httpFunc="reqBingWebsiteDomain"
            :searchObj="{
              websiteRef: props.websiteId,
              type: '1',
              page: currentPage,
              size: pageSize
            }"
          ></AutoComplete>
        </template>
        <template #timeLine="{ scope, form }">
          <el-date-picker v-model="form.createTime" type="date" placeholder="请选择创建时间" style="width: 100%" />
        </template>
        <!--   <template #userId="{ scope, form }">
          <AutoComplete
            v-model="form.ownerUserId"
            placeholder="用户ID"
            keyword="searchId"
            :is-list="true"
            :isPage="true"
            :displayFields="['loginId', 'userId']"
            inputValue="userId"
            :trigger-on-focus="true"
            :httpFunc="reqUserList"
          ></AutoComplete>
        </template> -->
      </mSearch>
    </section>
    <section class="main_flex_table">
      <m-table
        :page-sizes="pageSizes"
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #domainFrom="{ scope }">
          <span>{{ domainSource[scope.row.domainFrom] }}</span>
          <!-- <span>{{ scope.domainFrom }}</span> -->
        </template>
        <template #domainType="{ scope }">
          <span>{{ mapDomainType[scope.row.domainType] }}</span>
          <!-- <span>{{ scope.row.domainType }}</span> -->
        </template>
        <template #force="{ scope }">
          <span style="margin-right: 10px">{{ scope.row.isForceHttps === 'y' ? '是' : '否' }}</span>
        </template>
        <template #status="{ scope }">
          <span style="margin-right: 0px">
            {{ scope.row.domainStatus === 'y' ? '启用' : '关闭' }}
          </span>
          <!-- <el-switch
          v-model="scope.row.domainStatsTag"
          :active-value="'y'"
          :inactive-value="'n'"
        
        ></el-switch> -->
        </template>
        <template #="{ row }">{{ landingPage[row.landingPage] }}</template>
        <!-- 绑定站点 -->
        <template #websiteRefAndWebsiteInnerName="{ scope }">
          <div>{{ scope.row.websiteInnerName }}</div>
          <div>{{ scope.row.websiteRef }}</div>
        </template>
        <template #userNameAndOwnerUserId="{ scope }">
          <span>{{ scope.row.userName }}</span>
          <el-icon v-if="scope.row.ownerUserId" @click="jumpView({ id: scope.row.ownerUserId, tab: 'tab1' })">
            <Position />
          </el-icon>
          <!-- <span>{{ scope.row.ownerUserId }}</span> -->
        </template>
        <!-- <template  #websiteTitle="{ scope }">
          <span v-if="props.domainType === 1">
            {{ props }}1111
            <br/>
            {{ scope.row.websiteTitle }}
          </span>
        </template> -->
        <template #handleButton="{ scope }">
          <template v-if="type === '1'">
            <el-button
              style="color: black"
              type="success"
              @click="
                handleBindOrUnBind({
                  websiteId: props.websiteId,
                  type: '1',
                  domainStatus: 'n',
                  domain: scope.row.domain
                })
              "
            >
              解绑
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="success"
              @click="
                handleBindOrUnBind({
                  websiteId: props.websiteId,
                  type: '2',
                  domainStatus: 'y',
                  domain: scope.row.domain
                })
              "
              v-text="'绑定'"
            />
          </template>
        </template>
      </m-table>
    </section>
  </section>
</template>

<script setup lang="ts">
import { defineExpose, ref } from 'vue'
import type { TableOptions } from '@/components/mTable/types'
import type { SearchBtnOptions, SearchOption } from '@/components/mSearchForm/types'
import type { GetRequest, TableData } from '@/api/system/upload/types'
import { landingPage, domainSource } from '@/const/options.json'
import { reqBingWebsiteDomain, reqUnBingWebsiteDomain, reqDomain, setBingWebSite } from '@/api/site'
import { pageSizes } from './data'
import { reqUserList } from '@/api/user/index'
let domain: string = ''
const searchRef = ref()
const mapDomainType = ref({
  f: '前端',
  m: '管端',
  z: '总管',
  p: '前端永久',
  b: '前端备用'
})
const router = useRouter()
import { useModalsStore } from '@/stores/modalStore'
const modalsStore = useModalsStore()
const userId: Ref<string> = ref('')
const jumpView = ({ id, tab }) => {
  userId.value = id
  /* modalsStore.showModal('userInfoForJumpModal')
  modalsStore.setActiveTab('userInfoForJumpModal', tab)
  modalsStore.setModalData('userInfoForJumpModal', {
    ...modalsStore.userInfoForJumpModal.modalData,
    userId: userId.value,
    showCommitButton: false
  }) */
  const routeData = router.resolve({
    path: '/user/userList',
    query: { userId: id, activeTab: tab }
  })
  window.open(routeData.href, '_blank')
}
function openInNewTab(route, params) {
  const routeData = router.resolve({
    path: route,
    query: params
  })
  window.open(routeData.href, '_blank')
}
interface DomainConfig {
  websiteRef: string
  type: '1' | '2' // assuming "type" can have a limited set of string values
  // y,启用;c,关闭;n,维护',
  domainStatus: 'y' | 'n' | '' | 'c'
  domainType: string
  promotionCode: string
  domain: string
  isForceHttps: string
  createTime: string | Date
}
interface BindDataInterface {
  websiteId: string
  type: '1' | '2'
  domainStatus: string
  domain: string
}
const emit = defineEmits<{
  (event: 'updateActiveTab', clickedDomain: string): void
}>()
const initBindData = (): BindDataInterface => ({
  websiteId: '',
  type: '1',
  domainStatus: '',
  domain: ''
})
const initSearchData = (): DomainConfig => ({
  websiteRef: '',
  type: '1',
  domainStatus: '',
  domainType: '',
  promotionCode: '',
  domain: '',
  isForceHttps: '',
  createTime: ''
})
const websiteTitleObj = {
  prop: 'websiteTitle',
  label: '标题',
  slot: 'websiteTitle'
  // width: '150'
}
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'domain',
    label: '域名',
    fixed: 'left',
    isCopyText: true,
    width: '240'
  },
  {
    prop: 'domainFrom',
    label: '来源',
    slot: 'domainFrom'
    // width: 70
  },
  {
    prop: 'domainType',
    label: '类型',
    slot: 'domainType'
    // width: 70
  },
  {
    prop: 'domainStatus',
    label: '状态',
    slot: 'status'
    // width: 70
  },
  /* {
    prop: 'landingPage',
    slot: 'landingPage',
    label: '落地页'
  }, */
  /* {
    prop: 'websiteRefAndWebsiteInnerName',
    // label: '绑定站点',
    label: '绑定站点',
    slot: 'websiteRefAndWebsiteInnerName'
  }, */
  {
    prop: 'userNameAndOwnerUserId',
    label: '所属用户',
    width: '300',
    slot: 'userNameAndOwnerUserId'
  },
  {
    prop: 'websiteTitle',
    label: '标题',
    width: '180'
  },
  {
    prop: 'handleButton',
    label: '操作',
    slot: 'handleButton'
    // width: '90'
  }
]
//页面初始化获取数据 如果有OBJ那么就是绑定或者解绑，如果没有那么就是查询这个table

const handleSearch = (inputParameters?: any) => {
  isLoading.value = true
  //  必传参数domainStatsTag 域名状态tag. a已经绑定的域名。b未绑定的域名
  // 绑定时候传入websiteRef 未绑定传入空
  let websiteRef: string = ''
  let req = reqBingWebsiteDomain
  switch (props.domainType) {
    // 已绑定站点
    case 1:
      type.value = '1'
      websiteRef = props.websiteId
      queryTableValue.websiteRef = props.websiteId
      req = reqBingWebsiteDomain
      Object.assign(bindedSearchOptions, bindedSearchOptionsInit())
      break
    // 未绑定站点
    case 2:
      type.value = '2'
      websiteRef = ''
      queryTableValue.websiteRef = ''
      req = reqUnBingWebsiteDomain
      Object.assign(bindedSearchOptions, unBindedSearchOptionsInit())
      break
    default:
      type.value = '1'
      websiteRef = props.websiteId
      queryTableValue.websiteRef = props.websiteId
      req = reqBingWebsiteDomain
      Object.assign(bindedSearchOptions, bindedSearchOptionsInit())
      break
  }
  let sendedParameters = {
    websiteRef,
    type: props.domainType.toString(),
    ownerUserId: props.ownerUserId
  }
  if (props.domainType === 1) {
    // sendedParameters = removeProperty(sendedParameters, 'ownerUserId')
    sendedParameters.type = '1'
  }
  sendedParameters = {
    page: currentPage.value,
    size: pageSize.value,
    ...sendedParameters,
    ...inputParameters
  }
  console.log('send', sendedParameters)

  return req(sendedParameters)
    .then((res) => {
      if (res && res.success) {
        tableData.value = res.data.list
        total.value = Number(res.data.total)
      }
      // console.log('handleSearch result:', res) // 添加日志
      return res
    })
    .finally(() => {
      isLoading.value = false
    })
}

// 解绑N   绑定传Y
function removeProperty<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = obj
  return rest
}
const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref<number>(0)
//loading 按钮
const isLoading = ref(false)
//翻页功能 前一页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}
//翻页功能 后一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}
// 定义和接收 props
const props = defineProps({
  mode: {
    type: String as PropType<'default' | 'domainPage'>,
    default: 'default',
    required: false
  },
  websiteId: {
    type: String,
    required: true
  },
  domainType: {
    type: Number,
    required: true
  },
  ownerUserId: {
    type: String,
    default: ''
  }
})
onMounted(() => {
  handleSearch()
})
// type1绑定 2解绑 y绑定 n解绑
let type = ref('1')
// 解绑or绑定
const handleBindOrUnBind = (params) => {
  domain = params.domain
  isLoading.value = true
  //  return  console.log('para', params,mode);//domainPage
  const sendedParams: BindDataInterface = {
    ...initBindData(),
    ...params,
    websiteId: props.websiteId
  }
  // console.log('sendedParams', sendedParams)
  // 通过website的ID获取已绑定的域名和没有绑定的域名
  reqDomain(sendedParams)
    .then(() => {
      return handleSearch({ ...searchRef.value.getFormData() })
    })
    .then((res) => {})
    .finally(() => {
      isLoading.value = false
    })
}

let queryTableValue = initSearchData()

const dadDoFetch = (params) => {
  let type = '1'
  if (params.websiteRef) {
    type = '1'
  } else {
    type = '2'
  }
  params.type = type
  console.log('searchRef.value.getFormData()', searchRef.value.getFormData())
  params = { ...searchRef.value.getFormData() }
  handleSearch(params)
}
// 定义暴露
defineExpose({ dadDoFetch })
const bindedSearchOptionsInit = (): SearchOption[] => [
  {
    prop: 'domain',
    type: 'autoComplete',
    slot: 'autoCompleteDomain'
  },

  {
    prop: 'domainType',
    type: 'select',
    width: '110px',
    selectData: {
      selectName: 'domainType',
      placeholder: '类型'
    }
  }
]
const bindedSearchOptions = reactive<SearchOption[]>(bindedSearchOptionsInit())
const unBindedSearchOptionsInit = (): SearchOption[] => [
  {
    prop: 'domain',
    type: 'autoComplete',
    slot: 'autoCompleteDomain'
  },

  {
    prop: 'domainType',
    type: 'select',
    width: '110px',
    selectData: {
      selectName: 'domainType',
      placeholder: '类型'
    }
  },
  {
    prop: 'userId',
    type: 'autoComplete',
    slot: 'userId'
  }
]

const searchBtnOptions: SearchBtnOptions = {
  isSearch: true,
  isReset: true,
  isAdd: false
}
</script>
<style scoped>
.main_flex_table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto; /* 如果内容可能溢出 */
}
</style>
