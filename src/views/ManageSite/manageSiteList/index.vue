<template>
  <section id="system_account">
    <section ref="tableRef" class="manage-website-search">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left" label-width="60px">
        <el-form-item prop="manageId" style="width: 200px">
          <AutoComplete
            v-model="queryForm.manageId"
            :httpFunc="reqHttp"
            keyword="manageId"
            placeholder="站点ID"
            :displayFields="['manageId']"
            :trigger-on-focus="true"
            isPage
            isList
          />
        </el-form-item>
        <el-form-item prop="siteName" style="width: 200px">
          <AutoComplete
            v-model="queryForm.siteName"
            :httpFunc="reqHttp"
            keyword="siteName"
            placeholder="站点名称"
            :displayFields="['siteName']"
            :trigger-on-focus="true"
            isPage
            isList
          />
        </el-form-item>
        <el-form-item prop="siteStatus">
          <el-select v-model="queryForm.siteStatus" placeholder="状态" clearable>
            <el-option label="在线" value="y" />
            <el-option label="无效" value="n" />
            <el-option label="下线" value="o" />
            <el-option label="未上线" value="x" />
          </el-select>
        </el-form-item>
        <el-form-item prop="oapiUrl" style="width: 200px">
          <el-input v-model="queryForm.oapiUrl" placeholder="网址" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData({ page: 1, size: pageSize })" :loading="isLoading">
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
          <el-button type="success" @click="handleAddButton">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="account-table">
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(tableRef).toString()"
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
        <template #manageInfo="{ scope }">
          <p class="like-a" type="primary" @click="handleTableEdit(scope)">
            {{ scope.row.siteName }}
          </p>
        </template>
        <template #isSwitch="{ scope }">
          <el-dropdown trigger="click" size="small" @command="statusChanged">
            <span class="el-dropdown-link">
              <el-tag v-if="scope.row.siteStatus == 'y'" class="mx-1" type="primary">在线</el-tag>
              <el-tag v-else-if="scope.row.siteStatus == 'n'" class="mx-1" type="danger">无效</el-tag>
              <el-tag v-else-if="scope.row.siteStatus == 'o'" class="mx-1" type="warning">下线</el-tag>
              <el-tag v-else-if="scope.row.siteStatus == 'x'" class="mx-1" type="info">未上线</el-tag>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item class="mx-1" :command="{ ...scope.row, siteStatus: 'y' }">
                  <el-tag type="primary">在线</el-tag>
                </el-dropdown-item>
                <el-dropdown-item class="mx-1" :command="{ ...scope.row, siteStatus: 'n' }">
                  <el-tag type="danger">无效</el-tag>
                </el-dropdown-item>
                <el-dropdown-item class="mx-1" :command="{ ...scope.row, siteStatus: 'o' }">
                  <el-tag type="warning">下线</el-tag>
                </el-dropdown-item>
                <el-dropdown-item class="mx-1" :command="{ ...scope.row, siteStatus: 'x' }">
                  <el-tag type="info">未上线</el-tag>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #link="{ scope }">
          <el-button target="_blank" type="primary" :onClick="() => openNewWindow(scope)">
            {{ scope.row.siteName }}
          </el-button>
        </template>
        <!-- <template #operate="{ scope }">
          <el-button
            size="small"
            type="danger"
            plain
            @click="handleDelete(scope)"
          >
            删除
          </el-button>
        </template> -->
      </m-table>
    </section>
    <!-- 新增 弹出框 -->
    <section class="dialogAdd">
      <el-dialog v-model="addDialogVisible" class="tabs-dialog" draggable destroy-on-close @close="closeDialog">
        <el-tabs v-model="activeName" class="m_tabs">
          <el-tab-pane label="管端节点(新增)" name="first" class="m_tabs_pane">
            <m-form
              ref="addForm"
              label-width="100px"
              class="addForm"
              :modelForm="initAddForm"
              :options="addOptions"
              :rules="formRules"
            >
              <template #action="scope">
                <section class="wrapper_submit">
                  <el-button @click="closeDialog">取消</el-button>
                  <el-button type="primary" @click="handleSubmit(scope)">提交</el-button>
                </section>
              </template>
            </m-form>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </section>
    <!-- 编辑 -->
    <section class="dialogEdit">
      <el-dialog
        v-model="editDialogVisible"
        class="tabs-dialog"
        draggable
        overflow
        destroy-on-close
        @close="closeDialog"
      >
        <el-tabs v-model="activeName" class="m_tabs">
          <el-tab-pane label="管端节点(修改)" name="first" class="m_tabs_pane">
            <m-form
              ref="editForm"
              label-width="100px"
              :modelForm="lineFormData"
              :options="editOptions"
              :rules="formRules"
            >
              <template #action="scope">
                <section class="wrapper-submit">
                  <el-button @click="closeDialog">取消</el-button>
                  <el-button type="primary" @click="handleSubmit(scope)">提交</el-button>
                </section>
              </template>
            </m-form>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import count from '@/utils/tableHeight'
import i18n from '@/i18n'
const { t } = i18n.global as any
import Cookies from 'js-cookie'
import showErrorMessage from '@/utils/showErrorMessage'
import { createUrlValidator } from '@/utils/validators'
import { getSSOToken } from '@/api/super/index'

import { reqHttp, addHttp, editHttp, delHttp } from '@/api/manageSite/manageSiteList/index'

import { options, addOptions, editOptions } from '@/views/ManageSite/manageSiteList/data'
import type { IGetSSOTokenQueryParams } from '@/api/super/types'
import { useManageSiteStore } from '@/stores/manageSiteStore'
import { qs } from '@/utils/dataFormat'
import { cloneDeep } from 'lodash-es'

