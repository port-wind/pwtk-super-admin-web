<template>
  <el-dialog v-model="isVisible" class="tabs-dialog" v-bind="$attrs" @close="close" draggable overflow destroy-on-close>
    <el-tabs v-model="activeTab" class="m_tabs">
      <el-tab-pane label="报纸详细" name="basic" class="m_tabs_pane" style="position: relative">
        <div
          style="position: absolute; top: 0; z-index: 10000; right: 20px"
          v-if="formMode === 'edit' && showRecommendField"
        >
          <el-button
            v-if="!recommendTopFlag"
            type="primary"
            color="#EC808D"
            style="color: white"
            @click="toRecommend()"
          >
            推荐
          </el-button>
          <el-button
            v-if="recommendTopFlag"
            type="primary"
            color="#AAAAAA"
            style="color: white"
            @click="toCancelRecommend()"
          >
            取消推荐
          </el-button>
        </div>
        <el-form :model="lineFormData" :rules="formRules" ref="editFormRef" class="dialog-form">
          <el-row justify="center" :gutter="20">
            <el-col :span="10">
              <el-form-item label="图纸系列ID:" prop="seriesCode">
                <UniRemoteInput
                  v-model="lineFormData.seriesCode"
                  :searchObj="{ manageSiteId: manageSiteId }"
                  valueKey="seriesCode"
                  labelKey="seriesName"
                  searchKey="seriesCode"
                  placeholder="请输入系列ID"
                  event-focus="focus"
                  @value-change="(item) => onSeriesCodeChange(item)"
                  :fetchOptions="listGameTypeSeries"
                  :formatLabel="
                    (item) => (item.seriesName ? `${item.seriesCode} - ${item.seriesName}` : item.seriesCode)
                  "
                />
              </el-form-item>
              <el-form-item label="报纸ID:" prop="newspaperCode">
                <el-input v-model="lineFormData.newspaperCode" maxlength="30" v-if="formMode === 'add'" />
                <span v-else>
                  <linkWithCopy :row-data="lineFormData" :config="{ idKey: 'newspaperCode', notShowLink: true }" />
                </span>
              </el-form-item>
              <el-form-item label="报纸名称:" prop="newspaperName">
                <el-input v-model="lineFormData.newspaperName" />
              </el-form-item>
              <el-form-item label="报纸简称:" prop="newspaperShortName">
                <el-input v-model="lineFormData.newspaperShortName" />
              </el-form-item>
              <el-form-item label="报纸全称:" prop="newspaperLongName">
                <el-input v-model="lineFormData.newspaperLongName" />
              </el-form-item>
              <el-form-item label="彩种:" prop="gameType">
                <span>
                  {{ getGameTypeName(lineFormData.gameType?.toString() || '') }}
                </span>
              </el-form-item>
              <!-- <el-form-item
            label="关联版面:"
            prop="isLayout"
          >
            <el-radio-group v-model="lineFormData.isLayout">
              <el-radio label="y">是</el-radio>
              <el-radio label="n">否</el-radio>
            </el-radio-group>
          </el-form-item> -->
              <el-form-item label="当前版面:" prop="layoutCode" style="width: 210px">
                <el-select v-model="lineFormData.layoutCode" placeholder="版面" clearable @change="onLayoutCodeChange">
                  <el-option v-for="item in layoutCodeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="关联版面A:" prop="layoutARef">
                <UniRemoteInput
                  v-model="lineFormData.layoutARef"
                  :search-obj="{ seriesCode: lineFormData.seriesCode }"
                  valueKey="newspaperCode"
                  labelKey="newspaperName"
                  searchKey="newspaperCode"
                  :placeholder="placeholderText('A')"
                  :disabled="!enableLayoutRef(lineFormData.layoutARef, 'A').value"
                  event-focus="focus"
                  @value-change="(item) => onNewsCodeChange(item, 'layoutARef')"
                  :fetchOptions="filteredList"
                  :formatLabel="formatLabel"
                  :debug="true"
                />
              </el-form-item>
              <el-form-item label="关联版面B:" prop="layoutBRef">
                <UniRemoteInput
                  v-model="lineFormData.layoutBRef"
                  :search-obj="{ seriesCode: lineFormData.seriesCode }"
                  valueKey="newspaperCode"
                  labelKey="newspaperName"
                  searchKey="newspaperCode"
                  :placeholder="placeholderText('B')"
                  :disabled="!enableLayoutRef(lineFormData.layoutBRef, 'B').value"
                  event-focus="focus"
                  @value-change="(item) => onNewsCodeChange(item, 'layoutBRef')"
                  :fetchOptions="filteredList"
                  :formatLabel="formatLabel"
                  :debug="true"
                />
              </el-form-item>
              <el-form-item label="关联版面C:" prop="layoutCRef">
                <UniRemoteInput
                  v-model="lineFormData.layoutCRef"
                  :search-obj="{ seriesCode: lineFormData.seriesCode }"
                  valueKey="newspaperCode"
                  labelKey="newspaperName"
                  searchKey="newspaperCode"
                  :placeholder="placeholderText('C')"
                  :disabled="!enableLayoutRef(lineFormData.layoutCRef, 'C').value"
                  event-focus="focus"
                  @value-change="(item) => onNewsCodeChange(item, 'layoutCRef')"
                  :fetchOptions="filteredList"
                  :formatLabel="formatLabel"
                  :debug="true"
                />
              </el-form-item>
              <el-form-item label="关联版面D:" prop="layoutDRef">
                <UniRemoteInput
                  v-model="lineFormData.layoutDRef"
                  :search-obj="{ seriesCode: lineFormData.seriesCode }"
                  valueKey="newspaperCode"
                  labelKey="newspaperName"
                  searchKey="newspaperCode"
                  :placeholder="placeholderText('D')"
                  :disabled="!enableLayoutRef(lineFormData.layoutDRef, 'D').value"
                  event-focus="focus"
                  @value-change="(item) => onNewsCodeChange(item, 'layoutDRef')"
                  :fetchOptions="filteredList"
                  :formatLabel="formatLabel"
                  :debug="true"
                />
              </el-form-item>
              <el-form-item v-if="formMode === 'edit'" label="创建时间:" prop="createTime">
                {{ lineFormData.createTime }}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="彩色:" prop="isColorful">
                <el-radio-group v-model="lineFormData.isColorful">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="推荐:" prop="isRecommended">
                <el-radio-group v-model="lineFormData.isRecommended">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="热门:" prop="isHot">
                <el-radio-group v-model="lineFormData.isHot">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="置顶:" prop="isTop">
                <el-radio-group v-model="lineFormData.isTop">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="精选:" prop="isSelected">
                <el-radio-group v-model="lineFormData.isSelected">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="爆款:" prop="isBloom">
                <el-radio-group v-model="lineFormData.isBloom">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="评论:" prop="commentFlag">
                <el-radio-group v-model="lineFormData.commentFlag">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="投票:" prop="voteFlag">
                <el-radio-group v-model="lineFormData.voteFlag">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="状态:" prop="status">
                <el-radio-group v-model="lineFormData.status">
                  <el-radio value="y">启用</el-radio>
                  <el-radio value="n">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="报纸描述:" prop="newspaperDesc">
                <el-input
                  type="textarea"
                  style="width: 75%"
                  show-word-limit
                  maxlength="512"
                  placeholder="请输入报纸描述"
                  v-model="lineFormData.newspaperDesc"
                  :rows="3"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="justify-content: center">
            <el-col :span="20">
              <el-form-item label="关键字:" prop="memo">
                <el-input
                  type="textarea"
                  v-model="lineFormData.memo"
                  show-word-limit
                  placeholder="请输入关键字"
                  maxlength="512"
                  style="max-width: 90%"
                  :rows="3"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="button-row" v-if="isOperateShow">
          <el-button @click="cancle">取消</el-button>
          <el-button type="primary" @click="handleSave">提交</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="lineFormData[`layoutAObj`]?.newspaperCode"
        label="关联版面A"
        name="layout1"
        class="m_tabs_pane"
      >
        <RelatedLayoutComponent :layout-data="lineFormData[`layoutAObj`]" :game-type-list="gameTypeList" />
      </el-tab-pane>
      <el-tab-pane
        v-if="lineFormData[`layoutBObj`]?.newspaperCode"
        label="关联版面B"
        name="layout2"
        class="m_tabs_pane"
      >
        <RelatedLayoutComponent :layout-data="lineFormData[`layoutBObj`]" :game-type-list="gameTypeList" />
      </el-tab-pane>
      <el-tab-pane
        v-if="lineFormData[`layoutCObj`]?.newspaperCode"
        label="关联版面C"
        name="layout3"
        class="m_tabs_pane"
      >
        <RelatedLayoutComponent :layout-data="lineFormData[`layoutCObj`]" :game-type-list="gameTypeList" />
      </el-tab-pane>
      <el-tab-pane
        v-if="lineFormData[`layoutDObj`]?.newspaperCode"
        label="关联版面D"
        name="layout4"
        class="m_tabs_pane"
      >
        <RelatedLayoutComponent :layout-data="lineFormData[`layoutDObj`]" :game-type-list="gameTypeList" />
      </el-tab-pane>
    </el-tabs>
    <template #footer></template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import { fetchGameTypes } from '@/utils/table'
