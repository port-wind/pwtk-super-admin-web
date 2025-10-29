<template>
  <el-dialog v-model="tableDialogVisible" :show-close="true" @open="openDialogTable" center>
    <template #default>
      <!--      @selection-change="handleSelectionChange" -->
      <el-table
        :data="paginatedData"
        style="width: 100%"
        @select="handleSelectionChange"
        @select-all="handleSelectAll($event)"
        ref="tableRef"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column label="Date" width="120">
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column property="name" label="Name" width="120" />
        <el-table-column property="address" label="use show-overflow-tooltip" width="240" show-overflow-tooltip />
        <el-table-column property="address" label="address" />
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.totalItems"
        layout="total, prev, pager, next, jumper"
      />
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="tableDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="tableSubmit">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { ElTable } from 'element-plus'
interface User {
  id: number
  date: string
  name: string
  address: string
}
const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland'
  },
  {
    id: 2,
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois'
  },
  {
    id: 3,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 4,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 5,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 6,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 7,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 8,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 9,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 10,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 11,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 12,
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho'
  }
]

// const tableData = ref<any[]>([])
const tableDialogVisible = ref(false)
// const isLoading = ref(false)

// 保存跨页选中的数据
const selectedItems = ref<any[]>([])

const openDialogTable = async () => {
  await getPaginatedData(1)
}

const tableRef = ref<InstanceType<typeof ElTable>>()
// 表格引用

// 分页状态
const pagination = reactive({
  currentPage: 1,
  pageSize: 5,
  totalItems: tableData.length // 假设数据从API获取
})

const paginatedData = ref<any[]>([])

// 在翻页时恢复选中的行
// 用于存储每页选中项目的 Map
const pageSelectionMap = ref(new Map())

// 获取分页数据
const getPaginatedData = (page) => {
  paginatedData.value = tableData.slice((page - 1) * pagination.pageSize, page * pagination.pageSize)
  // 恢复选中的行
}
const saveCurrentPageSelection = () => {
  pageSelectionMap.value.set(pagination.currentPage, selectedItems.value)
}

const handleSelectAll = (val) => {
  // console.log('handleSelectAll', val)
  if (val.length > 0) {
    // 全选所有页面的数据
    selectedItems.value = tableData
    // 更新每页的选中状态
    for (let i = 1; i <= Math.ceil(tableData.length / pagination.pageSize); i++) {
      const pageData = tableData.slice((i - 1) * pagination.pageSize, i * pagination.pageSize)
      pageSelectionMap.value.set(i, pageData)
    }
  } else {
    // 取消全选
    selectedItems.value = []
    pageSelectionMap.value.clear()
  }
  // console.log('pageSelectionMap', pageSelectionMap.value)
}
// 处理分页切换
const handleCurrentChange = async (page) => {
  // 保存当前页的选中数据
  await pageSelectionMap.value.set(pagination.currentPage, selectedItems.value)

  // 获取新的分页数据
  await getPaginatedData(page)

  const savedSelection = pageSelectionMap.value.get(page)
  selectedItems.value = savedSelection
  await nextTick(() => {})
  if (tableRef.value) {
    if (savedSelection && savedSelection.length > 0) {
      savedSelection.forEach((item) => {
        tableRef.value!.toggleRowSelection(item, true)
      })
    }
  }
  pagination.currentPage = page
}

// const multipleSelection = ref<User[]>([])
const handleSelectionChange = (val: User[]) => {
  selectedItems.value = val // 存储选中的数据
}
const tableSubmit = () => {
  const selectedIds: number[] = []
  pageSelectionMap.value.forEach((value) => {
    value.forEach((item) => {
      if (item.id) {
        selectedIds.push(item.id)
      }
    })
  })
}
</script>
<style lang="less" scoped></style>
