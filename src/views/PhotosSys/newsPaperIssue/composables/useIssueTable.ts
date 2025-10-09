// composables/useIssueTable.ts
import { ref, reactive } from 'vue'
import { list } from '@/api/photoSys/issues'
import showErrorMessage from '@/utils/showErrorMessage'
import type { TableState, QueryForm } from '../IssueTypes/index'
import type { TableOptions } from '@/components/mTable/types'

export function useIssueTable() {
  const tableState = reactive<TableState>({
    tableData: [],
    total: 0,
    currentPage: 1,
    pageSize: 15,
    isLoading: false
  })
  const tableOptions: TableOptions[] = [
    {
      prop: 'year',
      label: '年份',
      align: 'right',
      columAttr: { minWidth: 60 }
    },
    {
      prop: 'issue',
      label: '期数',
      align: 'right',
      slot: 'issue',
      columAttr: { minWidth: 100 }
    },
    {
      prop: 'name',
      label: '图纸名称',
      slot: 'name',
      columAttr: { minWidth: 200 }
    },
    {
      prop: 'newspaperCode',
      label: '报纸名称',
      slot: 'newspaperCode',
      columAttr: { minWidth: 150 }
    },
    {
      prop: 'seriesCode',
      label: '系列名称',
      slot: 'seriesCode',
      columAttr: { minWidth: 150 }
    },
    {
      prop: 'gameType',
      label: '彩种',
      slot: 'gameType',
      columAttr: { minWidth: 80 }
    },
    {
      prop: 'status',
      label: '状态',
      slot: 'status',
      columAttr: { minWidth: 110 }
    },
    {
      prop: 'isColorful',
      label: '彩色',
      json: {
        sourceName: 'yOrN',
        keyName: 'isColorful'
      },
      columAttr: { minWidth: 60 }
    },
    {
      prop: 'tags',
      label: '标签',
      slot: 'tags',
      columAttr: { minWidth: 220 }
    },
    {
      prop: 'imgPath',
      label: '图片',
      slot: 'imgPath',
      columAttr: { minWidth: 80, align: 'center' }
    },
    {
      prop: 'readCount',
      label: '阅读数量',
      align: 'right',
      columAttr: { minWidth: 100 }
    },
    {
      prop: 'commentFlag',
      label: '评论',
      json: {
        sourceName: 'yOrN',
        keyName: 'commentFlag'
      },
      columAttr: { minWidth: 60 }
    },
    {
      prop: 'voteFlag',
      label: '投票',
      json: {
        sourceName: 'yOrN',
        keyName: 'voteFlag'
      },
      columAttr: { minWidth: 60 }
    },
    {
      prop: 'annotateContent',
      label: '注解',
      showOmission: true,
      columAttr: { minWidth: 200 }
    }
  ]
  const initQueryForm = (): QueryForm => ({
    year: '',
    issue: '',
    gameType: '',
    name: '',
    newspaperName: '',
    newspaperCode: ''
  })

  const queryForm = reactive<QueryForm>(initQueryForm())

  const fetchData = async () => {
    const params = {
      page: tableState.currentPage,
      size: tableState.pageSize,
      sortName: 'create_time',
      sortOrder: 'DESC',
      ...queryForm
    }

    tableState.isLoading = true

    try {
      const response = await list(params)
      if (response.success) {
        tableState.tableData =
          response.data?.list?.map((item: any) => ({
            ...item,
            issue: item.issue?.toString() || '',
            id: item.issueId
          })) || []
        tableState.total = Number(response.data.total)
      } else {
        tableState.tableData = []
        tableState.total = 0
        showErrorMessage(response)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      tableState.tableData = []
      tableState.total = 0
    } finally {
      tableState.isLoading = false
    }
  }

  const handleReset = () => {
    Object.assign(queryForm, initQueryForm())
    tableState.currentPage = 1
    tableState.pageSize = 15
    fetchData()
  }

  const handleSizeChange = (val: number) => {
    tableState.pageSize = val
    fetchData()
  }

  const handleCurrentChange = (val: number) => {
    tableState.currentPage = val
    fetchData()
  }
  const getTagLabels = (scope: any) => {
    const labels: string[] = []
    if (scope.row.isRecommended === 'y') labels.push('推荐')
    if (scope.row.isHot === 'y') labels.push('热门')
    if (scope.row.isSelected === 'y') labels.push('精选')
    if (scope.row.isTop === 'y') labels.push('置顶')
    if (scope.row.isBloom === 'y') labels.push('爆款')

    return labels.join('｜')
  }
  return {
    tableState,
    tableOptions,
    queryForm,
    fetchData,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
    initQueryForm,
    getTagLabels
  }
}