import { listGameTypeSeries } from '@/api/photoSys/series' // Add
import showErrorMessage from '@/utils/showErrorMessage'
import { formateStrNum } from '@/utils/dataFormat'
import {
  create,
  update,
  getDetailById,
  listBySeriesCode,
  allListBySeriesCode,
  updateRecommend
} from '@/api/photoSys/news'
import RelatedLayoutComponent from '@/views/PhotosSys/newspaper/relatedLayout.vue'
import { unitFormatDate } from '@/utils/dateFormat'
import { initNewspaperEditForm } from '@/views/PhotosSys/newspaper/data'
const props = defineProps({
  isOperateShow: {
    type: Boolean,
    default: true
  }
})
const isLoading = ref(false)
const gameTypeList = ref()
const layoutCodeList = ref()
const modalsStore = useModalsStore()
const selectedRow = ref<any>()
const currentSeriesNewsList = ref<any[]>([])
const dialogVisible = ref(false)
const showRecommendField = computed(() => !!lineFormData.value.recommendTop)
const recommendTopFlag = computed(() => lineFormData.value.recommendTop === 'y')
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)

const editFormRef = ref()

const isVisible = computed(() => modalsStore.newsSeriesModal.isVisible)
const activeTab = computed(() => modalsStore.newsSeriesModal.activeTab)
const modalData = computed(() => modalsStore.newsSeriesModal.modalData || {})
const manageSiteId = computed(() => modalData.value.manageSiteId ?? '')
const formMode = computed(() => modalData.value.formMode ?? 'add')
const row: any = computed(() => modalData.value.lineFormData)

