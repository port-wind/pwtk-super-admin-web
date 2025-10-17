<template>
  <!-- 查看 -->
  <el-row>
    <el-form :inline="true" class="search_left" label-width="80px">
      <el-form-item label="组件类型:" prop="" style="width: 250px">
        {{ editForm.componentType }}
      </el-form-item>
      <el-form-item label="组件名称:" prop="" style="width: 200px">
        {{ editForm.componentName }}
      </el-form-item>
    </el-form>
  </el-row>
  <el-form class="search_left">
    <el-row>
      <el-col :span="12">
        <el-form-item label="" prop="" style="width: 300px">
          <el-input
            type="textarea"
            show-word-limit
            placeholder="请输入Json"
            :rows="12"
            v-model="editForm.configParamJson"
            autocomplete="off"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { TableOptions } from '@/components/mTable/types'
import type { TableData } from '@/api/bss/attachmentManagement/types'
import { reqFavorite } from '@/api/user/index'
import mTable from '@/components/mTable/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
const tableRef = ref(null)
import count from '@/utils/tableHeight'
import i18n from '@/i18n'
const { t } = i18n.global as any

const props = defineProps({
  componentInfo: {
    type: Object
  }
})

const initQueryForm = () => ({})

const initPageObj = () => ({})

const tableData = ref<TableData[]>([])
const editForm = ref(props.componentInfo || {})
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const pageObj = ref(initPageObj())
const queryForm = ref(initQueryForm())

//loading 按钮
const isLoading = ref(false)

//搜索
async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  // console.log(queryForm.value)
  isLoading.value = true
  try {
    let res = await reqFavorite(vals)
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

onMounted(() => {})
</script>
