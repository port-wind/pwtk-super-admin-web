<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form
        :inline="true"
        :model="queryForm"
        class="custom-el-form no-rule"
        label-width="70px"
        @keyup.enter="fetchData({ page: 1, size: 15 })"
      >
        <el-form-item label="" prop="postId">
          <AutoComplete
            v-model="queryForm.postId"
            max-length="32"
            keyword="postId"
            :httpFunc="reqHttpBBsForumList"
            :displayFields="['postId']"
            :displayName="'postName'"
            :trigger-on-focus="true"
            placeholder="帖子ID"
            :isList="true"
            style="width: 140px"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="forumId" v-if="!isForumIdHidden">
          <AutoComplete
            v-model="queryForm.forumId"
            max-length="32"
            keyword="forumId"
            :httpFunc="getBBsForumIdById"
            :displayFields="['forumId']"
            :displayName="'forumName'"
            :trigger-on-focus="true"
            placeholder="论坛ID"
            isList
            style="width: 100px"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="forumId">
          <SelectUserIdAndNickname
            v-model="queryForm.postUserId"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="用户昵称｜帐号"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="" prop="forumStatus">
          <GameTypeList placeholder="彩种" v-model="queryForm.postGametypeRef" allGame style="width: 100px" />
        </el-form-item>
        <el-form-item label="" prop="postYear">
          <!-- <el-input v-model.trim="queryForm.postYear" placeholder="发布年份" /> -->
          <el-select v-model="queryForm.postYear" placeholder="" @change="yearChange" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="(item, index) in YearTypes" :label="item.label" :value="item.value" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="postIssue">
          <el-input v-model.trim="queryForm.postIssue" placeholder="发布期数" style="width: 100px" />
        </el-form-item>

        <el-form-item label="" prop="bbsId" v-if="isBBSMain">
          <el-select v-model="queryForm.bbsId" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option label="资料大全" value="corpus" />
          </el-select>
        </el-form-item>
        <ExpandableSection
          v-if="isBBSMain"
          v-model="isExpanded"
          :resizeRef="queryRef"
          :numVisibleItems="6"
        ></ExpandableSection>
        <el-form-item>
          <el-button type="primary" @click="fetchData()" :loading="isLoading">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="() => handleAddButton({ forumId: dynamicValue })">
            <el-icon>
              <Plus />
            </el-icon>
            新增
          </el-button>
          <el-button v-if="isShowCheckboxTable" type="success" plain @click="() => handleSpecialClick('bbsForumPost')">
            <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
            同步
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        :pagination="true"
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #postInfo="{ scope }">
          <div style="display: flex; align-items: center">
            <p>
              <span v-if="scope.row.predictFlag === 'y'" style="color: red">#参赛贴#</span>
              <span class="like-a overflow-hidden" type="primary" @click="handleTableEdit(scope)">
                {{ truncateText(scope.row.title) }}
              </span>
            </p>
            <p style="margin-left: 10px; cursor: pointer; z-index: 999">
              <el-icon class="cursor-pointer" @click="handleScreenDetail(scope)">
                <Position />
              </el-icon>
            </p>
            <p style="margin-left: 10px; cursor: pointer; z-index: 999">
              <el-icon>
                <DocumentCopy
                  color="#7ecb5b"
                  @click="() => handleAddButton({ postId: scope.row.postId, forumId: dynamicValue })"
                />
              </el-icon>
            </p>
          </div>
        </template>
        <template #forumInfo="{ scope }">
          <p class="like-a overflow-hidden" @click="handleForumEdit(scope)">
            {{ scope.row.forumName }}
          </p>
        </template>
        <template #tags="{ scope }">
          {{ getTagLabels(scope) }}
        </template>
        <template #countInfo="{ scope }">
          <p
            class="overflow-hidden"
            v-if="
              (scope.row.likeCount && scope.row.likeCount != '0') ||
              (scope.row.favoriteCount && scope.row.favoriteCount != '0') ||
              (scope.row.threadCount && scope.row.threadCount != '0') ||
              (scope.row.readCount && scope.row.readCount != '0')
            "
          >
            <span>{{ scope.row.likeCount ? scope.row.likeCount : 0 }}</span>
            ｜
            <span>{{ scope.row.favoriteCount ? scope.row.favoriteCount : 0 }}</span>
            ｜
            <span>{{ scope.row.threadCount ? scope.row.threadCount : 0 }}</span>
            ｜
            <span>{{ scope.row.readCount ? scope.row.readCount : 0 }}</span>
          </p>
        </template>
        <template #isSwitch="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.postStatus === 'y' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="scope.row.postStatus"
            :active-value="'y'"
            :inactive-value="'n'"
            :before-change="() => statusChanged(scope.row)"
          ></el-switch>
        </template>
        <template #isAttachment="{ scope }">
          <template v-if="scope.row.hasAttachment == 'y'">有</template>
          <template v-else>无</template>
        </template>
        <template #gameType="{ scope }">
          <p>{{ getGameNameByGameTypeCode(scope.row.postGametypeRef) }}</p>
        </template>
        <template #postTime="{ scope }">
          {{ unitFormatDate(scope.row.postTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
      </m-table>
    </section>
    <modalPostSeries v-if="modalsStore.postSeriesModal.isVisible" @refreshPage="fetchData" />
    <modalForumSeries @refreshPage="fetchData" />
    <modalPostScreenDetail v-if="modalsStore.postScreenDetailModal.isVisible" @refreshPage="fetchData" />
    <checkbox-table v-if="modalsStore?.checkboxTable?.isVisible" />
    <!-- <DialogPostContent v-model="addDialogVisible" /> -->
    <AddBBSPostDialog v-if="addDialogVisible" ref="AddBBSPostDialogRef" @on-closed="onClosed" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  reqHttpBBsForumList,
  createBbsPost,
  updateBbsPost,
  updateStatusApi
} from '@/api/bss/postContentManagement/index'
import { getBBsForumIdById } from '@/api/bss/forumManagement/index'
import type { IReqHttpBBsForumListData, IReqHttpBBsForumListQueryParams } from '@/api/bss/postContentManagement/types'
import { reqUserList } from '@/api/user/index'
import ExpandableSection from '@/components/expandIcon/index.vue'

import { options } from '@/views/Bbs/bbsPostContentManagement/data'
import modalPostScreenDetail from '@/components/modalCommon/postScreenDetail/index.vue'
import router from '@/router'
import mTable from '@/components/mTable/index.vue'
import AutoComplete from '@/components/AutoComplete/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
// import i18n from '@/locales'
import { truncateText, YearTypes } from '@/utils/dataFormat'

// const { t } = i18n.global as any
//弹窗
import modalPostSeries from '@/components/modalCommon/postSeriesModal/index.vue'
import modalForumSeries from '@/components/modalCommon/forumSeriesModal/index.vue'
import { useModalsStore } from '@/stores/modalStore'
import { useRoute } from 'vue-router'
import type { IGetGameHistoryQueryParams, TGameId } from '@/api/photoSys/gameResult/index.ts'
import { useBettingStore } from '@/stores/bettingStore'
import { getGameIssuesList, type IGetGameIssuesListQueryParams } from '@/api/betting'
import { ElMessageBox } from 'element-plus'
import { useDeployConfig } from '@/components/checkboxTable/util'
import { unitFormatDate } from '@/utils/dateFormat'

const routes = useRoute()
const isBBSMain = computed(() => routes.path.includes('/bbs/bbsPostContentManagement'))

const { isShowCheckboxTable, handleSpecialClick } = useDeployConfig()
const bettingStore = useBettingStore()
const modalsStore = useModalsStore()
const useRoutes = useRoute()
const tableRef = ref(null)
const queryRef = ref()
const isExpanded = ref(false)
const tableData = ref<IReqHttpBBsForumListData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const GameIssueList = ref<{ label: string; value: string }[]>([])
//loading 按钮
const isLoading = ref(false)

const activeName = ref('first') //tab默认显示

const addDialogVisible = ref(false)
const editDialogVisible = ref(false)

const AddBBSPostDialogRef = ref()
//表单居中
const rowAttrs = {
  gutter: 0,
  justify: 'center'
}

//弹窗需要
const forumDialogVisible = ref(false)
const forumId = ref('')
const addForm = ref()
const editForm = ref()

//add 新增 edit 编辑
const formMode = ref<string>('add')
const lineFormData = ref()
const postId = ref()

const onClosed = () => {
  addDialogVisible.value = false
  fetchData()
}
const pathRegex = /^\/bbsList\/bbsPostContentList\/([A-Za-z0-9]+)$/
// 'GSLT', 'TJLT', 'JCTJLT', 'TPYMJC', 'SPYMJC'
const dynamicValue =
  computed<string | undefined>(() => {
    const match = useRoutes.path.match(pathRegex)
    return match ? match[1] : undefined // match[1] is the captured group (e.g., "GSLT")
  }) || ''
const isForumIdHidden = computed(() => {
  return pathRegex.test(useRoutes.path) && dynamicValue
})
const initForm = (): IReqHttpBBsForumListQueryParams => ({
  postId: '',
  forumId: dynamicValue.value,
  postUserId: '',
  postGametypeRef: '',
  postYear: 'L',
  postIssue: '',
  page: 1,
  size: 15,
  sortName: 'last_edit_time',
  sortOrder: 'DESC',
  bbsId: isBBSMain.value ? 'corpus' : ''
})

const initAddForm = ref({
  viewFlag: 'a',
  postStatus: 'y',
  postId: '',
  postYear: '2025',
  postIssue: '',
  forumId: dynamicValue.value,
  postUserId: '',
  enableAnonymous: 'y',
  postGameRef: '',
  postGametypeRef: '',
  hasAttachment: 'n',
  isHot: 'n',
  isSelected: 'n',
  isTop: 'n',
  isRecommended: 'n',
  isVote: 'y',
  isBloom: 'n'
})

const queryForm = reactive<IReqHttpBBsForumListQueryParams>(initForm())

// 示例评论数据
const comments = ref<any[]>([])

//新增的时候的
const rulesAdd = ref({
  forumId: [{ required: true, message: '论坛ID不能为空', trigger: 'blur' }],
  postUserId: [{ required: true, message: '发布用户ID不能为空', trigger: 'blur' }],
  postGametypeRef: [{ required: true, message: '游戏类型不能为空', trigger: 'blur' }],
  postYear: [{ required: true, message: '发布年份不能为空', trigger: 'blur' }],
  postIssue: [{ required: true, message: '发布期数不能为空', trigger: 'blur' }]
})

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  queryForm.size = val
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  queryForm.page = val
}

const handleRules = (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
      handleSubmit(scope.model)
    } else {
      console.error('表单验证失败')
    }
  })
}

