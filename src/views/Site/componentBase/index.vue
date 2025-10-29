<template>
  <section id="system_account" class="main_container">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="manageSiteId">
          <ManageSiteSelect
            @onSelect="
              (val) => {
                searchButton({ ...queryForm, manageSiteId: val.manageId })
              }
            "
          />
        </el-form-item>
        <el-form-item label="" prop="componentId">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.componentId"
            maxlength="64"
            placeholder="组件ID"
          />
        </el-form-item>
        <el-form-item label="" prop="componentName">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.componentName"
            maxlength="64"
            placeholder="组件名称"
          />
        </el-form-item>
        <el-form-item label="" prop="sketchCodeList">
          <!-- <el-input @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
                        v-model="queryForm.sketchCodeList" maxlength="40" placeholder="草图代码" /> -->
          <el-select v-model="queryForm.sketchCodeList" multiple placeholder="草图代码">
            <!-- :label="item.sketchName + ' - ' + item.sketchCode" -->
            <el-option
              v-for="(item, index) in optionsAllSketch"
              :key="index"
              :label="item.sketchName + ' - ' + item.sketchCode"
              :value="item.sketchCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="componentType">
          <el-select v-model="queryForm.componentType" placeholder="组件类型">
            <el-option label="全部" value="L" />
            <el-option
              v-for="item in optionsAllCompType"
              :key="item.componentId"
              :label="item.componentType"
              :value="item.componentType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="status">
          <el-select v-model="queryForm.status" placeholder="状态">
            <el-option label="全部" value="L" />
            <el-option label="有效" value="y" />
            <el-option label="无效" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="isView">
          <el-select v-model="queryForm.isView" placeholder="可见">
            <el-option label="全部" value="L" />
            <el-option label="是" value="y" />
            <el-option label="否" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="searchButton({ ...queryForm, ...pageObj })" :loading="isLoading">
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
          <el-button type="success" @click="addButton">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <!-- :tableHeight="count(queryRef).toString()" -->
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="pageObj.page"
        :pageSize="pageObj.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #isView="{ scope }">
          <p v-if="scope.row.isView == 'y'">是</p>
          <p v-else>否</p>
        </template>
        <template #componentName="{ scope }">
          <el-link type="primary" :underline="false" @click="editButton(scope.row)">
            <el-text class="w-200px like-a" truncated>
              {{ scope.row.componentName }}
            </el-text>
          </el-link>
        </template>
        <template #status="{ scope }">
          <p v-if="scope.row.status == 'y'">有效</p>
          <p v-else>无效</p>
        </template>

        <template #sketchCode="{ scope }">
          {{ scope.row.sketchCodeList.join(',') }}
        </template>
        <template #button="{ scope }">
          <el-button size="small" type="primary" @click="viewButton(scope.row)" :loading="isLoading">查看</el-button>
        </template>
      </m-table>
    </section>
    <!-- 新增 / 编辑 -->
    <el-dialog
      draggable
      overflow
      destroy-on-close
      class="tabs-dialog"
      v-model="isForm"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-tabs class="m_tabs" v-model="activeTab">
        <el-tab-pane label="页面组件" name="componentBase" class="m_tabs_pane">
          <el-scrollbar class="cc-scrollbar">
            <el-form :model="addForm" ref="formRef" :rules="rulesAddFrom" class="single-form">
              <el-form-item label="组件ID:" v-if="isEditMode" prop="componentName">
                <p>
                  {{ addForm.componentId }}
                  <copy :content="addForm.componentId" />
                </p>
              </el-form-item>
              <el-form-item label="组件类型" prop="componentType">
                <el-input
                  v-model="addForm.componentType"
                  maxlength="64"
                  autocomplete="off"
                  placeholder="请输入组件类型"
                />
              </el-form-item>
              <el-form-item label="组件名称:" prop="componentName">
                <el-input
                  v-model="addForm.componentName"
                  maxlength="64"
                  autocomplete="off"
                  placeholder="请输入组件名称"
                />
              </el-form-item>
              <el-form-item label="草图代码:" prop="sketchCodeList">
                <el-select v-model="addForm.sketchCodeList" multiple placeholder="请选择草图代码">
                  <!-- :label="item.sketchName + ' - ' + item.sketchCode" -->
                  <el-option
                    v-for="(item, index) in optionsAllSketch"
                    :key="index"
                    :label="item.sketchName + ' - ' + item.sketchCode"
                    :value="item.sketchCode"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="可见:" prop="isView">
                <el-radio-group v-model="addForm.isView">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="状态:" prop="status">
                <el-radio-group v-model="addForm.status">
                  <el-radio value="y">有效</el-radio>
                  <el-radio value="n">无效</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注:" prop="memo">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder="请输入备注"
                  maxlength="128"
                  :rows="2"
                  v-model="addForm.memo"
                  autocomplete="off"
                />
              </el-form-item>
            </el-form>
          </el-scrollbar>
          <div class="dialog-footer dialog-footer-submit cc-submit">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" :loading="isLoading2" @click="submitInfo(formRef)">提交</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </section>
