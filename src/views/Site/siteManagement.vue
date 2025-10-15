<template>
  <section id="system_account">
    <section ref="queryRef" class="search">
      <el-form :inline="true" :model="queryForm" class="search_left" @keyup.enter="fetchData">
        <el-form-item label="" prop="manageSiteId">
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item>
        <el-form-item label="" prop="websiteId">
          <el-input v-model="queryForm.websiteId" placeholder="站点ID" maxlength="32" />
        </el-form-item>

        <el-form-item label="" prop="websiteTitle">
          <el-input v-model="queryForm.websiteTitle" placeholder="站点标题" maxlength="128" />
        </el-form-item>

        <el-form-item label="" prop="ownerUserId">
          <el-autocomplete
            clearable
            v-model="queryForm.ownerUserId"
            :fetch-suggestions="querySearchUserLogin"
            placeholder="所属用户 | ID"
            @select="handleSelectUserId"
            :trigger-on-focus="false"
          >
            <template #default="{ item }">
              <div class="autocomplete-item">
                <div>{{ item.loginId }}-{{ item.userId }}</div>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="" prop="websiteTemplateRef">
          <AutoComplete
            v-model="queryForm.websiteTemplateRef"
            placeholder="绑定模板 | ID"
            keyword="websiteTemplateRef"
            :is-list="false"
            :trigger-on-focus="true"
            :httpFunc="
              (data) =>
                reqListTemplate({
                  ...data,
                  manageSiteId: manageSite.manageSiteId
                })
            "
            :displayFields="['templateName', 'websiteTemplateRef']"
          ></AutoComplete>
        </el-form-item>

        <el-form-item label="" prop="websiteInnerName">
          <el-input v-model="queryForm.websiteInnerName" placeholder="站点内部名称" maxlength="128" />
        </el-form-item>

        <el-form-item label="" prop="langCodes">
          <el-select v-model="queryForm.langCodes" multiple placeholder="语言">
            <el-option v-for="item in optionsLang" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="areaCodes">
          <el-select v-model="queryForm.areaCodes" multiple placeholder="地区">
            <el-option v-for="item in optionsArea" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData({ ...queryForm, ...pageObj })" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="addButton(queryForm)">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <el-table
        ref="tableRef"
        :height="count(tableRef, true).toString()"
        class="site-table"
        v-loading="isLoading"
        stripe
        highlight-current-row
        :show-overflow-tooltip="{ disabled: true }"
        :data="tableList"
        style="width: 100%"
      >
        <el-table-column label="站点" key="websiteId" prop="websiteId" width="200">
          <template #="{ row }">
            <el-link class="like-a" type="primary" @click="handleEdit(row)">
              {{ row.websiteInnerName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="所属用户" key="ownerUserId" prop="ownerUserId" width="180">
          <template #="{ row }">
            <el-link class="like-a" type="primary" @click="showUserInfoDialog(row)">
              {{ row.userName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="绑定模板" key="templateName" prop="templateName" width="200">
          <template #="{ row }">
            <el-link class="like-a" type="primary" @click="showTemplateInfoDialog(row)">
              {{ row.templateName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" key="websiteStatus" prop="websiteStatus" width="70">
          <template #="{ row }">
            <el-dropdown trigger="click" size="small" @command="stateChange">
              <span class="el-dropdown-link">
                <el-tag v-if="row.websiteStatus == 'y'" class="mx-1" type="primary">启用</el-tag>
                <el-tag v-else-if="row.websiteStatus == 'm'" class="mx-1" type="warning">维护</el-tag>
                <el-tag v-else class="mx-1" type="info">关闭</el-tag>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item class="mx-1" :command="{ row, websiteStatus: 'y' }">
                    <el-tag type="primary">启用</el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item class="mx-1" :command="{ row, websiteStatus: 'm' }">
                    <el-tag type="warning">维护</el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item class="mx-1" :command="{ row, websiteStatus: 'c' }">
                    <el-tag type="info">关闭</el-tag>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="页面组件" key="websiteId" prop="websiteId" width="90">
          <template #="{ row }">
            <el-text class="mx-1" type="primary">
              <el-link @click="handPageComponentTab(row)" type="primary">查看</el-link>
            </el-text>
          </template>
        </el-table-column>
        <el-table-column label="标题" key="websiteTitle" prop="websiteTitle" width="120" />
        <el-table-column label="关键字" key="keyWords" prop="keyWords" />
        <el-table-column
          label="描述"
          key="describe"
          prop="describe"
          :show-overflow-tooltip="{ disabled: true }"
          width="170"
        />
        <el-table-column label="在线客服" key="onlineServiceCode" prop="onlineServiceCode" width="100" />
        <el-table-column label="统计代码" key="websiteId" prop="websiteId" width="90">
          <template #="{ row }">
            <el-text v-if="row.hasStatsCode === 'y'" class="mx-1" type="primary">
              <el-link @click="handTabs(row)" type="primary">查看</el-link>
            </el-text>
            <el-text v-else class="mx-1" type="info"></el-text>
          </template>
        </el-table-column>
        <el-table-column label="语言" key="langCodes" prop="langCodes" width="120">
          <template #="{ row }">{{ formatLanguageData(row.langCodes) }}</template>
        </el-table-column>
        <el-table-column label="地区" key="areaCodes" prop="areaCodes" width="120">
          <template #="{ row }">{{ formatAreaData(row.areaCodes) }}</template>
        </el-table-column>
        <el-table-column label="备注" key="memo" prop="memo" width="170">
          <template #="{ row }">
            {{ row.memo }}
          </template>
        </el-table-column>
        <el-table-column width="180px" label="创建时间" key="createTime" prop="createTime" align="left">
          <template #="{ row }">
            {{ unitFormatDate(row.createTime) }}
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="pagination">
      <el-pagination
        v-model:current-page="pageObj.page"
        v-model:page-size="pageObj.size"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </section>
    <el-dialog
      class="tabs-dialog"
      :destroy-on-close="true"
      v-model="isAddDialogModel"
      title=""
      :close-on-click-modal="false"
      @close="closeAddDialog"
    >
      <el-tabs v-model="addActiveName" class="demo-tabs m_tabs">
        <el-tab-pane label="站点" name="add" class="m_tabs_pane">
          <AddWebsite
            v-model:pageObj="pageObj"
            v-model:isDialogVisible="isAddDialogModel"
            @call-parent-method="fetchData"
            :queryForm="queryForm"
            :pageObj="pageObj"
            :options="addOptions()"
            :formData="sonFormData"
            ref="addEditWebsiteRef"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <EditWebsiteTabs v-if="modalsStore.websiteInfoModal.isVisible" />
    <UserListComponent></UserListComponent>
    <EditOrAddTemplate :template-info="templateInfo" @close-tabs="closeTabs"></EditOrAddTemplate>
    <el-dialog
      destroy-on-close
      v-model="isTabs"
      :width="normalStyle.width"
      :close-on-click-modal="false"
      class="tabs-dialog"
    >
      <el-tabs v-model="activeTab" class="m_tabs">
        <el-tab-pane label="统计代码" name="first" class="m_tabs_pane">
          <el-scrollbar>
            <p>
              初始化代码: {{ stateInfo.statsCodeInit }}
              <copy :content="stateInfo.statsCodeInit" v-if="stateInfo.statsCodeInit"></copy>
            </p>
            <p>
              统计代码URL: {{ stateInfo.statsCodeJsUrl }}
              <copy :content="stateInfo.statsCodeJsUrl" v-if="stateInfo.statsCodeJsUrl"></copy>
            </p>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog destroy-on-close v-model="isPageComponentTab" title="页面组件" :close-on-click-modal="false">
      <el-form :model="pageComponentFormModel">
        <el-row>
          <el-col :span="1"></el-col>
          <el-col :span="14">
            <el-form-item label="初始化代码:" prop="statsCodeInit">
              {{ pageComponentFormModel.statsCodeInit }}
              <copy :content="pageComponentFormModel.statsCodeInit" v-if="pageComponentFormModel.statsCodeInit"></copy>
            </el-form-item>
            <el-form-item label="统计代码URL:" prop="cid">
              {{ pageComponentFormModel.statsCodeJsUrl }}
              <copy
                :content="pageComponentFormModel.statsCodeJsUrl"
                v-if="pageComponentFormModel.statsCodeJsUrl"
              ></copy>
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog v-model="isMemoTab" title="备注" :close-on-click-modal="false" destroy-on-close>
      <p>{{ memoInfo }}</p>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import i18n from '@/i18n'
import ManageSiteSelect from '@/components/manageSiteSelect/index.vue'
const { t } = i18n.global as any
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const initAccountInfo = () => ({})
const accountInfo = reactive<any>(initAccountInfo())
import {
  reqGetALLWebsiteList,
  reqListTemplate,
  reqWebsiteCodeAdd,
  reqWebsiteCodeEdit,
  reqListBlurTemplateAndSketchCode
} from '@/api/site/index'
const handleSelectUserId = (item: { loginId: string; userId: string }) => {
  queryForm.ownerUserId = item.userId
}
let backUpOwnerUserIdList: string[] = []
const querySearchUserLogin = async (queryString: string, cb: (arg: any) => void) => {
  try {
    const query: IReqUserListFilterQueryParams = {
      manageSiteId: manageSite.manageSiteId,
      userId: queryString,
      filterType: 'w',
      page: 1,
      size: 100
    }
    const response = await reqUserListFilter(filteredQuery<IReqUserListFilterQueryParams>(query))
    if (response.success && response.data) {
      const results = response.data.list.map((item: any) => ({
        value: item.userId,
        loginId: item.loginId,
        userId: item.userId
      }))
      backUpOwnerUserIdList = response.data.list.map((item: any) => item.userId)
      cb(results)
    } else {
      cb([])
    }
  } catch (error) {
    console.error('Error fetching domain suggestions:', error)
    ElMessage.error('获取用户id时出错')
    cb([])
  }
}
import { unitFormatDate } from '@/utils/dateFormat/index'
import { reqUserListFilter, reqUserList as reqUserListInput } from '@/api/user/index'

import EditOrAddTemplate from '@/views/Site/templateManagement/components/editOrAddTemplate.vue'
import AddWebsite from './siteManagement/components/addWebsite.vue'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { ElMessageBox } from 'element-plus'
import { useOptions, optionsLang, optionsArea, textAreaLimit } from '@/const/options'
import { websiteStatus } from '@/const/options'
import { addTypeToObjects, changeJsonToArr, filteredQuery } from '@/utils/dataFormat'
import { reqUserList } from '@/api/user'
import router from '@/router'
import { sessionCache } from '@/hooks/useSession'
import EditWebsiteTabs from '@/views/Site/editWebsiteTabs.vue'
import { useModalsStore } from '@/stores/modalStore'
import { SiteInfo } from '@/api/manageSite/manageSiteList/types'
import { IReqUserListFilterQueryParams } from '@/api/user/type'
import { reactive } from 'vue'
import {
  IListBlurTemplateAndSketchCodeData,
  IReqGetALLWebsiteListQueryParams,
  IReqListBlurTemplateAndSketchCodeData,
  IReqListBlurTemplateAndSketchCodeQueryParams,
  IReqWebsiteCodeAddQueryParams
} from '@/api/site/types'
const queryRef = ref()
const { formatData: formatLanguageData } = useOptions(optionsLang)
const { formatData: formatAreaData } = useOptions(optionsArea)
const activeName = ref('first')
// const onSiteSelect = (val: SiteInfo) => {
//   queryForm.manageSiteId = val.manageId
// }
const emit = defineEmits(['closeEvent'])
interface pageComponentFormModelInterface {
  statsCodeInit: string
  statsCodeJsUrl: string
}
const count = (top: any, bool?: false) => {
  let height = window.innerHeight - 145
  if (bool) {
    height = height - 55
  }
  if (top) {
    height = height - top?.getBoundingClientRect().height
  }
  return height
}
const initForm = () => ({
  templateId: '',
  templateName: '',
  sketchCode: '',
  sysTemplateRef: '',
  isSysTemplate: 'n',
  ownerUserId: '',
  onlineServiceCode: '',
  theme: '',
  loginStyle: [],
  thirdLoginStyle: [],
  memo: '',
  templateStatus: 'y',
  hasStatsCode: 'y',
  statsCodeJsUrl: '',
  statsCodeInit: '',
  cdnUrl: ''
})

const closeTabs = (isNeedRefresh = true) => {
  modalsStore.setModalData('templateInfoModal', {
    canHandleSubmit: false
  })
  modalsStore.hideModal('templateInfoModal')
  distinguish.value = false
  isTabs.value = false
  Object.assign(addForm.value, initForm())
  templateInfo.value = initTemplateInfo()
  modalsStore.setActiveTab('templateInfoModal', 'tab1')
  if (isNeedRefresh) {
    pageObj.value.page = 1
  }
  fetchData({
    ...queryForm,
    ...pageObj.value
  })
  modalsStore.hideModal('templateInfoModal')
  modalsStore.setActiveTab('templateInfoModal', 'tab1')
  templateInfo.value = initTemplateInfo()
  emit('closeEvent')
}
const pageComponentFormModelInit = (): pageComponentFormModelInterface => ({
  statsCodeInit: '',
  statsCodeJsUrl: ''
})
const pageComponentFormModel = reactive<pageComponentFormModelInterface>(pageComponentFormModelInit())
interface TemplateInfoInterface {
  templateId: string
  templateName: string
  sketchCode: string
  sysTemplateRef: string
  isSysTemplate: 'n' | 'y'
  ownerUserId: string
  onlineServiceCode: string
  theme: string
  loginStyle: any[]
  thirdLoginStyle: any[]
  memo: string
  templateStatus: string
  hasStatsCode: string
  statsCodeJsUrl: string
  statsCodeInit: string
  cdnUrl: string
}
const initTemplateInfo = (): TemplateInfoInterface => ({
  templateId: '',
  templateName: '',
  sketchCode: '',
  sysTemplateRef: '',
  isSysTemplate: 'n',
  ownerUserId: '',
  onlineServiceCode: '',
  theme: '',
  loginStyle: [],
  thirdLoginStyle: [],
  memo: '',
  templateStatus: 'y',
  hasStatsCode: 'y',
  statsCodeJsUrl: '',
  statsCodeInit: '',
  cdnUrl: ''
})
const templateInfo = ref<TemplateInfoInterface>(initTemplateInfo())
const normalStyle: Ref<{ [key: string]: any }> = ref({
  width: '60%',
  height: '90%',
  style: { minHeight: '37rem' }
})

const initOptions = (): OptionItem[] => [
  {
    type: 'text',
    value: '',
    visible: true,
    label: '站点ID:',
    prop: 'websiteId',
    placeholder: '站点',
    textData: {
      isCopy: true
    },
    attrs: {
      clearable: true
    }
  },
  {
    type: 'input',
    value: '',
    label: '内部名称:',
    prop: 'websiteInnerName',
    placeholder: '内部名称',
    rules: [
      {
        required: true,
        message: '内部名称不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'input',
    value: '',
    label: '标题:',
    prop: 'websiteTitle',
    placeholder: '标题',
    rules: [
      {
        required: true,
        message: '标题不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'mAutoComplete',
    value: '',
    label: '绑定模版｜ID:',
    prop: 'websiteTemplateRef',
    attrs: {
      clearable: true,
      onChange(va) {
        if (va === '')
          Object.assign(
            importantOptions.value,
            importantOptions.value.map((optionItem) => {
              if (optionItem.type === 'select') {
                optionItem.children = []
                optionItem.value = []
              }
              console.log('opt', optionItem)

              return optionItem
            })
          )
      }
    },
    autoData: {
      httpReq: (e) => {
        const query: IReqListBlurTemplateAndSketchCodeQueryParams = {
          ...e,
          manageSiteId: manageSite.manageSiteId
        }
        reqListBlurTemplateAndSketchCode(query)
      },
      keyword: 'templateId',
      displayFields: ['templateName', 'templateId'],
      placeholder: '绑定模板ID',
      isList: false,
      isPage: true
    }
  },
  {
    type: 'input',
    value: '',
    label: '关键字:',
    prop: 'keyWords',
    placeholder: '关键字',
    rules: [
      {
        required: false,
        message: '关键字不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'input',
    value: '',
    label: '站点描述:',
    prop: 'describe',
    placeholder: '站点描述',
    rules: [
      {
        required: false,
        message: '站点描述不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    prop: 'ownerUserId',
    label: '用户ID:',
    type: 'mAutoComplete',
    value: '',
    autoData: {
      httpReq: (data) =>
        reqUserList({
          ...data,
          manageSiteId: manageSite.manageSiteId
        }),
      keyword: 'searchId',
      inputValue: 'userId',
      displayFields: ['loginId', 'userId'],
      placeholder: '',
      isList: true,
      isPage: true
    }
  },
  {
    type: 'input',
    value: '',
    label: 'CDN地址:',
    prop: 'cdnUrl',
    placeholder: 'CDN地址',
    attrs: {
      clearable: true
    },
    rules: [
      {
        required: false,
        message: '',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'radio-group',
    value: 'y',
    label: '状态:',
    prop: 'websiteStatus',
    placeholder: '状态',
    rules: [
      {
        required: false,
        message: '状态不能为空',
        trigger: 'change'
      }
    ],
    children: addTypeToObjects(websiteStatus, 'radio')
  },
  {
    type: 'select',
    value: '',
    label: '语言:',
    prop: 'langCodes',
    placeholder: '语言',
    attrs: {
      multiple: true,
      style: {
        width: '100%'
      }
    },
    rules: [],
    children: addTypeToObjects(optionsLang, 'option')
  },
  {
    type: 'select',
    value: [],
    label: '地区:',
    prop: 'areaCodes',
    placeholder: '地区',
    attrs: { multiple: true },
    children: addTypeToObjects(optionsArea, 'option')
  },
  {
    type: 'input',
    value: '',
    label: '初始化代码:',
    prop: 'statsCodeInit',
    placeholder: '初始化代码',
    rules: [
      {
        required: false,
        message: '初始化代码不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      type: 'textarea',
      clearable: true,
      showWordLimit: true,
      maxlength: textAreaLimit
    }
  },
  {
    type: 'input',
    value: '',
    label: '统计代码URL:',
    prop: 'statsCodeJsUrl',
    placeholder: '统计代码',
    rules: [
      {
        required: false,
        message: '统计代码不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true,
      showWordLimit: true,
      maxlength: textAreaLimit,
      type: 'textarea'
    }
  },

  {
    type: 'input',
    value: '',
    label: '在线客服代码:',
    prop: 'onlineServiceCode',
    placeholder: '在线客服代码',
    rules: [
      {
        required: false,
        message: '在线客服代码不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true,
      showWordLimit: true,
      maxlength: textAreaLimit,
      type: 'textarea'
    }
  },
  {
    type: 'input',
    value: '',
    label: '备注:',
    prop: 'memo',
    placeholder: '备注',
    rules: [
      {
        required: false,
        message: '备注不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true,
      showWordLimit: true,
      maxlength: textAreaLimit,
      type: 'textarea'
    }
  },
  {
    type: 'dateText',
    value: '',
    label: '创建时间:',
    prop: 'createTime',
    placeholder: '',
    attrs: {
      clearable: false
    }
  }
]
const importantOptions = ref(initOptions())
const addOptions = () => filterOptions(initOptions(), ['createTime', 'websiteId'], true)
const addEditWebsiteRef = ref()
function filterOptions<T extends { prop: string; type: string; value: any }>(
  options: T[],
  propsToRemove: string[],
  isClean: boolean = false
): T[] {
  return options
    .filter((option) => !propsToRemove.includes(option.prop))
    .map((item) => {
      let newItem = { ...item }
      if (newItem.type === 'text') {
        newItem.type = 'input'
      }
      if (isClean) {
        switch (newItem.type) {
          case 'select':
            newItem.value = []
            break
          case 'radio':
          case 'radio-group':
            newItem.value = 'y'
            break
          default:
            newItem.value = ''
        }
      }
      return newItem
    })
}

const initQueryForm = (): IReqGetALLWebsiteListQueryParams => ({
  page: 1,
  size: 15,
  manageSiteId: '',
  websiteId: '',
  websiteInnerName: '',
  websiteTitle: '',
  describe: '',
  ownerUserId: '',
  websiteTemplateRef: '',
  langCodes: [],
  areaCodes: [],
  sortOrder: 'DESC',
  sortName: 'create_time',
  searchId: ''
})
const initAddForm = (): IReqWebsiteCodeAddQueryParams => ({
  manageSiteId: '',
  // websiteId: '',
  ownerUserId: '',
  websiteInnerName: '',
  websiteTitle: '',
  describe: '',
  keyWords: '',
  onlineServiceCode: '',
  hasStatsCode: 'y',
  websiteTemplateRef: '',
  websiteStatus: 'y',
  langCodes: [],
  areaCodes: [],
  memo: ''
})

const initStateInfo = () => ({
  websiteStatus: '',
  statsCodeInit: '',
  statsCodeJsUrl: ''
})

const initPageObj = () => ({
  page: 1,
  size: 15
})
const pageObj = ref(initPageObj())

const distinguish = ref<boolean>(false)

const isEditDialogModel = ref<boolean>(false)
const isAddDialogModel = ref<boolean>(false)
const isEditForm = ref<boolean>(false)
const isTabs = ref<boolean>(false)
const isMemoTab = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isLoading2 = ref<boolean>(false)
const total = ref<number>(0)
const formRef: any = ref()
const tableList: any = ref([])
const addForm = ref<IReqWebsiteCodeAddQueryParams>(initAddForm())
const queryForm = reactive<IReqGetALLWebsiteListQueryParams>(initQueryForm())
const stateInfo = ref(initStateInfo())
const memoInfo = ref()
const remoteTemplateOptions: any = ref([])
const activeTab = ref('first')

type DefaultObjectType = {
  [key: string]: any
}

const replaceKeyName = <T extends DefaultObjectType>(obj: T, oldKey: keyof T, newKey: string): DefaultObjectType => {
  const { [oldKey]: oldValue, ...rest } = obj
  return {
    ...rest,
    [newKey]: oldValue
  }
}
async function fetchData(_vals: any = { ...queryForm, ...initPageObj() }) {
  if (!queryForm.manageSiteId) {
    ElMessage({
      message: '请选择一个站点',
      type: 'warning'
    })
    return
  }

  let vals = { ..._vals }
  if (_vals.templateId) {
    vals = replaceKeyName(_vals, 'templateId', 'websiteTemplateRef')
  }
  isLoading.value = true
  try {
    const query: IReqGetALLWebsiteListQueryParams = {
      ...vals,
      manageSiteId: manageSite.manageSiteId
    }
    // IReqGetALLWebsiteListQueryParams
    // IReqGetALLWebsiteListData
    let res = await reqGetALLWebsiteList(query)
    tableList.value = res.data.list
    total.value = Number(res.data.total)
    if (res.success) {
    } else {
      ElMessage({
        showClose: true,
        message: res.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

/**
 * Filters an array of objects by removing items whose `prop` matches any string in the provided filter array.
 *
 * @param items - The original array of objects to filter.
 * @param filterProps - An array of strings representing the `prop` values to be removed from the items array.
 * @returns A new array of objects with the specified `prop` values removed.
 */
function filterItemsByProp(
  items: Array<{
    type: string
    value: string
    label: string
    prop: string
    placeholder?: string
    rules?: Array<any>
    attrs?: object
  }>,
  filterProps: string[]
): Array<{
  type: string
  value: string
  label: string
  prop: string
  placeholder?: string
  rules?: Array<any>
  attrs?: object
}> {
  return items.filter((item) => !filterProps.includes(item.prop))
}
const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
  Object.assign(pageObj.value, initPageObj())
  fetchData({ ...queryForm, ...pageObj.value })
}
const initSonFormData = () => {
  return {
    areaCodes: [],
    createTime: '',
    describe: '',
    hasStatsCode: 'y',
    keyWords: '',
    langCodes: [],
    memo: '',
    onlineServiceCode: '',
    ownerUserId: '',
    statsCodeInit: '',
    statsCodeJsUrl: '',
    websiteId: '',
    websiteInnerName: '',
    websiteStatus: 'y',
    websiteTemplateRef: '',
    websiteTitle: ''
  }
}
const sonFormData = ref(initSonFormData())
const addButton = (queryForm) => {
  if (!queryForm.manageSiteId) {
    ElMessage({
      message: '请选择一个站点',
      type: 'warning'
    })
    return
  }

  isAddDialogModel.value = true
  activeName.value = 'first'
  distinguish.value = false
  let innerFormData
  if (!formRef.value) {
    innerFormData = initFormData()
  } else {
    innerFormData = formRef.value.getFormData()
  }
  initSonFormData()
}
const addActiveName = 'add'
interface WebsiteInter {
  areaCodes: string[]
  cdnUrl: string
  createTime: number
  describe: string
  hasStatsCode: string
  keyWords: string
  langCodes: Array<string>
  memo: string
  onlineServiceCode: string
  ownerUserId: string
  statsCodeInit: string
  statsCodeJsUrl: string
  templateName: string
  userName: string
  websiteId: string
  websiteInnerName: string
  websiteStatus: string
  websiteTemplateRef: string
  websiteTitle: string
}
const initFormData = (): WebsiteInter => ({
  areaCodes: [],
  cdnUrl: '',
  createTime: 0,
  describe: '',
  hasStatsCode: 'y',
  keyWords: '',
  langCodes: [],
  memo: '',
  onlineServiceCode: '',
  ownerUserId: '',
  statsCodeInit: '',
  statsCodeJsUrl: '',
  templateName: '',
  userName: '',
  websiteId: '',
  websiteInnerName: '',
  websiteStatus: 'y',
  websiteTemplateRef: '',
  websiteTitle: ''
})
interface DefaultObj {
  [key: string]: {
    children: any[]
  }
}

interface OptionItem {
  prop: string
  value: any
  type: string
  children?: any[]
  label: string
  placeholder?: string
  rules?: Array<{ [key: string]: any }>
  attrs?: { [key: string]: any }
  [key: string]: any
}

interface PromiseResponse {
  data: any
  success: boolean
  errCode: number
  errMessage: string
  [key: string]: any
}

function packPromise(promiseObj: Promise<any>): Promise<PromiseResponse> {
  const initialResponse: PromiseResponse = {
    data: [],
    success: true,
    errCode: 0,
    errMessage: ''
  }
  return promiseObj
    .then((result) => {
      const {
        data = initialResponse.data,
        success = initialResponse.success,
        errCode = initialResponse.errCode,
        errMessage = initialResponse.errMessage
      } = result

      return { data, success, errCode, errMessage }
    })
    .catch((error) => {
      console.error('Promise rejected:', error)
      return initialResponse
    })
}
const handleEdit = (row) => {
  modalsStore.setActiveTab('websiteInfoModal', 'tab1')
  modalsStore.setModalData('websiteInfoModal', {
    websiteId: row.websiteId,
    showOtherTabs: true,
    websiteInnerName: row.websiteInnerName,
    hasRightToSubmit: true,
    canHandleSubmit: true,
    isVisible: true
  })
  modalsStore.showModal('websiteInfoModal')
}
const ownerUserForm = ref<boolean>(false)
const showUserInfoDialog = (row) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    ...modalsStore.userInfoModal.modalData,
    showCommitButton: false,
    userId: row.ownerUserId
  })
  modalsStore.showModal('userInfoModal')
}
const modalsStore = useModalsStore()
const showTemplateInfoDialog = (row) => {
  modalsStore.setActiveTab('templateInfoModal', 'tab1')
  modalsStore.setModalData('templateInfoModal', {
    showOtherTabs: true,
    templateName: row.templateName,
    templateId: row.websiteTemplateRef,
    canHandleSubmit: false
  })
  modalsStore.setActiveTab('templateInfoModal', 'tab1')
  modalsStore.showModal('templateInfoModal')
}
function removeProperty<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = obj
  return rest
}

const stateChange = (row) => {
  let { createTime, userName, hasStatsCode, ...rest } = row.row
  rest.websiteStatus = row.websiteStatus
  Object.assign(addForm.value, { ...rest })
  if (addForm.value.websiteStatus == 'c') {
    ElMessageBox.confirm(t('pop.areyousurepage'), t('pop.warn'), {
      confirmButtonText: t('button.determine'),
      cancelButtonClass: t('button.cancel'),
      type: 'warning'
    }).then(() => {
      editFormInfo()
    })
  } else if (addForm.value.websiteStatus == 'm') {
    ElMessageBox.confirm(t('pop.areyousurepageMaintenance'), t('pop.warn'), {
      confirmButtonText: t('button.determine'),
      cancelButtonClass: t('button.cancel'),
      type: 'warning'
    }).then(() => {
      editFormInfo()
    })
  } else if (addForm.value.websiteStatus == 'y') {
    ElMessageBox.confirm(t('pop.areyousurepageOpen'), t('pop.warn'), {
      confirmButtonText: t('button.determine'),
      cancelButtonClass: t('button.cancel'),
      type: 'warning'
    }).then(() => {
      editFormInfo()
    })
  } else {
    editFormInfo()
  }
}
let selectableTemplateRefList: IListBlurTemplateAndSketchCodeData[] = []

const submitInfo = (formRefval) => {
  isLoading2.value = true
  formRefval.validate((valid, fields) => {
    if (valid) {
      formRefval.validate(async (valid, fields) => {
        if (valid) {
          if (distinguish.value) {
            editFormInfo()
          } else {
            addFormInfo()
          }
        } else {
          console.log('error submit!', fields)
          isLoading2.value = false
        }
      })
    } else {
      console.log('error submit!', fields)
      isLoading2.value = false
    }
  })
}

const addFormInfo = async () => {
  try {
    const query: IReqWebsiteCodeAddQueryParams = {
      ...addForm.value,
      manageSiteId: manageSite.manageSiteId
    }
    let res = await reqWebsiteCodeAdd(query)
    if (res.success) {
      ElMessage({
        showClose: true,
        message: t('table.controls') + t('errorCode.0'),
        type: 'success'
      })
      fetchData({
        ...Object.assign(queryForm, initQueryForm()),
        ...Object.assign(pageObj.value)
      })
      isAddDialogModel.value = false
      Object.assign(addForm.value, initAddForm())
    } else {
      ElMessage({
        showClose: true,
        message: res.errMessage,
        type: 'error'
      })
    }
  } catch (err) {
    console.log(err)
  } finally {
    isLoading2.value = false
  }
}
onMounted(() => {
  // fetchData()
  // reqListBlurTemplateAndSketchCode({ templateId: '', manageSiteId: manageSite.manageSiteId }).then(
  //   (res) => {
  //     selectableTemplateRefList = Object.assign({}, res?.data)
  //   }
  // )
})

watch(
  () => [queryForm.page, queryForm.size],
  (newValue) => {
    fetchData()
  }
)

const editFormInfo = async () => {
  try {
    const editedForm = removeProperty(addForm.value, 'hasStatsCode')
    const res = await reqWebsiteCodeEdit({ ...editedForm })
    if (res.success) {
      ElMessage({
        showClose: true,
        message: t('table.controls') + t('errorCode.0'),
        type: 'success'
      })
      fetchData({
        ...Object.assign(queryForm),
        ...Object.assign(pageObj.value)
      })
      isEditDialogModel.value = false
      Object.assign(addForm.value, initAddForm())
    } else {
      ElMessage({
        showClose: true,
        message: res.errMessage,
        type: 'error'
      })
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading2.value = false
  }
}
const handleSizeChange = (val) => {
  pageObj.value.size = val
  // fetchData({ ...queryForm, ...pageObj.value })
}
const handleCurrentChange = (val) => {
  pageObj.value.page = val
  // fetchData({ ...queryForm, ...pageObj.value })
}
async function remoTetemplateIdChange(val) {
  if (val) {
    try {
      const query: IReqListBlurTemplateAndSketchCodeQueryParams = {
        templateId: val,
        manageSiteId: manageSite.manageSiteId
      }
      let res = await reqListBlurTemplateAndSketchCode(query)
      remoteTemplateOptions.value = res.data
    } catch (err) {}
  } else {
    remoteTemplateOptions.value = []
  }
}

const closeAddDialog = () => {
  isAddDialogModel.value = false
  isAddDialogModel.value = false
  isEditForm.value = false
  isTabs.value = false
  distinguish.value = false
  isMemoTab.value = false
  Object.assign(addForm.value, initAddForm())
}
const closeUserDialog = () => {
  Object.assign(accountInfo, initAccountInfo())
  ownerUserForm.value = false
}

const handTabs = (row) => {
  isTabs.value = true
  let { createTime, userName, ...rest } = row
  Object.assign(stateInfo.value, { ...rest })
}
const isPageComponentTab: Ref<boolean> = ref(false)

/**
 * Open a route in a new tab.
 *
 * @param {string} route The route path.
 * @param {Record<string, string>} params The route query parameters.
 */
function openInNewTab(route: string, params: Record<string, string>) {
  const routeData = router.resolve({
    path: route,
    query: params
  })
  window.open(routeData.href, '_blank')
}

const handPageComponentTab = (row) => {
  sessionCache.setCache('siteRowInfo', row)
  const websiteId = row.websiteId
  openInNewTab('/webVision', { websiteId })
}
</script>

<style scoped lang="less">
:deep(.el-dialog__body) {
  overflow-y: auto;
}

.el-row > .is-guttered {
  padding-right: 50px;
}

.el-form-item__label {
  padding: 100px;
}

.account-table {
  .account-role {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.checked {
  .el-checkbox {
    width: 100px;
  }
}

.phone {
  display: flex;

  p {
    font-size: 22px;
  }

  .one {
    margin: 0 10px;

    .onee {
      width: 80px;
    }
  }

  .two {
    .twoo {
      width: 180px;
    }
  }
}

.secret-key {
  display: flex;

  .one {
    .onee {
      width: 200px;
      margin-right: 20px;
    }
  }
}

.el-dropdown,
.el-link__inner {
  cursor: pointer;
}
#system_account {
  height: 100%;
  padding: 10px 0px 10px 0px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.pagination,
.search {
  flex-shrink: 0;
}
.main_flex_table {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