const manageSite = useManageSiteStore()
const tableRef = ref()
const queryRef = ref()
const activeName = ref('first')
const tableData = ref()

//loading 按钮
const isLoading = ref(false)

//页码相关
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//新增弹窗
const addDialogVisible = ref(false)

//编辑弹窗
const editDialogVisible = ref(false)

const addForm = ref()
const editForm = ref()

const initForm = {
  manageId: '',
  siteName: '',
  siteStatus: 'y',
  oapiUrl: '',
  accessKey: '',
  operStatus: 'y'
}

const queryForm = ref(initForm)

const initAddForm = {
  manageId: '',
  siteName: '',
  siteStatus: 'y',
  oapiUrl: '',
  accessKey: '',
  operStatus: 'y'
}

//add 新增 edit 编辑
const formMode = ref<string>('add')
const lineFormData = ref()

//表单规则
const formRules = ref({
  manageId: [
    { required: true, message: '网站ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]*$/, message: '网站ID不符合标准', trigger: 'blur' }
  ],
  siteStatus: [{ required: true, message: '请选择网站的状态', trigger: 'blur' }],
  siteName: [{ required: true, message: '网站名称不能为空', trigger: 'blur' }],
  oapiUrl: [
    { required: true, message: '网站url不能为空', trigger: 'blur' },
    { validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }
  ],
  accessKey: [{ required: true, pattern: /^[a-zA-Z0-9]*$/, message: '密钥不符合标准', trigger: 'blur' }],
  operStatus: [{ required: true, message: '请选择一个状态', trigger: 'blur' }]
})

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

//页面初始化获取数据
const fetchData = async (_queryForm?) => {
  console.log(queryForm.value)
  if (_queryForm?.page) {
    currentPage.value = _queryForm.page
  }
  let params = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: 'create_time',
    sortOrder: 'DESC'
  }
  params = _queryForm ? { ...params, ...queryForm.value } : params
  isLoading.value = true
  try {
    const response = await reqHttp(params)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

//提交
const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
      const row = scope.model
      let params = row
      if (formMode.value === 'edit') {
        params.createTime = lineFormData.value.createTime
      }
      if (params.accessKey) {
        params.accessKey = params.accessKey.toLowerCase()
      }
      // return
      try {
        const response = formMode.value === 'add' ? await addHttp(params) : await editHttp(params)

        if (response.success) {
          if (formMode.value === 'add') {
            currentPage.value = 1
          }
          fetchData() // 保存成功后重新获取数据
          addDialogVisible.value = false
          editDialogVisible.value = false
        } else {
          showErrorMessage(response)
        }
      } catch (error) {
        console.error('Error saving data:', error)
      }
    } else {
      console.log('表单验证失败')
    }
  })
}

/**
 * 状态变化处理函数，返回一个Promise以满足before-change的要求
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */
const statusChanged = (row) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
      confirmButtonText: t('button.determine'),
      cancelButtonClass: t('button.cancel'),
      type: 'warning'
    })
      .then(() => {
        updateStatus(row).then(resolve).catch(reject)
      })
      .catch(() => {
        reject(new Error('用户取消操作'))
      })
  })
}

/**
 * 更新状态函数，执行异步请求
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */
const updateStatus = async (row) => {
  console.log(row)
  const params = row
  try {
    const response = await editHttp(params)
    if (response.success) {
      fetchData()
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
      return Promise.resolve()
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
    ElMessage({
      showClose: true,
      message: '保存数据时出错',
      type: 'error'
    })
    return Promise.reject(error)
  }
}

//弹窗删除按钮点击
const handleDelete = async (scope: any) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
      confirmButtonText: t('button.determine'),
      cancelButtonClass: t('button.cancel'),
      type: 'warning'
    })
      .then(async () => {
        const { manageId } = scope.row
        try {
          const response = await delHttp({ manageId })
          if (response.success) {
            ElMessage({
              message: '删除成功',
              type: 'success'
            })
            fetchData()
            return Promise.resolve()
          } else {
            showErrorMessage(response)
          }
        } catch (error) {
          console.error('Error saving data:', error)
          ElMessage({
            showClose: true,
            message: '操作数据时出错',
            type: 'error'
          })
          return Promise.reject(error)
        }
      })
      .catch(() => {
        reject(new Error('用户取消操作'))
      })
  })
}

const openNewWindow = async (scope) => {
  const data: IGetSSOTokenQueryParams = {
    manageSiteId: scope.row.manageId,
    cid: Cookies.get('cid')
  }
  const res = await getSSOToken(data)
  const queryString = qs({
    token: res.data?.ssoToken,
    cid: data.cid
  })
  window.open(`${res.data?.url}?${queryString}`, '_blank')
}

//弹窗编辑按钮点击
const handleTableEdit = async (scope: any) => {
  formMode.value = 'edit'
  editDialogVisible.value = true
  await nextTick()
  lineFormData.value = cloneDeep(scope.row)
}

//弹窗添加按钮点击
const handleAddButton = () => {
  formMode.value = 'add'
  addDialogVisible.value = true
}

const resetButton = () => {
  queryRef.value.resetFields()
  currentPage.value = 1
  fetchData()
}

const closeDialog = () => {
  if (formMode.value === 'add') {
    addForm.value.resetFields()
  } else {
    editForm.value.resetFields()
  }
  addDialogVisible.value = false
  editDialogVisible.value = false
}

onMounted(fetchData)
</script>

<style lang="less">
.wrapper_submit {
  justify-self: flex-end;
}

.addForm .el-scrollbar {
  width: 80%;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .addForm .el-scrollbar {
    width: 100%;
  }
}

.wrapper-submit {
  display: inline-block;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