</template>
<script setup lang="ts">
import { TableOptions } from '@/components/mTable/types'
import { reqSysCompList, reqAddSysComp, reqEditSysComp, reqGetAllCompType } from '@/api/site/sysComponent/index'
import { reqGetALLSketchList } from '@/api/site/index'
import showErrorMessage from '@/utils/showErrorMessage'
// import ViewComponent from './components/viewComponent.vue'
// import count from '@/utils/tableHeight'
import i18n from '@/i18n'
import _Options from '@/const/options.json'
const { t } = i18n.global as any
import { useRouter } from 'vue-router'
import type { TableData } from '@/api/webgw/sysCompent/types'
import ManageSiteSelect from '@/components/manageSiteSelect/index.vue'
import { SiteInfo } from '@/api/manageSite/manageSiteList/types'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const router = useRouter()

const initQueryForm = () => ({
  manageSiteId: '',
  componentId: '',
  componentName: '',
  sketchCodeList: [],
  componentType: null,
  status: null,
  isView: null,
  sortOrder: 'DESC',
  sortName: 'component_id'
})

const initForm = () => ({
  componentName: '',
  componentType: '',
  sketchCodeList: [],
  status: 'y',
  isView: 'y',
  memo: ''
})

const initPageObj = () => ({
  page: 1,
  size: 15
})

// const validatePass = (rule: any, value: any, callback: any) => {
//   // 新的正则表达式：只能包含数字和英文字符
//   let pwdRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/

//   if (!pwdRegex.test(value)) {
//     callback(new Error(t('input.checkPassword')))
//   } else {
//     callback()
//   }
// }
const rulesAddFrom = ref({
  componentName: [
    { required: true, message: '请选择组件名称', trigger: 'blur' }
    // { validator: validatePass, trigger: 'blur', message: '请输入英文开头,英文,数字和_组成值' }
  ],
  componentType: [{ required: true, message: '请输入组件类型', trigger: 'blur' }]
  // sketchCodeList: [
  //   {
  //     type: 'array',
  //     required: true,
  //     message: '请选择一个组件类型',
  //     trigger: 'change'
  //   }
  // ]
})

//区分点击的是新增账号还是编辑账号   如果为真 则是编辑
const isEditMode = ref(false)
const isForm = ref(false)
const formRef = ref(null)
const tableData = ref<any[]>([])
const isLoading2 = ref(false)
// const currentPage = ref(1)
// const pageSize = ref(15)
const queryRef = ref()
const total = ref<number>(0)
const pageObj = ref(initPageObj())
const queryForm = ref(initQueryForm())
const addForm: any = ref(initForm())
// const viewForm: any = ref({})
// const editForm = ref(initForm())
const optionsAllSketch: any = ref([])
const optionsAllCompType: any = ref([])
//loading 按钮
const isLoading = ref(false)

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'componentType',
    label: '组件类型',
    showOmission: true,
    minWidth: 200
  },
  {
    prop: 'componentName',
    label: '组件名称',
    minWidth: 200,
    slot: 'componentName'
  },
  {
    prop: '组件',
    label: '组件',
    slot: 'button',
    minWidth: 80
  },
  {
    prop: 'sketchCodeList',
    label: '草图代码',
    slot: 'sketchCode',
    minWidth: 200,
    showOmission: true
  },

  {
    prop: 'status',
    label: '状态',
    minWidth: 80,
    slot: 'status'
  },
  {
    prop: 'isView',
    label: '可见',
    minWidth: 80,
    slot: 'isView'
  },
  {
    prop: 'memo',
    label: '备注',
    minWidth: 350,
    showOmission: true
  }
]