const lineFormData = ref(initNewspaperEditForm())

const emit = defineEmits(['callBack', 'refreshPage'])

const relatedLayouts = reactive({
  layoutARef: { newspaperCode: '', newspaperName: '' },
  layoutBRef: { newspaperCode: '', newspaperName: '' },
  layoutCRef: { newspaperCode: '', newspaperName: '' },
  layoutDRef: { newspaperCode: '', newspaperName: '' }
})

const formatLabel = computed(() => (item) => {
  const code = formateStrNum(item.newspaperCode)
  return item.newspaperName ? item.newspaperName + ' - ' + code : code
})
//新增的时候的
const rulesAdd = ref({
  seriesCode: [{ required: true, message: '请输入系列ID', trigger: 'blur' }],
  seriesName: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
  newspaperCode: [
    { required: true, message: '请输入报纸ID', trigger: 'blur' },
    {
      pattern: /^[a-z0-9]+$/,
      message: '报纸ID只能包含小写英文字母和数字',
      trigger: 'blur'
    }
  ],
  newspaperName: [{ required: true, message: '请输入报纸名称', trigger: 'blur' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }]
})
//编辑的时候的
const rulesEdit = ref({
  seriesName: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }]
})

const formRules = ref(formMode.value === 'add' ? rulesAdd : rulesEdit)

const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value && gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})

const placeholderText = computed(() => (layoutCode: 'A' | 'B' | 'C' | 'D') => {
  if (!!lineFormData.value.seriesCode) {
    if (layoutCode === lineFormData.value.layoutCode) {
      const selectedLayoutCodeText = lineFormData.value.layoutCode ? '当前版面' : '请先选择当前版面'
      return selectedLayoutCodeText
    }
    const defaultText = layoutCode === lineFormData.value.layoutCode ? '当前版面' : '请输入ID'
    const selectedLayoutCodeText = lineFormData.value.layoutCode ? defaultText : '请先选择当前版面'
    return filterNewspaperCodes(currentSeriesNewsList.value, lineFormData.value).length > 0
      ? selectedLayoutCodeText
      : `该系列暂无${currentSeriesNewsList.value.length > 0 ? '其他' : ''}可关联版面`
  }
  return '请先选择图纸系列'
})

