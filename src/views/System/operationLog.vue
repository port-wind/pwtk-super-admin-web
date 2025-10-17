<template>
  <div id="sys_roles">
    <div class="search" ref="tableRef">
      <el-input
        style="width: 120px; margin-right: 10px"
        v-model="queryParams.operator"
        :placeholder="t('table.operator')"
        clearable
      ></el-input>
      <el-date-picker
        @change="changeDate"
        v-model="queryParams.daterange"
        range-separator="-"
        type="datetimerange"
        unlink-panels
        :disabled-date="disabledDate"
        :start-placeholder="t('input.timeon')"
        :end-placeholder="t('input.EndTime')"
      ></el-date-picker>
      <el-button type="primary" @click="getoperationList">
        {{ t('button.search') }}
      </el-button>
    </div>
    <div>
      <el-table :data="operationList" border style="width: 100%" stripe highlight-current-row :height="count(tableRef)">
        <el-table-column :label="t('table.operator')" align="left" #default="scope">
          <div>
            {{ scope.row.accountName }}
            <copy :content="scope.row.accountName" :title="t('table.operator')" />
          </div>
        </el-table-column>
        <el-table-column prop="path" :label="t('table.operationPath')" align="left"></el-table-column>
        <el-table-column
          prop="params"
          :label="t('table.operationParameter')"
          align="left"
          min-width="400"
        ></el-table-column>
        <el-table-column prop="interfaceDesc" :label="t('table.operationInstructions')" align="left"></el-table-column>
        <el-table-column prop="ip" label="IP" align="left"></el-table-column>
        <el-table-column width="160px" prop="createTime" :label="t('table.TIME')" align="left"></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="pageParams.pagenumber"
        v-model:page-size="pageParams.pagesize"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="pageParams.total"
        @size-change="changeSize"
        @current-change="changeCurrent"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import i18n from '@/i18n'
const { t } = i18n.global as any
import { operationLogList } from '@/api/system/index'
import timezone from '@/utils/timezone'
// 计算表格高度
import count from '@/utils/tableHeight'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat'
const tableRef = ref(null)
interface qParams {
  operator: string
  daterange: any
}
const queryParams = reactive<qParams>({
  //查询参数
  operator: '',
  daterange: ''
})
const pageParams = reactive({
  //分页参数
  pagesize: 15,
  pagenumber: 1,
  total: 0
})
// 切换每页展示条数
const changeSize = (data) => {
  pageParams.pagenumber = pageParams.pagenumber
  pageParams.pagesize = pageParams.pagesize
  getoperationList()
}
// 切换页面
const changeCurrent = (data) => {
  pageParams.pagenumber = pageParams.pagenumber
  pageParams.pagesize = pageParams.pagesize
  getoperationList()
}
//日期禁用
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
const operationList = ref([]) // 操作日志数据
// 获取操作日志
const getoperationList = () => {
  let beginTime: any = ''
  let endTime: any = ''
  if (queryParams.daterange && queryParams.daterange.length > 0) {
    beginTime = new Date(timezone(queryParams.daterange[0], 'Asia/Shanghai')).getTime()
    endTime = new Date(timezone(queryParams.daterange[1], 'Asia/Shanghai')).getTime()
  }
  let params: any = {
    username: queryParams.operator,
    page: pageParams.pagenumber,
    size: pageParams.pagesize
  }
  if (beginTime) {
    params.beginTime = beginTime
    params.endTime = endTime
  }
  // console.log(params);
  operationLogList(params).then((res) => {
    console.log(res, 123)
    if (res.success && res.data) {
      pageParams.total = parseInt(res.data.total)
      if (res.data.list) {
        // console.log(res.data.list)
        operationList.value = res.data.list.map((item, index) => {
          item.number = pageParams.pagesize * (pageParams.pagenumber - 1) + index + 1
          item.createTime = unitFormatDate(item.createTime, 'yyyy-MM-dd HH:mm:ss')
          return item
        })
      } else {
        operationList.value = []
      }
    }
  })
}

// 切换日期
const changeDate = (data) => {
  if (data) {
    queryParams.daterange = [
      unitFormatDate(data[0], 'yyyy-MM-dd HH:mm:ss'),
      unitFormatDate(data[1], 'yyyy-MM-dd HH:mm:ss')
    ]
  } else {
    queryParams.daterange = ''
  }
  getoperationList()
}
onMounted(() => {
  getoperationList() //获取操作日志列表
})
</script>
<style lang="less" scoped>
#sys_roles {
  .search {
    margin-bottom: 10px;

    > div {
      margin-right: 10px;
    }

    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