//搜索
async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  // console.log(queryForm.value)
  isLoading.value = true
  try {
    let res = await reqSysCompList(vals)
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
    if (res.success) {
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const resetButton = () => {
  Object.assign(queryForm.value, initQueryForm())
  searchButton({
    ...Object.assign(queryForm.value, initQueryForm()),
    ...Object.assign(pageObj.value, initPageObj())
  })
}

const addButton = () => {
  getAllSketchList()
  isForm.value = true
}
const editButton = (row) => {
  getAllSketchList()
  isForm.value = true
  isEditMode.value = true
  Object.assign(addForm.value, row)
}

const submitInfo = (formRefval) => {
  console.log(isEditMode)
  if (isEditMode.value) {
    editFormInfo(formRefval)
  } else {
    addFormInfo(formRefval)
  }
}

const addFormInfo = async (formRefval) => {
  isLoading2.value = true
  await formRefval.validate(async (valid, fields) => {
    if (valid) {
      try {
        let res = await reqAddSysComp({ ...addForm.value })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          searchButton({
            ...Object.assign(queryForm.value, initQueryForm()),
            ...Object.assign(pageObj.value, initPageObj())
          })
          isForm.value = false
          Object.assign(addForm.value, initForm())
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading2.value = false
      }
    } else {
      console.log('error submit!', fields)
      isLoading2.value = false
    }
  })
}
const editFormInfo = async (formRefval) => {
  isLoading2.value = true
  await formRefval.validate(async (valid, fields) => {
    if (valid) {
      try {
        let res = await reqEditSysComp({ ...addForm.value })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          searchButton({
            ...Object.assign(queryForm.value, initQueryForm()),
            ...Object.assign(pageObj.value, initPageObj())
          })
          isForm.value = false
          Object.assign(addForm.value, initForm())
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading2.value = false
      }
    } else {
      console.log('error submit!', fields)
      isLoading2.value = false
    }
  })
}

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

/**
 * Open the component in a new tab.
 * @param {TableData} row The component data.
 */
const viewButton = (row: TableData) => {
  const componentId = row.componentId

  // 使用方法 / Usage
  openInNewTab('/webVision', { componentId })
}

const handleSizeChange = (val) => {
  pageObj.value.size = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}
const handleCurrentChange = (val) => {
  pageObj.value.page = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}

function transformString(originalStr) {
  // 获取前三位和后四位
  let prefix = originalStr.slice(0, 3)
  let suffix = originalStr.slice(-4)

  // 中间用三个星号替代
  let transformedStr = `${prefix}***${suffix}`

  return transformedStr
}

onMounted(() => {
  getAllSketchList()
  getAllCompTypeList()
  searchButton()
})

//获取所有的骨架code列表
const getAllSketchList = async () => {
  let res = await reqGetALLSketchList({
    manageSiteId: manageSite.manageSiteId
  })
  optionsAllSketch.value = res.data
}
//获取所有的骨架code列表
const getAllCompTypeList = async () => {
  let res = await reqGetAllCompType({ page: 1, size: 200 })
  optionsAllCompType.value = res?.data?.list
}
const closeDialog = () => {
  isForm.value = false
  //   isEditForm.value = false
  isEditMode.value = false
  Object.assign(addForm.value, initForm())
}

const activeTab = ref('componentBase')
</script>

<style scoped>
.w-100px {
  width: 100px;
}
.w-200px {
  width: 200px;
}
.cc-scrollbar {
  padding: 0 10px;
}

.cc-submit {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}
</style>
