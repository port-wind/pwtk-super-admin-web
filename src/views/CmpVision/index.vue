<template>
  <el-row>
    <el-col :span="16">
      <el-row>
        <m-form></m-form>
      </el-row>
      <section class="account-table">
        <!-- :tableHeight="count(tableRef).toString()" -->
        <m-table
          :options="options"
          :data="tableData"
          :isLoading="isLoading"
          isEditRow
          pagination
          stripe
          border
          :total="total"
          :currentPage="pageObj.page"
          :pageSize="pageObj.size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template #userDisplay="{ scope }">
            <p>{{ scope.row.blockUserNickname }}</p>
            <p>{{ scope.row.blockUserId }}</p>
          </template>
          <template #action="scope">
            <el-button type="primary" @click="handleEditor(scope)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope)">删除</el-button>
          </template>
        </m-table>
      </section>
    </el-col>
    <el-col :span="8">
      <div class="showView"></div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { TableOptions } from '@/components/mTable/types'
import type {
  GetRequest,
  GetResponse,
  AddRequest,
  EditRequest,
  TableData,
  GetByIdRequest
} from '@/api/webgw/cmpVision/types'
import { reqSysCom, updateRendSeq, regById, editSysCom, delSysCom } from '@/api/webgw/cmpVision/index'

import showErrorMessage from '@/utils/showErrorMessage'

import i18n from '@/i18n'
const { t } = i18n.global as any

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '表单'
  }
})

// const initQueryForm = () => ({
//   templateId: ''
// })

const initPageObj = () => ({
  page: 1,
  size: 15
})

const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

const pageObj = ref(initPageObj())
// const queryForm = ref(initQueryForm())
// const editForm = ref({})
//loading 按钮
const isLoading = ref(false)
const emit = defineEmits(['update:visible', 'submit'])

const isVisible = ref(props.visible)

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'attachmentId',
    label: '渲染顺序',
    slot: 'userDisplay'
  },
  {
    prop: 'blockReason',
    label: '组件类型'
  },
  {
    prop: 'blockTime',
    label: '组件名称',
    width: 170
  },
  {
    prop: '状态',
    label: '状态'
  },
  {
    prop: '状态',
    label: '备注'
  },
  {
    prop: '状态',
    label: '操作'
  }
]

//页面初始化获取数据
const fetchData = async (queryForm?: GetRequest) => {
  let params = {
    page: currentPage.value,
    size: pageSize.value
  }
  params = queryForm ? { ...params, ...queryForm } : params
  isLoading.value = true
  try {
    const response = await reqSysCom(params)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchDataById = async () => {
  try {
    const response = await regById({ templateId: templateId.value })
    if (response.success) {
      console.log(response)
      tableData.value = response.data.list
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

//删除一条数据
const handleDelete = async (componentId: number) => {
  // return
  try {
    const response = await delSysCom({ componentId })
    // console.log(data)
    if (response.success) {
      fetchDataById() // 保存成功后重新获取数据
    } else {
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

//新增数据 或者编辑数据
const handleEditor = async (formData: any) => {
  const params = formData
  // return
  try {
    const response = await editSysCom(params)
    if (response.success) {
      fetchDataById() // 保存成功后重新获取数据
    } else {
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
let templateId = ref()
//翻页功能 前一页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchDataById()
}
//翻页功能 后一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchDataById()
}
onMounted(() => {
  // 获取 hash 部分，例如：#/cmpVision?templateId=zzzzzzz
  const hash = window.location.hash

  // 提取 ? 后面的部分
  const queryString = hash.split('?')[1]
  // 如果 queryString 存在，使用 URLSearchParams 解析参数
  if (queryString) {
    const params = new URLSearchParams(queryString)
    templateId.value = params.get('templateId') ?? ''
    // console.log('templateId:', templateId)
    fetchDataById()
  } else {
    console.log('No query string found')
  }

  //   queryForm.value.templateId = infoComp.value.templateId
})
</script>
