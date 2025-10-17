import { reactive, onMounted, computed, toRefs } from 'vue'
import { useRequest } from 'vue-hooks-plus'
/**
 * @description table 页面表格操作方法封装
 * @param {Function} api 获取表格数据 api 方法(必传)
 * @param {Object} initParam 获取数据初始化参数(非必传，默认为{})
 * @param {Boolean} isPageable 是否有分页(非必传，默认为true)
 * @param {Boolean} manual 是否手动触发(非必传，默认为false)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法(非必传)
 * */
export const useTable = (api: any, initParam = {}, isPageable = true, manual = false, dataCallBack: any) => {
  /**
   * 1.获取表格数据的方法getTableData
   * 2.查询条件变量searchParam
   * 3.分页查询条件变量pagination
   * 4.分页pageSize变更的方法handleSizeChange()
   * 5.分页currentPage变更的方法handleCurrentChange()
   * 6.查询方法search()
   * 7.初始化参数的变量searchInitParam
   */
  const state: any = reactive({
    // 表格数据
    tableData: [],
    // 分页数据
    pagination: {
      // 当前页数
      current: 1,
      // 每页显示条数
      pageSize: 15,
      // 总条数
      total: 0
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    searchInitParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {},
    // 是否加载中
    loading: false,
    // 接口返回的所有内容
    responseData: null
  })
  const pageParam: any = computed({
    get: () => {
      return {
        current: state.pagination.current,
        pageSize: state.pagination.pageSize
      }
    }
  })
  onMounted(() => {
    !manual && reset()
  })
  // 调用接口获取表格数据
  const getData = useRequest(api, {
    manual: true
  })
  const getTableData = async () => {
    try {
      //合并查询参数
      Object.assign(state.totalParam, isPageable ? pageParam.value : {}, initParam)
      state.loading = true
      let data: any = await getData.runAsync(state.totalParam)
      state.responseData = data
      const { current, pageSize, total, list } = data // 接口返回内容的数据格式
      //回调处理，此处可以满足对特殊数据的处理
      dataCallBack && (data = dataCallBack(data))
      //根据是否分页，进行赋值
      state.tableData = isPageable ? list : data
      //对分页参数进行更新
      isPageable &&
        updatePagination({
          current,
          pageSize,
          total
        })
    } catch (err) {
    } finally {
      state.loading = false
    }
  }
  const updatePagination = (resPageable: any) => {
    Object.assign(state.pagination, resPageable)
  }
  const updatedTotalParam = () => {
    state.totalParam = {}
    // 处理查询参数，可以给查询参数加自定义前缀操作
    let nowSearchParam: any = {}
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (let key in state.searchParam) {
      // * 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key]
      }
    }
    Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParam.value : {})
  }

  const search = () => {
    state.pagination.current = 1
    updatedTotalParam()
    getTableData()
  }

  const reset = () => {
    state.searchParam = {}
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    Object.keys(state.searchInitParam).forEach((key) => {
      state.searchParam[key] = state.searchInitParam[key]
    })
    search()
  }

  const handleSizeChange = (val: any) => {
    state.pagination.current = 1
    state.pagination.pageSize = val
    getTableData()
  }

  const handleCurrentChange = (val: any) => {
    state.pagination.current = val
    getTableData()
  }

  return {
    ...toRefs(state),
    getTableData,
    handleCurrentChange,
    handleSizeChange,
    search,
    reset
  }
}
