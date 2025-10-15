<template>
  <el-table
    :data="nestedData"
    :row-class-name="tableRowClassName"
    style="width: 100%"
    size="small"
    :header-cell-style="{ 'background-color': TableHeaderColors[indexRef.value] }"
    :row-style="{ 'background-color': changeColor(TableHeaderColors[indexRef.value], 0.5) }"
    :show-overflow-tooltip="{ disabled: true }"
  >
    <el-table-column type="expand" width="30">
      <template #default="{ row }">
        <NaviNestedTable :data="row.children" @editFromInside="editFromInside" @rowAddFromInside="rowAddFromInside" />
      </template>
    </el-table-column>
    <el-table-column label="域名" align="left" :width="200 + indexRef.value * 10" prop="hostDomain">
      <template #="{ row }">
        <span @click.stop="handleEdit(row)" class="like-a">
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
    <el-table-column label="目标URL" align="left" prop="targetUrl" min-width="150" />
    <el-table-column :label="t('table.controls')" align="center" width="100">
      <template #="{ row }">
        <el-button v-if="indexRef.value <= 4" type="success" plain size="small" @click="handleRowAdd(row)">
          新增下级
        </el-button>
      </template>
    </el-table-column>
    <el-table-column width="190"></el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
import { useOptions, optionsNavAlgo, optionsSupport, optionsNavOutStyle } from '@/const/options'
// import { unitFormatDate, handleDomainChange } from '@/utils/dateFormat/index'
import { TableHeaderColors } from '@/const/commonSet'
import i18n from '@/i18n'
import { changeColor } from '@/utils/formatDate'
// @ts-ignore
const { t } = i18n.global

const { formatData: formatNavAlgo } = useOptions(optionsNavAlgo)
const { formatData: formatSupport } = useOptions(optionsSupport)
const { formatData: formatNavOutStyle } = useOptions(optionsNavOutStyle)
const props = defineProps({
  data: Array
})

const nestedData = ref(props.data)
const indexRef = computed(() => {
  const list = nestedData.value.map((item) => {
    const mainIndex = parseInt(item.level)
    return ref(mainIndex)
  })
  console.log(list)
  return list[0]
})
const handleInside = defineEmits(['editFromInside', 'rowAddFromInside'])
const editFromInside = (val) => {
  handleInside('editFromInside', val)
}

const handleEdit = (row) => {
  console.log(nestedData)
  handleInside('editFromInside', row)
}

const rowAddFromInside = (val) => {
  handleInside('rowAddFromInside', val)
}
const handleRowAdd = (row) => {
  handleInside('rowAddFromInside', row)
}
const tableRowClassName = ({ row }) => {
  let classes = []

  if (row.children?.length > 0) {
    classes.push('expand-icon')
  } else {
    classes.push('no-expand-icon')
  }

  if (row.lastLine) {
    classes.push('last-one')
  }

  return classes.join(' ')
}
</script>
<style lang="less" scoped>
::v-deep .el-table__body {
  overflow: hidden !important;
  .last-one {
    td {
      border-bottom: 0;
    }
  }
  .el-table__inner-wrapper:before {
    height: 0 !important;
  }
}
::v-deep .el-table__inner-wrapper:before {
  display: none;
}
::v-deep .no-expand-icon {
  .el-table__expand-icon {
    display: none;
  }
}
:deep(.el-table__cell:last-child) {
  border-bottom-width: 0px !important;
}
</style>