//弹窗编辑按钮点击
const handleTableEdit = (scope: any) => {
  // const postId = scope.row.postId
  // const forumId = scope.row.forumId
  // AddBBSPostDialogRef.value.openDialog({ postId, forumId })
  formMode.value = 'edit'
  activeName.value = 'first'
  postId.value = scope.row.postId
  modalsStore.showModal('postSeriesModal')
  modalsStore.setActiveTab('postSeriesModal', 'first')
  modalsStore.setModalData('postSeriesModal', {
    postId: postId.value,
    forumId: scope.row.forumId,
    isOperateShow: true
  })
  editDialogVisible.value = true
}
const handleScreenDetail = (scope: any) => {
  // postId.value = scope.row.postId
  // const baseUrl = window.location.origin // This will give us "http://localhost:8000"
  // const url = `${baseUrl}/#/bbs/bbsPostContentManagement${
  //   postId.value ? `?postId=${postId.value}` : ''
  // }`
  // window.open(url, '_blank')

  postId.value = scope.row.postId
  const routeData = router.resolve({
    path: useRoutes.fullPath,
    query: { postId: postId.value }
  })
  window.open(routeData.href, '_blank')
}

//提交
const handleSubmit = async (row) => {
  const params = row
  try {
    const response = formMode.value === 'add' ? await createBbsPost(params) : await updateBbsPost(params)

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
}

const statusChanged = (row) => {
  return new Promise((resolve, reject) => {
    // if (row.forumStatus === 'n') {
    //   updateStatus(row).then(resolve).catch(reject);
    // } else {
    ElMessageBox.confirm('请确认是否执行此操作', '提示', {
      confirmButtonText: '确定',
      cancelButtonClass: '取消',
      type: 'warning'
    })
      .then(() => {
        updateStatus(row).then(resolve).catch(reject)
      })
      .catch(() => {
        reject(new Error('用户取消操作'))
      })
    // }
  })
}

const getGameNameByGameTypeCode = (gameTypeCode) => {
  const res = bettingStore.gameType.find((item) => {
    return item.gameType === gameTypeCode
  })
  return res?.gameTypeName
}

const getGameObjectByGameTypeCode = (gameTypeCode): TGameId => {
  const gameKey = { '2032': 'aSix', '1': 'hkSix', '3995': 'sgSix', 84: 'twSix', '5': 'xaSix', '6': 'kl8' }
  return gameKey[gameTypeCode]
}

/**
 * 更新状态函数，执行异步请求
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */
const updateStatus = async (row) => {
  const params = row
  params.postStatus = row.postStatus === 'y' ? 'n' : 'y'
  try {
    const response = await updateStatusApi(params)
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

//---------------------------------------------------Search新增按钮点击---------------------------------------------------
const handleAddButton = (params?: any) => {
  console.log('🚀 ~ handleAddButton ~ params:', params)
  addDialogVisible.value = true
  nextTick(() => {
    AddBBSPostDialogRef.value.openDialog(params)
  })
  // AddBBSPostDialogRef.value.openDialog()
  // formMode.value = 'add'
  // nextTick(() => {
  //   addForm.value.resetFields()
  // })
}

//页面初始化获取数据
const fetchData = async (queryParams?: Partial<IReqHttpBBsForumListQueryParams>) => {
  isLoading.value = true
  try {
    const query: IReqHttpBBsForumListQueryParams = {
      ...queryForm,
      ...queryParams
    }
    if (query.postYear === 'L') {
      query.postYear = ''
    }

    if (query.postGametypeRef === 'L') {
      query.postGametypeRef = ''
    }
    if (query.bbsId === 'L') {
      query.bbsId = ''
    }
    const response = await reqHttpBBsForumList(query)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
      tableData.value.forEach((item) => {
        if (!item.title) {
          if (item.postContent) {
            item.title = item.postContent.slice(0, 10)
          } else {
            item.title = '帖子标题'
          }
        }
      })
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

// 使用示例

const resetButton = () => {
  Object.assign(queryForm, initForm())
  fetchData()
}

const closeDialog = () => {
  addDialogVisible.value = false
  lineFormData.value = null
}

const handleForumEdit = (scope: any) => {
  forumId.value = scope.row.forumId
  modalsStore.showModal('forumSeriesModal')
  modalsStore.setModalData('forumSeriesModal', {
    forumId: forumId.value
  })
  forumDialogVisible.value = true
}

//table标签的展示
const getTagLabels = (scope: any) => {
  const labels: string[] = []
  if (scope.row.isRecommended === 'y') labels.push('推荐')
  if (scope.row.isHot === 'y') labels.push('热门')
  if (scope.row.isSelected === 'y') labels.push('精选')
  if (scope.row.isTop === 'y') labels.push('置顶')
  if (scope.row.isBloom === 'y') labels.push('爆款')

  return labels.join('｜')
}

//页面初始化加载
onMounted(async () => {
  if (pathRegex.test(useRoutes.path)) {
    const dynamicValue = computed<string | undefined>(() => {
      const match = useRoutes.path.match(pathRegex)
      return match ? match[1] : undefined // match[1] is the captured group (e.g., "GSLT")
    })
    fetchData({ forumId: dynamicValue.value })
  } else {
    fetchData()
  }
  const query = router.currentRoute.value.query
  queryForm.postId = query.mainPostId as string
  if (query.postId) {
    modalsStore.showModal('postScreenDetailModal')
    modalsStore.setActiveTab('postScreenDetailModal', 'first')
    modalsStore.setModalData('postScreenDetailModal', {
      postId: query.postId,
      isOperateShow: true
    })
  }
})

const fetchGameHistory = async (gameId: number, year: number) => {
  const data: IGetGameHistoryQueryParams = {
    page: 1,
    size: 10,
    year: year,
    sortOrder: 'DESC'
  }
  // const gameTypeNumber = gameId.replace(/Six/g, '6') as TGameTypeNumber
  const query: IGetGameIssuesListQueryParams = {
    year: year,
    gameType: gameId
  }
  const res = await getGameIssuesList(query)
  if (res.success) {
    GameIssueList.value = res?.data!.map((item) => {
      return {
        label: item,
        value: item
      }
    })
  }
}

/**
 * 增加一条记录
 * @param dataArray
 */
const addNewRecordWithUpdates = (dataArray, year: number) => {
  if (new Date().getFullYear() > year) {
    return dataArray
  }
  // 加2期未来开奖的
  const [firstRecord, ...other] = dataArray
  // Use structured cloning to avoid side effects
  const newIssue1 = { ...firstRecord, issue: (Number(firstRecord.issue) + 1).toString() }
  const newIssue2 = { ...firstRecord, issue: (Number(firstRecord.issue) + 2).toString() }
  // Return the updated array
  return [newIssue2, newIssue1, ...dataArray]
}

watch(
  () => [queryForm.page, queryForm.size],
  (newVal, oldVal) => {
    fetchData()
  }
)

const formChangeValue = (val) => {
  if (val.value.postGametypeRef && val.value.postYear) {
    // GameIssueList.value = []
    // const key = getGameObjectByGameTypeCode(val.value.postGametypeRef)
    fetchGameHistory(val.value.postGametypeRef, val.value.postYear)
  }
}
</script>

<style scoped lang="less">
.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.wrapper {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}
</style>
