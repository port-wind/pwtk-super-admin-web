<template>
  <section id="system_account" class="main_container">
    <section id="navSearchForm" ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="manageSiteId">
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item>
        <el-form-item label="" prop="hostDomain">
          <UniRemoteInput
            v-model="queryForm.hostDomain"
            valueKey="hostDomain"
            labelKey="hostDomain"
            searchKey="hostDomain"
            placeholder="域名"
            :fetchOptions="fetchDomainList"
            :limitTrigger="{ trigger: true, limit: 4 }"
            :formatLabel="(item) => `${item.hostDomain}`"
          />
        </el-form-item>
        <el-form-item label="" prop="navPageTemplate">
          <UniRemoteInput
            v-model="queryForm.navPageTemplate"
            valueKey="navPageTemplate"
            labelKey="navPageTemplate"
            searchKey="navPageTemplate"
            placeholder="导航页模版"
            @option-change="onSearchOptionChange"
            :fetchOptions="queryTemplates"
            :formatLabel="(item) => `${item.navPageTemplate}`"
          />
        </el-form-item>
        <el-form-item label="" prop="targetUrl">
          <UniRemoteInput
            v-model="queryForm.targetUrl"
            valueKey="targetUrl"
            labelKey="targetUrl"
            searchKey="targetUrl"
            placeholder="目标URL"
            :fetchOptions="queryUrls"
            :formatLabel="(item) => `${item.targetUrl}`"
          />
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="handleQuery" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleReset" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="openAddDialog">
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
        :key="isExpanded"
        :data="tableData"
        ref="tableRef"
        row-key="hostDomain"
        v-loading="isLoading"
        style="height: 100%; overflow-x: hidden"
        :row-class-name="tableRowClassName"
        :scrollbar-always-on="false"
        :header-cell-style="{ 'background-color': '#fafafa' }"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <el-table-column type="expand" width="30">
          <template #default="{ row }">
            <NaviNestedTable
              :data="row.children"
              @editFromInside="editFromInside"
              @rowAddFromInside="rowAddFromInside"
            />
          </template>
        </el-table-column>

        <el-table-column label="域名" prop="hostDomain" align="left" width="200">
          <template #="{ row }">
            <span @click="handleEdit(row)" class="like-a">
              {{ row.hostDomain }}
            </span>
            <!-- <copy
              :content="row.hostDomain"
              style="margin-left: 3px"
            ></copy> -->
          </template>
        </el-table-column>

        <el-table-column label="状态" align="left" key="status" prop="status" width="70">
          <template #default="{ row, $index }">
            <span style="margin-right: 10px">{{ row.status === 'y' ? '启用' : '关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="端口" align="right" width="60" prop="hostPort" />
        <el-table-column label="使用https" align="left" width="90" prop="isHttps">
          <template #="{ row }">{{ formatSupport([row.isHttps]) }}</template>
        </el-table-column>
        <el-table-column label="导航方式" align="left" prop="navOutStyle" width="110">
          <template #="{ row }">{{ formatNavOutStyle([row.navOutStyle]) }}</template>
        </el-table-column>

        <el-table-column label="延迟秒数" align="right" width="80" prop="navDelaySeconds" />
        <el-table-column label="导航页模版" align="left" width="120" prop="navPageTemplate" />
        <el-table-column label="目标URL" align="left" prop="targetUrl" min-width="200">
          <!-- <template #="{ row }"> -->
          <!-- <p
              class="like-a"
              @click="handleTargetUrl(row)"
            >
              {{ formateStrNum(row.targetUrl, 15, 5, 9) }}
            </p> -->
          <!-- <linkWithCopy
              :row-data="row"
              :config="{ idKey: 'targetUrl', notShowLink: false }"
              :limit-func="(str) => formateStrNum(str, 15, 5, 7)"
              @action="() => handleTargetUrl(row)"
            /> -->
          <!-- </template> -->
        </el-table-column>
        <el-table-column :label="t('table.controls')" align="center" width="100">
          <template #="{ row }">
            <el-button type="success" plain size="small" @click="handleRowAdd(row)">新增下级</el-button>
          </template>
        </el-table-column>
        <el-table-column width="190"></el-table-column>
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
      draggable
      overflow
      destroy-on-close
      class="tabs-dialog"
      v-model="isDialogVisible"
      :close-on-click-modal="false"
      @close="resetForm"
    >
      <el-tabs class="m_tabs" v-model="activeTab">
        <el-tab-pane label="导航站" name="navigation" class="m_tabs_pane">
          <el-scrollbar height="100%" class="cc-scrollbar">
            <el-form :model="form" ref="formRef" :rules="rules" :style="{ flex: isEditMode ? '' : '1' }">
              <el-row justify="center" v-if="isEditMode">
                <el-col :span="10">
                  <div class="cc-host-port">
                    <div class="cc-host">
                      <el-form-item label="域名:" prop="hostDomain" label-width="90px">
                        <div>
                          {{ form.hostDomain }}
                          <copy :content="form.hostDomain" />
                        </div>
                      </el-form-item>
                    </div>
                    <div class="cc-port">
                      <el-form-item label="端口:" label-width="50px" prop="hostPort">
                        <el-input
                          v-model="form.hostPort"
                          type="number"
                          :max="65535"
                          @change="(val) => handleNumberChange(val, form)"
                          autocomplete="off"
                          placeholder="端口"
                        />
                      </el-form-item>
                    </div>
                  </div>
                  <el-form-item label="导航方式:" prop="navOutStyle" label-width="90px">
                    <el-radio-group v-model="form.navOutStyle" @change="(val) => navOutStyleChange(val, form)">
                      <el-radio v-for="item in optionsNavOutStyle" :value="item.value">
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="延迟秒数:"
                    prop="navDelaySeconds"
                    :class="{ 'is-required': showNavigationDelay }"
                    label-width="90px"
                  >
                    <el-input
                      v-model="form.navDelaySeconds"
                      type="number"
                      :min="0"
                      :max="60"
                      @change="(val) => handleNumberChange(val, form, 'navDelaySeconds', 60)"
                      v-if="showNavigationDelay"
                      style="width: 20%"
                      autocomplete="off"
                      placeholder="延迟秒数"
                    />
                    <el-input
                      v-else
                      :model-value="0"
                      type="number"
                      disabled
                      style="width: 20%"
                      autocomplete="off"
                      placeholder="延迟秒数"
                    />
                  </el-form-item>
                  <el-form-item
                    label="目标URL:"
                    prop="targetUrl"
                    :class="{ 'is-required': showTargetURL }"
                    label-width="90px"
                  >
                    <el-input
                      v-model="form.targetUrl"
                      :disabled="!showTargetURL"
                      @change="(val) => handleUrlChange(val, form)"
                      autocomplete="off"
                      :maxLength="256"
                      placeholder="目标URL"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="创建时间:" prop="createTime">
                    <p>
                      {{ unitFormatDate(form.createTime || '') }}
                    </p>
                  </el-form-item>
                  <el-form-item label="状态:" prop="status" class="status-outside">
                    <el-radio-group v-model="form.status">
                      <el-radio value="y">开启</el-radio>
                      <el-radio value="n">关闭</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="使用https:" prop="isHttps">
                    <el-radio-group v-model="form.isHttps">
                      <el-radio v-for="item in optionsSupport" :value="item.value">
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="导航页模版:"
                    prop="navPageTemplate"
                    :class="{ 'is-required': showNavigationTemplate }"
                  >
                    <UniRemoteInput
                      v-if="showNavigationTemplate"
                      v-model="form.navPageTemplate"
                      :search-obj="{ navOutStyle: form.navOutStyle }"
                      valueKey="navPageTemplate"
                      labelKey="navPageTemplate"
                      searchKey="navPageTemplate"
                      placeholder="导航页模版"
                      event-focus="focus"
                      @option-change="onOptionChange"
                      :fetchOptions="queryTemplates"
                      :formatLabel="(item) => `${item.navPageTemplate}`"
                    />
                    <el-input v-else disabled autocomplete="off" placeholder="导航页模版" />
                  </el-form-item>
                  <el-form-item
                    label="导航算法:"
                    prop="navSelectionAlgorithm"
                    :class="{ 'is-required': showNavigationAlgorithm }"
                  >
                    <el-radio-group v-if="showNavigationAlgorithm" v-model="form.navSelectionAlgorithm">
                      <el-radio v-for="item in optionsNavAlgo" :value="item.value">
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                    <el-radio-group v-else disabled>
                      <el-radio v-for="item in optionsNavAlgo" :value="item.value">
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row justify="center" v-else>
                <el-col :span="14">
                  <div class="cc-host-port">
                    <div class="cc-host">
                      <el-form-item label="域名:" prop="hostDomain">
                        <el-input
                          v-model="form.hostDomain"
                          maxLength="128"
                          @change="(val) => handleDomainChange(val, form)"
                          autocomplete="off"
                          placeholder="域名"
                        />
                      </el-form-item>
                    </div>
                    <div class="cc-port">
                      <el-form-item label="端口:" label-width="50px" prop="hostPort">
                        <el-input
                          v-model="form.hostPort"
                          type="number"
                          :max="65535"
                          @change="(val) => handleNumberChange(val, form)"
                          autocomplete="off"
                          placeholder="端口"
                        />
                      </el-form-item>
                    </div>
                  </div>
                  <el-form-item label="导航方式:" prop="navOutStyle">
                    <el-radio-group v-model="form.navOutStyle" @change="(val) => navOutStyleChange(val, form)">
                      <el-radio v-for="item in optionsNavOutStyle" :value="item.value">
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="延迟秒数:"
                    prop="navDelaySeconds"
                    :class="{ 'is-required': showNavigationDelay }"
                  >
                    <el-input
                      v-model="form.navDelaySeconds"
                      type="number"
                      :min="0"
                      :max="60"
                      @change="(val) => handleNumberChange(val, form, 'navDelaySeconds', 60)"
                      v-if="showNavigationDelay"
                      style="width: 20%"
                      autocomplete="off"
                      placeholder="延迟秒数"
                    />
                    <el-input
                      v-else
                      :model-value="0"
                      type="number"
                      disabled
                      style="width: 20%"
                      autocomplete="off"
                      placeholder="延迟秒数"
                    />
                  </el-form-item>
                  <el-form-item label="目标URL:" prop="targetUrl" :class="{ 'is-required': showTargetURL }">
                    <el-input
                      v-model="form.targetUrl"
                      :disabled="!showTargetURL"
                      @change="(val) => handleUrlChange(val, form)"
                      autocomplete="off"
                      :maxLength="256"
                      placeholder="目标URL"
                    />
                  </el-form-item>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="状态:" prop="status" class="status-outside">
                        <el-radio-group v-model="form.status">
                          <el-radio value="y">开启</el-radio>
                          <el-radio value="n">关闭</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="使用https:" prop="isHttps">
                        <el-radio-group v-model="form.isHttps">
                          <el-radio v-for="item in optionsSupport" :value="item.value">
                            {{ item.label }}
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-form-item
                    label="导航页模版:"
                    prop="navPageTemplate"
                    :class="{ 'is-required': showNavigationTemplate }"
                  >
                    <UniRemoteInput
                      v-if="showNavigationTemplate"
                      v-model="form.navPageTemplate"
                      :search-obj="{ navOutStyle: form.navOutStyle }"
                      valueKey="navPageTemplate"
                      labelKey="navPageTemplate"
                      searchKey="navPageTemplate"
                      placeholder="导航页模版"
                      event-focus="focus"
                      @option-change="onOptionChange"
                      :fetchOptions="queryTemplates"
                      :formatLabel="(item) => `${item.navPageTemplate}`"
                    />
                    <el-input v-else disabled autocomplete="off" placeholder="导航页模版" />
                  </el-form-item>
                  <el-form-item
                    label="导航算法:"
                    prop="navSelectionAlgorithm"
                    :class="{ 'is-required': showNavigationAlgorithm }"
                  >
                    <el-radio-group v-if="showNavigationAlgorithm" v-model="form.navSelectionAlgorithm">
                      <el-radio v-for="item in optionsNavAlgo" :value="item.value">
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                    <el-radio-group v-else disabled>
                      <el-radio v-for="item in optionsNavAlgo" :value="item.value">
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <div class="dialog-footer dialog-footer-submit cc-submit-line">
              <el-button @click="resetForm">取消</el-button>
              <el-button type="primary" :loading="isLoading" @click="handleSave">提交</el-button>
            </div>
            <el-divider v-if="isEditMode" />
            <section v-if="isEditMode">
              <section class="header-inside-dialog" style="display: flex; margin: 20px 50px">
                <span style="min-width: 70px">导航路径(</span>
                <el-breadcrumb :separator-icon="ArrowRight" style="display: flex">
                  <el-breadcrumb-item v-for="item in childrenHeaderList">
                    <span class="like-a" @click="handleEdit(item)">
                      {{ item.hostDomain }}
                    </span>
                  </el-breadcrumb-item>
                </el-breadcrumb>
                <h3>)</h3>
              </section>
              <section style="margin: 0 50px">
                <mTable
                  :options="options"
                  max-height="250"
                  :data="childrenListTableData"
                  isEditRow
                  :isLoading="loadingChildren"
                  show-overflow-tooltip
                  border
                  stripe
                  size="small"
                >
                  <template #isEdit="{ scope }">
                    <span @click="handleEdit(scope.row)" class="like-a">
                      {{ scope.row.hostDomain }}
                    </span>
                    <copy :content="scope.row.hostDomain" style="margin-left: 3px"></copy>
                  </template>
                  <template #isStatus="{ scope }">
                    <span style="margin-right: 10px">
                      {{ scope.row.status === 'y' ? '启用' : '关闭' }}
                    </span>
                  </template>
                  <template #isHttps="{ scope }">{{ formatSupport([scope.row.isHttps]) }}</template>
                  <template #isNavOutStyle="{ scope }">
                    {{ formatNavOutStyle([scope.row.navOutStyle]) }}
                  </template>
                </mTable>
              </section>
            </section>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { formateStrNum } from '@/utils/dataFormat'

import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  addNavigationConfig,
  editNavigationConfig,
  delNavigationConfig,
  fetchDomainList,
  fetchTreeList,
  queryTemplates,
  queryUrls,
  reqTreeListByDomain,
  fetchTreeListByPage,
  reqNavigationConfig
} from '../../../api/site/nav'
import mTable from '@/components/mTable/index.vue'
import i18n from '@/i18n'
import { useOptions, optionsNavAlgo, optionsSupport, optionsNavOutStyle } from '@/const/options'
import count from '@/utils/tableHeight'
import { createDomainValidator, createUrlValidator } from '@/utils/validators'
import UniRemoteInput from '@/components/uniRemoteInput/index.vue'

import { unitFormatDate, handleDomainChange, handleNumberChange, handleUrlChange } from '@/utils/dateFormat/index'
import { TableOptions } from '@/components/mTable/types'
import { createHostDomainMap, getNodeParents } from '@/views/Site/Navi/navType'
import { spawn } from 'child_process'
import { SiteInfo } from '@/api/manageSite/manageSiteList/types'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()

interface Form {
  hostDomain: string
  hostPort: number
  isHttps: string
  navOutStyle: string
  navPageTemplate: string
  navDelaySeconds: number
  navSelectionAlgorithm: string
  parentHostDomain: string
  targetUrl: string
  status: string
  hasHostDomain?: boolean
  hasParent?: boolean
  createTime?: string
  navTemplateCode?: string
}
const templateOps = ref()
const searchTemplateOps = ref()
const { formatData: formatNavAlgo } = useOptions(optionsNavAlgo)
const { formatData: formatSupport } = useOptions(optionsSupport)
const { formatData: formatNavOutStyle } = useOptions(optionsNavOutStyle)
const { t } = i18n.global as any
const initQueryFormValue = () => ({
  manageSiteId: '',
  hostDomain: '',
  navOutStyle: 'L',
  navSelectionAlgorithm: 'L',
  parentHostDomain: '',
  navPageTemplate: '',
  navTemplateCode: '',
  targetUrl: ''
})
const tableRef = ref()
const queryRef = ref()
const isExpanded = ref(false)
const formRef = ref()
const queryForm = reactive(initQueryFormValue())
const tableData = ref([])
const childrenListTableData = ref()
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const isLoading = ref(false)
const loadingChildren = ref(false)
const isDialogVisible = ref(false)
const dialogMode = ref()
// const isEditMode = ref(false)
const isAddMode = computed(() => dialogMode.value === 'add')
const isAddRowMode = computed(() => dialogMode.value === 'addRow')
const isEditMode = computed(() => dialogMode.value === 'edit')
const isUserInputQUery = computed(() => {
  console.log(queryForm.hostDomain, queryForm.navTemplateCode, queryForm.targetUrl)

  return !!queryForm.hostDomain || !!queryForm.navTemplateCode || !!queryForm.targetUrl
})
const showTargetURL = computed(() => ['h302', 'h301', 'delay', 'click', 'delay_click'].includes(form.navOutStyle))
const showNavigationAlgorithm = computed(() => ['auto_select_lines'].includes(form.navOutStyle))
const showNavigationDelay = computed(() =>
  ['delay', 'delay_click', 'delay_lines', 'auto_select_lines'].includes(form.navOutStyle)
)
const showNavigationTemplate = computed(() =>
  ['delay', 'click', 'delay_click', 'lines', 'delay_lines', 'auto_select_lines'].includes(form.navOutStyle)
)
const queryObj = computed(() => ({
  ...queryForm,
  ...pageObj.value
}))
const initPageObj = () => ({
  page: 1,
  size: 15
})

const pageObj = ref(initPageObj())
const onSiteSelect = (val: SiteInfo) => {
  queryForm.manageSiteId = val.manageId
}
const colSpan = computed(() => (isEditMode.value ? 12 : 14))
const DomainMap = ref()
// const childrenHeaderList = computed(() => {
//   const cList = (
//     tableData.value as unknown as { headerShow: boolean; hostDomain: string }[]
//   )?.filter((item) => item.headerShow)
//   return cList ?? []
// })
const childrenHeaderList = ref()

// watch(showNavigationDelay, (newValue) => {
//   // if (!newValue && form) {
//   //   form.navDelaySeconds = 0
//   // }
// })
const onOptionChange = (options) => {
  templateOps.value = options
}

const onSearchOptionChange = (options) => {
  searchTemplateOps.value = options
}
const initEditForm = () => ({
  hostDomain: '',
  hostPort: 80,
  isHttps: 'y',
  navOutStyle: 'h302',
  navPageTemplate: '',
  navDelaySeconds: 0,
  navSelectionAlgorithm: optionsNavAlgo[0].value,
  parentHostDomain: '',
  targetUrl: '',
  status: 'y',
  hasHostDomain: false
})
const form = reactive<Form>(initEditForm())
const rules = reactive({
  hostDomain: [
    { required: true, message: '请输入域名', trigger: 'blur' },
    { validator: createDomainValidator('域名格式不正确'), trigger: 'blur' }
  ],
  // parentHostDomain: [{ validator: createDomainValidator('上层域名格式不正确'), trigger: 'blur' }],
  navOutStyle: [{ required: true, message: '请选择导航方式' }],
  targetUrl: [
    {
      trigger: 'blur',
      validator: (_, value, callback) => {
        if (showTargetURL.value && !value) {
          callback(new Error('请输入目标URL'))
        } else {
          callback()
        }
      }
    },
    { validator: createUrlValidator('目标URL格式不正确'), trigger: 'blur' }
  ],
  navPageTemplate: [
    {
      trigger: 'change',
      validator: (_, value, callback) => {
        if (showNavigationTemplate.value && !value) {
          callback(new Error('请选择导航页模版'))
        } else {
          callback()
        }
      }
    }
  ],
  navSelectionAlgorithm: [
    {
      validator: (_, value, callback) => {
        console.log(form.navSelectionAlgorithm)

        if (showNavigationAlgorithm.value && !value) {
          callback(new Error('请选择导航算法'))
        } else {
          callback()
        }
      }
    }
  ]
})
const expandedKeys = ref([])
const navOutStyleChange = (newVal: string, form: any) => {
  form.navTemplateCode = ''
  form.navPageTemplate = ''

  setTimeout(() => {
    formRef.value.clearValidate('navPageTemplate')
    formRef.value.clearValidate('navTemplateCode')

    formRef.value.clearValidate('targetUrl')
  }, 0)
}
const handleSizeChange = (val) => {
  pageObj.value.size = val
  fetchData(queryObj.value)
}
const handleCurrentChange = (val) => {
  pageObj.value.page = val
  fetchData(queryObj.value)
}
const fetchData = async (val: { hostDomain?: string } = {}) => {
  let response = {}
  try {
    isLoading.value = true
    // response = val.hostDomain ? await reqTreeListByDomain(val) : await fetchTreeList(val)
    console.log(queryForm.hostDomain, queryForm.navTemplateCode, queryForm.targetUrl)
    response = isUserInputQUery.value
      ? await reqNavigationConfig({ ...val, ...pageObj.value })
      : await fetchTreeListByPage({ ...pageObj.value, manageSiteId: manageSite.manageSiteId })
    if (checkSuccess(response)) {
      tableRef.value?.setScrollTop(0)
      tableRef.value.setScrollLeft(0)
      // @ts-ignore
      tableData.value = initArr(response.data.list)
      // @ts-ignore
      total.value = Number(response.data.total) || 0
      console.log(val.hostDomain)

      if (!val.hostDomain) {
        DomainMap.value = createHostDomainMap(tableData.value)
        console.log(DomainMap.value)
      }
      // !val.hostDomain && (DomainMap.value = createHostDomainMap(tableData.value))
      isExpanded.value = !isExpanded.value
      console.log(tableData)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
const options: TableOptions[] = [
  {
    prop: 'hostDomain',
    label: '下级域名',
    width: '220',
    slot: 'isEdit'
  },
  // childrenSize
  {
    prop: 'childrenSize',
    label: '下级域名数量',
    width: '100',
    align: 'right'
  },
  {
    prop: 'status',
    label: '状态',
    width: '60',
    slot: 'isStatus'
  },
  {
    prop: 'hostPort',
    label: '端口',
    align: 'right',
    width: '60'
  },
  {
    prop: 'isHttps',
    label: '使用https',
    slot: 'isHttps',
    width: '80'
  },
  {
    prop: 'navOutStyle',
    label: '导航方式',
    width: '100',
    slot: 'isNavOutStyle'
  },
  {
    prop: 'navDelaySeconds',
    label: '延迟秒数',
    align: 'right',
    width: '70'
  },
  {
    prop: 'navPageTemplate',
    label: '导航页模版',
    width: '100'
  },
  {
    prop: 'targetUrl',
    label: '目标URL'
  }
]
const tableRowClassName = ({ row }) => {
  if (row.children?.length > 0) {
    return 'expand-icon'
  } else {
    return 'no-expand-icon'
  }
}
// 列表数据
const initArr = (arr, level = 0) => {
  let list: any[] = []
  if (arr) {
    arr.forEach((a, index) => {
      let obj: any = {
        ...a,
        createTime: a.createTime,
        level: level,
        lastLine: index === arr.length - 1,
        navDelaySeconds:
          a.navOutStyle === 'h302' || a.navOutStyle === 'h301' || a.navOutStyle === 'lines' || a.navOutStyle === 'click'
            ? 0
            : a.navDelaySeconds,
        navPageTemplate: a.navOutStyle === 'h302' || a.navOutStyle === 'h301' ? '' : a.navPageTemplate
      }
      delete obj.hasChildren
      if (a.children) {
        obj.children = initArr(a.children, level + 1)
      }
      list.push(obj)
    })
  }
  return list
}
const editFromInside = (val) => {
  handleEdit(val)
}
const rowAddFromInside = (val) => {
  handleRowAdd(val)
}
const handleExpand = (row, expanded) => {
  console.log(expandedKeys.value)
  console.log(row)

  if (expanded) {
    const childrenKeys = getAllChildrenKeys(row)
    //@ts-ignore
    expandedKeys.value = [...new Set([...childrenKeys])]
  } else {
  }
}
const getAllChildrenKeys = (row) => {
  const keys: any[] = []
  const traverse = (node: any) => {
    if (node.children && node.children.length) {
      keys.push(node.id)
      node.children.forEach(traverse)
    }
  }
  traverse(row)
  return keys
}
// const load = (row: any, treeNode: unknown, resolve: (date: any[]) => void) => {
//   setTimeout(() => {
//     const list = tableData.value.filter((r) => r.id === row.id)
//     resolve(list)
//   }, 1000)
// }

const handleEdit = async (row: any) => {
  dialogMode.value = 'edit'
  const { hostDomain } = row
  try {
    loadingChildren.value = true
    // isLoading.value = true
    const response = await reqTreeListByDomain({ hostDomain })
    childrenHeaderList.value = []
    if (checkSuccess(response)) {
      console.log(response)
      childrenHeaderList.value =
        response.data.ancestors?.map((item) => ({
          hostDomain: item.hostDomain
        })) || []
      childrenHeaderList.value.push({ hostDomain: hostDomain })
      onLoadDialog(response.data)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loadingChildren.value = false
    // isLoading.value = false
  }
  // childrenHeaderList.value = getNodeParents(DomainMap.value, row.hostDomain)

  Object.assign(form, { ...row })
}
const handleRowAdd = (row: any) => {
  dialogMode.value = 'addRow'
  onLoadDialog(row)
  const { hostDomain } = row
  Object.assign(form, { ...initEditForm(), parentHostDomain: hostDomain, hasHostDomain: true })
}
const onLoadDialog = (row: any) => {
  isDialogVisible.value = true

  childrenListTableData.value = []

  if (isEditMode && row.children?.length > 0) {
    childrenListTableData.value = row.children
  }
}
const checkSuccess = (res) => {
  if (res?.success) {
    return true
  }
  ElMessage({
    showClose: true,
    message: res.errMessage,
    type: 'error'
  })
  return false
}

const handleSave = async () => {
  let res
  try {
    let isValid = false
    await formRef.value.validate((valid, fields) => {
      isValid = valid
      if (valid) {
        console.log('submit!')
      } else {
        console.log('error submit!', fields)
      }
    })
    if (!isValid) {
      return
    }
    // @ts-ignore
    delete form.createTime
    form.navTemplateCode = templateOps.value?.find((op) => op.navPageTemplate === form.navPageTemplate)?.navTemplateCode
    if (isEditMode.value) {
      res = await editNavigationConfig(form)
    } else {
      res = await addNavigationConfig(form)
    }

    if (checkSuccess(res)) {
      isDialogVisible.value = false
      fetchData(queryForm)
      ElMessage.success('保存成功')
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

const handleQuery = () => {
  if (!queryForm.manageSiteId) {
    ElMessage({
      message: '请选择一个站点',
      type: 'warning'
    })
    return
  }
  isLoading.value = true
  console.log('Query with form data:', queryForm)
  queryForm.navTemplateCode = searchTemplateOps.value?.find(
    (op) => op.navPageTemplate === queryForm.navPageTemplate
  )?.navTemplateCode
  fetchData(queryForm)
}

const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  Object.assign(pageObj.value, initPageObj())
  fetchData(queryObj.value)
}
const handleTargetUrl = (row) => {
  window.open(row.targetUrl, '_blank')
}
const openAddDialog = () => {
  if (!queryForm.manageSiteId) {
    ElMessage({
      message: '请选择一个站点',
      type: 'warning'
    })
    return
  }
  dialogMode.value = 'add'
  resetForm()
  isDialogVisible.value = true
}

const resetForm = () => {
  isDialogVisible.value = false
  Object.assign(form, initEditForm())
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const activeTab = ref('navigation')

onMounted(() => fetchData(queryObj.value))
</script>

<style lang="less" scoped>
::v-deep .el-table__expanded-cell {
  tr {
    position: relative !important;
    left: 40px;
  }
}
::v-deep .el-table__placeholder {
  width: 0;
}
::v-deep .no-expand-icon {
  .el-table__expand-icon {
    display: none;
  }
}
::v-deep .status-outside {
  margin-bottom: 0;
}

.cc-submit-line {
  margin: 10px 0;
  // 靠右排列
  display: flex;
  justify-content: flex-end;
}

.cc-scrollbar {
  padding: 0 10px;
}

.cc-scrollbar :deep(.el-scrollbar__view) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cc-host-port {
  display: flex;
}

.cc-host {
  flex: 1;
}

.cc-port {
  width: 120px;
}
</style>
