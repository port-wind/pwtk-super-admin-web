<template>
  <div id="sys_roles">
    <div class="search" ref="tableRef">
      <div class="search_left">
        <el-input clearable v-model="mes" :placeholder="t('table.dictionaryName')"></el-input>
        <el-input clearable v-model="mesType" :placeholder="t('table.dictionarytype')"></el-input>
        <el-button type="primary" @click="searchDict">
          {{ t('button.search') }}
        </el-button>
      </div>
      <div class="search_right">
        <el-button
          :disabled="per.includes('dict:add') ? false : true"
          type="success"
          @click="addDictionary(ruleFormRef)"
        >
          {{ t('button.addDictionary') }}
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="account-table">
      <el-table :data="tableData" border style="width: 100%" stripe highlight-current-row :height="count(tableRef)">
        <el-table-column :label="t('table.dictionaryName')" align="left" width="180" #default="scope">
          <div>
            {{ scope.row.name }}
            <copy :content="scope.row.name" :title="t('table.dictionaryName')" />
          </div>
        </el-table-column>
        <el-table-column prop="type" :label="t('table.dictionarytype')" align="left" width="180" />
        <el-table-column prop="value" :label="t('table.dictionaryValue')" align="left" min-width="200" />
        <el-table-column prop="remark" :label="t('table.describe')" align="left" width="180" />
        <el-table-column :label="t('table.creationTime')" align="center" width="170">
          <template #="{ row }">
            {{ unitFormatDate(row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column :label="t('table.controls')" width="170" align="center">
          <template #="{ row }">
            <el-button
              :disabled="per.includes('dict:edit') ? false : true"
              type="primary"
              @click="editt(row, ruleFormRef)"
            >
              {{ t('button.edit') }}
            </el-button>
            <el-popconfirm
              :confirm-button-text="t('button.confirm')"
              :cancel-button-text="t('button.cancel')"
              icon-color="#f5c357"
              :title="t('button.isdeleteUser')"
              @confirm="confirmEvent(row)"
              @cancel="cancelEvent"
              width="250"
            >
              <template #reference>
                <el-button :disabled="per.includes('dict:delete') ? false : true" type="danger">
                  {{ t('button.delete') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增字典弹出框 -->
    <el-dialog v-model="dialogFormVisible" class="tabs-dialog">
      <el-tabs class="m_tabs" v-model="activeTab">
        <el-tab-pane
          :label="distinguish ? t('button.edit') + t('button.dictionary') : t('button.add') + t('button.dictionary')"
          name="editorDictionary_tab"
          class="m_tabs_pane"
        >
          <el-form class="dialog-form single-form" :model="dictionaryForm" ref="ruleFormRef" status-icon :rules="rules">
            <el-form-item :label="t('table.dictionaryName') + ' :'" prop="name">
              <el-input v-model="dictionaryForm.name" />
            </el-form-item>
            <el-form-item :label="t('table.dictionarytype') + ' :'" prop="type">
              <el-input v-model="dictionaryForm.type" />
            </el-form-item>
            <el-form-item :label="t('table.dictionaryValue') + ' :'" prop="value">
              <el-input v-model="dictionaryForm.value" />
            </el-form-item>
            <el-form-item :label="t('button.dictionary') + t('table.describe') + ' :'" prop="remark">
              <el-input v-model="dictionaryForm.remark" autosize type="textarea" />
            </el-form-item>
          </el-form>
          <div class="button-row">
            <el-button @click="cancellation">{{ t('button.cancel') }}</el-button>
            <el-button type="primary" @click="confirm(ruleFormRef)">
              {{ t('button.confirm') }}
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { setPermissionsStore } from '@/stores/index'
import i18n from '@/i18n'
const { t } = i18n.global as any
import type { FormInstance, FormRules } from 'element-plus'
import { reqDictList, reqDictAdd, reqDictDelete, reqDictEdit } from '@/api/system/dictionary'
import { unitFormatDate } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
// 计算表格高度
import count from '@/utils/tableHeight'
const tableRef = ref(null)
const mesType = ref('')
const permissionStore = setPermissionsStore()
const per = computed(() => permissionStore.menupermissions)
const activeTab = ref('editorDictionary_tab') //tab切换第一条
const searchDict = async () => {
  let res = await reqDictList({
    page: currentPage.value,
    size: pageSize.value,
    name: mes.value,
    type: mesType.value
  })
  tableData.value = res.data.list
  total.value = parseInt(res.data.total)
}
const currentPage = ref(1)
const pageSize = ref(15)
const handleSizeChange = () => {
  getDictList({
    page: currentPage.value,
    size: pageSize.value,
    name: mes.value,
    type: mesType.value
  })
}
const handleCurrentChange = () => {
  getDictList({
    page: currentPage.value,
    size: pageSize.value,
    name: mes.value,
    type: mesType.value
  })
}
const total = ref(0)
const mes = ref('')
//区分点击的是新增字典还是编辑字典
const distinguish = ref(false)
//控制弹出框是否展示
const dialogFormVisible = ref(false)
//弹出框中 表单的头部宽度
const formLabelWidth = '220px'
//表单校验
const ruleFormRef = ref<FormInstance>()
//弹出框中 表单的信息
const dictionaryForm = reactive({
  name: '',
  type: '',
  value: '',
  remark: ''
})
//校验规则
const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('table.dictionaryName')))
  } else {
    callback()
  }
}
const validateType = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('table.dictionarytype')))
  } else {
    callback()
  }
}
const validateValue = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('table.dictionaryValue')))
  } else {
    callback()
  }
}
const validateRemark = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('button.dictionary') + t('table.describe')))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  name: [{ validator: validateName, required: true, trigger: 'blur' }],
  type: [{ validator: validateType, required: true, trigger: 'blur' }],
  value: [{ validator: validateValue, required: true, trigger: 'blur' }],
  remark: [{ validator: validateRemark, required: true, trigger: 'blur' }]
})
//表格展示的数据
const tableData = ref([])
//弹出框表单 取消按钮
const cancellation = () => {
  dialogFormVisible.value = false
}
//当前账号id和name  用来编辑
const rolesId = ref(0)
//弹出框表单 确认按钮
const confirm = async (formEl: FormInstance | undefined) => {
  if (distinguish.value) {
    let res = await reqDictEdit({
      id: rolesId.value,
      name: dictionaryForm.name,
      type: dictionaryForm.type,
      value: dictionaryForm.value,
      remark: dictionaryForm.remark
    })
    if (res.success) {
      ElMessage({
        message: t('button.edit') + t('errorCode.0'),
        type: 'success'
      })
      dialogFormVisible.value = false
      getDictList({
        page: currentPage.value,
        size: pageSize.value,
        name: mes.value,
        type: mesType.value
      })
    } else {
      showErrorMessage(res)
    }
  } else {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          let res = await reqDictAdd(dictionaryForm)
          if (res.success) {
            ElMessage({
              message: t('button.add') + t('errorCode.0'),
              type: 'success'
            })
            dialogFormVisible.value = false
            getDictList({
              page: currentPage.value,
              size: pageSize.value,
              name: mes.value,
              type: mesType.value
            })
          } else {
            showErrorMessage(res)
          }
        } catch (error) {}
      } else {
        return false
      }
    })
  }
}

