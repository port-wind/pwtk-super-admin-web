<template>
  <div id="system_account" class="main_container">
    <section ref="queryRef">
      <el-form class="search_left" :inline="true" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="promotionCode">
          <ManageSiteSelect
            @onSelect="
              (val) => {
                searchButton({ ...queryForm, manageSiteId: val.manageId })
              }
            "
          />
        </el-form-item>
        <el-form-item label="" prop="promotionCode">
          <el-input v-model="queryForm.promotionCode" maxlength="20" placeholder="推广码" />
        </el-form-item>
        <!-- <TimeSelect name="开始时间" v-model:startDate="queryForm.startTime" v-model:endDate="queryForm.endTime">
        </TimeSelect> -->
        <el-form-item label="推广域名" prop="isPromotionDomain">
          <el-select v-model="queryForm.isPromotionDomain" placeholder="推广域名">
            <el-option label="全部" value="L" />
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="强制绑定" prop="isForceBind">
          <el-select v-model="queryForm.isForceBind" placeholder="强制绑定">
            <el-option label="全部" value="L" />
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="isLoading" @click="searchButton({ ...queryForm, ...pageObj })">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" plain @click="resetButton">
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

    <div class="main_flex_table">
      <el-table :data="tableList" v-loading="isLoading" stripe highlight-current-row style="height: 100%">
        <!-- <el-table-column fixed type="index" width="50" /> -->
        <el-table-column label="所属用户｜推广码" align="left" width="280" key="promotionCode" prop="promotionCode">
          <template #="{ row }">
            <span class="like-a" @click="showUserDialog(row)">
              {{ row.ownerLoginId }}
            </span>
            ｜
            <span @click.stop="handleEdit(row)" class="like-a">
              {{ row.promotionCode }}
            </span>
            <copy :content="row.promotionCode" style="margin-left: 3px"></copy>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="left" width="100" key="codeStatus" prop="codeStatus">
          <template #default="scope">
            <!-- {{ row.codeStatus }} -->
            <template v-if="scope.row.codeStatus == 'n'">
              <div style="display: flex; justify-content: space-between">
                <span style="padding: 4px 0 0 0">关闭</span>
                <el-switch
                  v-model="scope.row.codeStatus"
                  active-value="y"
                  inactive-value="n"
                  @click="switchChange($event, scope.row, scope.$index)"
                  class="ml-2"
                />
              </div>
            </template>
            <template v-else>
              <div style="display: flex; justify-content: space-between">
                <span style="padding: 4px 0 0 0">启用</span>
                <el-switch
                  v-model="scope.row.codeStatus"
                  :active-value="'y'"
                  :inactive-value="'n'"
                  @click="switchChange($event, scope.row, scope.$index)"
                  class="ml-2"
                />
              </div>
            </template>
          </template>
        </el-table-column>
        <!-- <el-table-column label="所属用户" align="left" width="200" key="ownerUserId" prop="ownerUserId" /> -->
        <el-table-column label="是否推广域名" width="120" align="left" key="isPromotionDomain" prop="isPromotionDomain">
          <template #="{ row }">
            <el-text v-if="row.isPromotionDomain == 'y'" class="mx-1" type="primary">是</el-text>
            <el-text v-else class="mx-1" type="info">否</el-text>
          </template>
        </el-table-column>
        <el-table-column label="推广域名" align="left" width="250" key="promotionDomain" prop="promotionDomain" />
        <el-table-column label="强制绑定" align="left" width="120" key="isForceBind" prop="isForceBind">
          <template #="{ row }">
            <el-text v-if="row.isForceBind == 'y'" class="mx-1" type="primary">是</el-text>
            <el-text v-else class="mx-1" type="info">否</el-text>
          </template>
        </el-table-column>
        <el-table-column label="推广链接" align="left" width="250" key="promotionUrl" prop="promotionUrl" />
        <!-- <el-table-column label="状态" align="center" key="codeStatus" prop="codeStatus" /> -->
        <el-table-column label="注册数量" align="right" width="120" key="registerCount" prop="registerCount" />
        <el-table-column label="推广对象" align="left" width="120" key="promotionbject" prop="promotionbject" />

        <el-table-column label="绑定域名数量" align="right" width="120" key="bindDomainCount" prop="bindDomainCount" />
        <!-- <el-table-column
          label="强制绑定"
          align="left"
          width="120"
          key="isForceBind"
          prop="isForceBind"
        >
          <template #="{ row }">
            <el-text
              v-if="row.isForceBind == 'y'"
              class="mx-1"
              type="primary"
            >
              是
            </el-text>
            <el-text
              v-else
              class="mx-1"
              type="info"
            >
              否
            </el-text>
          </template>
        </el-table-column> -->
        <el-table-column label="创建时间" align="left" width="180" key="createTime" prop="createTime">
          <template #="{ row }">
            {{ unitFormatDate(Number(row.createTime)) }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          fixed="right"
          :label="t('table.controls')"
          width="170"
        >
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              plain
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="pageObj.page"
        v-model:page-size="pageObj.size"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
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
        <el-tab-pane label="推广码" name="codeManagement" class="m_tabs_pane">
          <el-scrollbar class="cc-scrollbar">
            <el-form :model="addForm" ref="formRef" :rules="rulesAddFrom" class="single-form">
              <el-form-item label="所属用户:" prop="ownerUserId">
                <UniRemoteInput
                  v-if="!isEditMode"
                  v-model="addForm.ownerUserId"
                  valueKey="userId"
                  labelKey="loginId"
                  searchKey="searchId"
                  placeholder="用户名/ID"
                  :fetchOptions="reqUserList"
                  :formatLabel="(item) => `${item[`loginId`] + ' - ' + item[`userId`]}`"
                />
                <!-- <AutoComplete
            v-if="!isEditMode"
            v-model="addForm.ownerUserId"
            keyword="searchId"
            :is-page="true"
            :httpFunc="reqUserList"
            :trigger-on-focus="false"
          >
            <template #suggestion="{ item }">
              <div>
                <span>{{ item[`loginId`] + ' - ' + item[`userId`] }}</span>
              </div>
            </template>
          </AutoComplete> -->
                <p v-if="isEditMode">
                  {{ addForm.ownerUserId }}
                  <copy :content="addForm.ownerUserId" />
                </p>
              </el-form-item>
              <el-form-item label="推广码:" required prop="promotionCode">
                <el-input v-if="!isEditMode" v-model="addForm.promotionCode" autocomplete="off" placeholder="推广码" />
                <p v-if="isEditMode">
                  {{ addForm.promotionCode }}
                  <copy :content="addForm.promotionCode" />
                </p>
              </el-form-item>
              <el-form-item v-if="isEditMode" label="状态:" prop="codeStatus">
                <el-radio-group v-model="addForm.codeStatus">
                  <el-radio value="y">开启</el-radio>
                  <el-radio value="n">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否推广域名:" prop="isPromotionDomain">
                <el-radio-group v-model="addForm.isPromotionDomain">
                  <el-radio v-for="item in options" :value="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否强制绑定:" v-if="addForm.isPromotionDomain === 'y'" prop="isForceBind">
                <el-radio-group v-model="addForm.isForceBind">
                  <el-radio v-for="item in options" :value="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="推广域名:" prop="promotionDomain">
                <el-input
                  v-model="addForm.promotionDomain"
                  placeholder="推广域名"
                  @change="(val) => handleDomainChange(val, addForm, 'promotionDomain')"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item v-if="isEditMode" label="创建时间:" prop="createTime">
                {{ unitFormatDate(Number(addForm.createTime), 'yyyy-MM-dd HH:mm:ss') }}
              </el-form-item>
            </el-form>
          </el-scrollbar>
          <div class="dialog-footer dialog-footer-submit cc-submit">
            <el-button @click="closeDialog">取消</el-button>
            <!-- <el-button @click="isUserForm = false">取消</el-button> -->
            <el-button type="primary" :loading="isLoading2" @click="submitInfo(formRef)">提交</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <UserListComponent
      :userId="userId"
      v-model:isTabs="isTabs"
      :searchFunk="closeEditTab"
      :displayHandleButton="false"
    ></UserListComponent>
  </div>
</template>

<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
import { setPermissionsStore } from '@/stores/index'
import { reqUserList } from '@/api/user/index'
import UniRemoteInput from '@/components/uniRemoteInput/index.vue'

import {
  reqPromotionCodeSearch,
  reqPromotionCodeDelete,
  reqPromotionCodeAdd,
  reqPromotionCodeEdit
} from '@/api/site/index'
import { createDomainValidator } from '@/utils/validators'
import { unitFormatDate, handleDomainChange } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
import ManageSiteSelect from '@/components/manageSiteSelect/index.vue'

const queryRef = ref()
const permissionStore = setPermissionsStore()
const per = computed(() => permissionStore.menupermissions)
console.log(per, 'per')

import { useModalsStore } from '@/stores/modalStore'
import { create } from 'domain'
import { SiteInfo } from '@/api/manageSite/manageSiteList/types'
const modalsStore = useModalsStore()
const route = useRoute()
const router = useRouter()

const rulesAddFrom = ref({
  ownerUserId: [{ required: true, message: '请选择用户ID', trigger: 'blur' }],
  promotionCode: [{ required: true, message: '请输入推广码', trigger: 'blur' }],
  promotionDomain: [
    { required: true, message: '请输入推广域名', trigger: 'blur' },
    { validator: createDomainValidator('推广域名格式不正确'), trigger: 'blur' }
  ]
})

const options = [
  {
    value: 'y',
    label: '是'
  },
  {
    value: 'n',
    label: '否'
  }
]
const initPageObj = () => ({
  page: 1,
  size: 15
})
//分页数据
const pageObj = ref(initPageObj())
const initQueryForm = () => ({
  manageSiteId: '',
  promotionCode: '',
  isPromotionDomain: 'L',
  isForceBind: 'L',
  sortOrder: 'DESC',
  sortName: 'create_time'
})

const initEditForm = () => ({
  promotionCode: '',
  ownerUserId: '',
  isPromotionDomain: 'n',
  registerCount: '',
  promotionObject: '',
  promotionUrl: '',
  promotionDomain: '',
  bindDomainCount: '',
  isForceBind: 'n',
  codeStatus: '',
  createTime: null
})

//区分点击的是新增账号还是编辑账号   如果为真 则是编辑
const isEditMode = ref(false)
const isForm = ref(false)
const isEditForm = ref(false)
const isLoading = ref(false)
const isLoading2 = ref(false)
const total = ref(0)
const formRef = ref(null)
const tableList: any = ref([])
const queryForm = ref(initQueryForm())
const addForm = ref(initEditForm())
const activeTab = ref('codeManagement')
const userId = ref('')
const isTabs = ref(false)
const activeName = ref('first')

const onSiteSelect = (val: SiteInfo) => {
  queryForm.manageSiteId = val.manageId
}

async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  // console.log(queryForm.value)
  isLoading.value = true
  try {
    let res = await reqPromotionCodeSearch(vals)
    tableList.value = res.data.list
    total.value = Number(res.data.total)
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
  isEditMode.value = false
  Object.assign(addForm.value, initEditForm())
  isForm.value = true
}

const handleEdit = (row) => {
  console.log(row)
  let { ...rest } = row
  isForm.value = true
  isEditMode.value = true
  Object.assign(addForm.value, { ...rest })
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
  let { createTime, ...params } = addForm.value
  await formRefval.validate(async (valid, fields) => {
    if (valid) {
      try {
        let res = await reqPromotionCodeAdd({ ...params })
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
          Object.assign(addForm.value, initEditForm())
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
        let res = await reqPromotionCodeEdit({ ...addForm.value })
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
          Object.assign(addForm.value, initEditForm())
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
const handleDelete = (row) => {
  ElMessageBox.confirm(t('pop.areyousurepage'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  })
    .then(() => {
      reqPromotionCodeDelete({ promotionCode: row.promotionCode }).then((res) => {
        if (res.success) {
          ElMessage({
            message: t('button.delete') + t('errorCode.0'),
            type: 'success'
          })
          searchButton()
        } else {
          showErrorMessage(res)
        }
      })
    })
    .catch(() => {})
}
const handleSizeChange = (val) => {
  pageObj.value.size = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}
const handleCurrentChange = (val) => {
  pageObj.value.page = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}

const closeDialog = () => {
  isForm.value = false
  isEditForm.value = false
  isEditMode.value = false
  Object.assign(addForm.value, initEditForm())
}

const switchChange = (event, row, index) => {
  // console.log('第一次', code)
  console.log('index', index)
  // console.log('值', code)
  console.log('状态', row.codeStatus)
  if (row.codeStatus == 'y') {
    tableList.value[index].codeStatus = 'n'
  } else {
    tableList.value[index].codeStatus = 'y'
  }
  const { createTime, ...rest } = row
  // tableList.value[index].sketchStatus = row.sketchStatus
  console.log('状态变化后', tableList.value[index].codeStatus)
  ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  })
    .then(() => {
      reqPromotionCodeEdit({
        ...rest,
        codeStatus: row.codeStatus == 'n' ? 'y' : 'n'
      }).then((res) => {
        if (res.success) {
          ElMessage({
            message: '修改成功',
            type: 'success'
          })
          searchButton()
        } else {
          showErrorMessage(res)
        }
      })
    })
    .catch(() => {})
}

const showUserDialog = (row) => {
  userId.value = row.ownerUserId
  router.push({ path: route.path, query: {} })
  console.log(111, row)

  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: userId.value
  })
  modalsStore.showModal('userInfoModal')
}

const closeTabs = () => {
  isTabs.value = false
  activeName.value = 'first'
}

const closeEditTab = () => {
  closeTabs()
  searchButton({ ...queryForm.value, ...pageObj.value })
}

onMounted(() => {
  searchButton()
})
</script>

<style scoped lang="less">
// :deep(.el-input__wrapper) {
//   width: 120px;
// }

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

.el-button--text {
  margin-right: 15px;
}

.cc-submit {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}

.cc-scrollbar {
  padding: 0 10px;
}
</style>