const filteredList = async (params) => {
  console.log(params)

  const defaultRes = {
    data: {
      list: []
    }
  }
  const req = {
    seriesCode: selectedRow.value?.seriesCode,
    newspaperCode: params.newspaperCode,
    manageSiteId: manageSiteId.value
  }
  try {
    if (!req.seriesCode) {
      return defaultRes
    }
    const response = await allListBySeriesCode(req)
    const resList = (response.data?.list || []).filter((item) => !!item.newspaperCode)
    if (!response.success) {
      showErrorMessage(response)
      return defaultRes
    }
    const filteredData =
      resList?.map((item) => {
        return {
          ...item,
          disabled:
            item.newspaperCode === lineFormData.value.layoutAObj?.newspaperCode ||
            item.newspaperCode === lineFormData.value.layoutBObj?.newspaperCode ||
            item.newspaperCode === lineFormData.value.layoutCObj?.newspaperCode ||
            item.newspaperCode === lineFormData.value.layoutDObj?.newspaperCode ||
            item.newspaperCode === lineFormData.value.newspaperCode
        }
      }) || []
    return {
      ...response,
      data: {
        ...response.data,
        list: filteredData
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return defaultRes
  }
}
const clearAllLayoutObj = () => {
  ;['A', 'B', 'C', 'D'].forEach((key) => {
    lineFormData.value[`layout${key}Obj`] = {
      newspaperCode: '',
      newspaperName: ''
    }
    lineFormData.value[`layout${key}Ref`] = ''
  })
}
const onLayoutCodeChange = (value: string) => {
  console.log('Layout code changed:', value)
  if (!value && lineFormData.value.layoutCode === value) {
    clearAllLayoutObj()
    return
  }
  lineFormData.value[`layout${value}Obj`] = {
    newspaperCode: '',
    newspaperName: ''
  }
  lineFormData.value[`layout${value}Ref`] = ''
}
const close = () => {
  modalsStore.hideModal('newsSeriesModal')
}
const filterNewspaperCodes = (list, layoutRefs) => {
  if (!list?.filter) {
    return []
  }
  return (
    list?.filter(
      (item) =>
        item.newspaperCode !== layoutRefs.layoutARef &&
        item.newspaperCode !== layoutRefs.layoutBRef &&
        item.newspaperCode !== layoutRefs.layoutCRef &&
        item.newspaperCode !== layoutRefs.layoutDRef &&
        item.newspaperCode !== lineFormData.value.newspaperCode
    ) || []
  )
}
const onSeriesCodeChange = async (option: any) => {
  console.log(option)
  selectedRow.value = { seriesCode: option?.seriesCode || '', gameType: option?.gameType || '' }
  lineFormData.value.gameType = option?.gameType || ''
  lineFormData.value.layoutARef = ''
  lineFormData.value.layoutBRef = ''
  lineFormData.value.layoutCRef = ''
  lineFormData.value.layoutDRef = ''
  clearAllLayoutObj()
  try {
    const response = await allListBySeriesCode({
      seriesCode: option?.seriesCode || '',
      manageSiteId: manageSiteId.value,
      page: 1,
      size: 999
    })
    if (response.success) {
      const { list } = response.data
      currentSeriesNewsList.value = list
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const enableLayoutRef = (layoutRef, layoutCode: 'A' | 'B' | 'C' | 'D') =>
  computed(() => {
    // 如果当前的layoutRef有值，则返回true
    if (layoutRef) {
      return true
    }
    // 如果当前的layoutCode 和传入的layoutCode相同，则返回false
    if (!lineFormData.value.layoutCode || lineFormData.value.layoutCode === layoutCode) {
      return false
    }
    // 如果当前的seriesCode有值，则返回true
    return (
      !!lineFormData.value.seriesCode &&
      filterNewspaperCodes(currentSeriesNewsList.value, lineFormData.value).length > 0
    )
  })

const onNewsCodeChange = async (option: any, field: string) => {
  const layoutCode = field.replace('layout', '').replace('Ref', '')
  lineFormData.value[`layout${layoutCode}Obj`] = {
    newspaperCode: '',
    newspaperName: '',
    newspaperId: ''
  }
  lineFormData.value[`layout${layoutCode}Ref`] = ''
  if (!option) {
    return
  }
  const { id, seriesCode, newspaperCode } = option
  try {
    const response = await getDetailById({
      id: id,
      seriesCode,
      newspaperCode,
      manageSiteId: manageSiteId.value
    })
    if (response.success) {
      lineFormData.value[`layout${layoutCode}Obj`] = response.data
      lineFormData.value[`layout${layoutCode}Ref`] = response.data.newspaperCode
      relatedLayouts[field] = response.data
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const prepareNewsLayoutRelations = () => {
  const relations: any[] = []
  ;['A', 'B', 'C', 'D'].forEach((code) => {
    const obj = lineFormData.value[`layout${code}Obj`]
    if (obj && obj.newspaperCode) {
      relations.push({
        id: obj?.newspaperCode,
        newspaperCode: obj?.newspaperCode,
        layoutCode: code
      })
    }
  })
  return relations
}

const handleSave = async () => {
  try {
    await editFormRef.value.validate()
    const action = formMode.value === 'add' ? create : update
    const dataToSend = {
      ...lineFormData.value,
      newsLayoutRelations: prepareNewsLayoutRelations(),
      manageSiteId: manageSiteId.value
    }
    const response = await action(dataToSend)
    if (response.success) {
      ElMessage.success(formMode.value === 'add' ? '添加成功' : '更新成功')
      emit('refreshPage')
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const cancle = () => {
  modalsStore.hideModal('newsSeriesModal')
  modalsStore.resetModal('newsSeriesModal')
}
const initializeFormData = async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  layoutCodeList.value = ['A', 'B', 'C', 'D'].map((code) => ({ label: code, value: code }))
  if (formMode.value === 'edit') {
    const { id, seriesCode, gameType } = row.value
    const { newspaperCode, newspaperId } = modalData.value
    await onSeriesCodeChange({ seriesCode, gameType })

    const response = await getDetailById({
      id: newspaperId,
      seriesCode,
      newspaperCode,
      newspaperId,
      manageSiteId: manageSiteId.value
    })
    if (response.success) {
      const { newsLayoutRelations, layoutCode } = response.data

      lineFormData.value = {
        ...response.data,
        createTime: unitFormatDate(row.value.createTime, 'yyyy-MM-dd HH:mm:ss'),
        layoutARef: '',
        layoutBRef: '',
        layoutCRef: '',
        layoutDRef: ''
      }

      if (newsLayoutRelations && newsLayoutRelations.length > 0) {
        newsLayoutRelations.forEach((item) => {
          const lCode = item.layoutCode
          if (lCode === layoutCode) {
            lineFormData.value[`layout${lCode}Obj`] = { newspaperCode: '', newspaperName: '' }
            lineFormData.value[`layout${lCode}Ref`] = ''
            relatedLayouts[`layout${lCode}Ref`] = ''
          } else {
            lineFormData.value[`layout${lCode}Obj`] = item
            lineFormData.value[`layout${lCode}Ref`] = item.newspaperCode
            relatedLayouts[`layout${lCode}Ref`] = item
          }
        })
      }
    }
  }
}
const toRecommend = async () => {
  ElMessageBox.confirm('此操作将推荐该报纸，确定推荐吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    isLoading.value = true
    try {
      const res = await updateRecommend({
        recommendTop: 'y',
        newspaperCode: lineFormData.value.newspaperCode
      })
      if (res.success) {
        ElMessage.success('推荐成功')
        lineFormData.value.recommendTop = 'y'
      } else {
        showErrorMessage(res)
      }
    } catch (error) {
      ElMessage.error('推荐失败')
    } finally {
      isLoading.value = false
    }
  })
}
const toCancelRecommend = async () => {
  ElMessageBox.confirm('此操作将取消推荐该报纸，确定取消推荐吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    isLoading.value = true
    try {
      const res = await updateRecommend({
        recommendTop: 'n',
        newspaperCode: lineFormData.value.newspaperCode
      })
      if (res.success) {
        ElMessage.success('取消推荐成功')
        lineFormData.value.recommendTop = 'n'
      } else {
        showErrorMessage(res)
      }
    } catch (error) {
      ElMessage.error('取消推荐失败')
    } finally {
      isLoading.value = false
    }
  })
}
onMounted(async () => {
  await initializeFormData()
  console.log(lineFormData.value)
})
</script>

<style lang="scss" scoped>
:deep(.el-tab-pane) {
  height: 65vh;
  overflow-y: auto;
}
</style>