const confirmEvent = async (row) => {
  const id = row.id * 1
  let res = await reqDictDelete({ id })
  if (res.success) {
    ElMessage({
      message: t('button.delete') + t('errorCode.0'),
      type: 'success'
    })
    getDictList({
      page: currentPage.value,
      size: pageSize.value
    })
  } else {
    showErrorMessage(res)
  }
}
const cancelEvent = () => {}
const editt = (row, ruleFormRef) => {
  if (ruleFormRef) {
    ruleFormRef.clearValidate()
  }
  distinguish.value = true
  dialogFormVisible.value = true
  rolesId.value = row.id
  dictionaryForm.type = row.type
  dictionaryForm.value = row.value
  dictionaryForm.name = row.name
  dictionaryForm.remark = row.remark
}
const addDictionary = (ruleFormRef) => {
  dictionaryForm.type = ''
  dictionaryForm.value = ''
  dictionaryForm.name = ''
  dictionaryForm.remark = ''
  if (ruleFormRef) {
    ruleFormRef.clearValidate()
  }

  distinguish.value = false
  dialogFormVisible.value = true
}
onMounted(() => {
  getDictList({
    page: currentPage.value,
    size: pageSize.value
  })
})

const getDictList = async (data) => {
  let res = await reqDictList(data)
  tableData.value = res.data.list
  total.value = parseInt(res.data.total)
}
</script>

<style scoped lang="less">
#sys_roles {
  .search {
    display: flex;
    margin-bottom: 2px;
    align-items: center;
    justify-content: space-between;

    .search_left {
      > div {
        margin-bottom: 10px;
        margin-right: 10px;
      }

      .el-input {
        width: 7.5rem;
      }

      .el-select {
        width: 6.25rem;
      }

      .el-button {
        margin-bottom: 10px;
      }
    }

    .search_right {
      .el-button {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
