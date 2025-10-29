<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { Trophy } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { getGameIssuesList } from '@/api/betting'
import { createBbsPost, getPostDetail, getPostPredictionRules, lastIssuePost } from '@/api/bss/postContentManagement'
import showErrorMessage from '@/utils/showErrorMessage'
import type { ICreateBbsPostQueryParams, PredictionInfo } from '@/api/bss/postContentManagement/types'
import BBSPostForm, { type ExposeBBSPostForm } from './components/BBSPostForm.vue'
import PostEditor from './components/postEditor.vue'
import AttachmentManage from './components/attachmentManage.vue'
import { getIssueListByParams } from '@/api/photoSys/issues'
import { usePostGameUtilLogic } from './components/usePostGameUtilLogic'

interface GameIssueItem {
  label: string
  value: string
}
const emits = defineEmits(['onClosed'])
const routes = useRoute()
const addDialogVisible = ref(false)
const postEditorRef = ref(null)
const ruleFormRef = ref<FormInstance>()
const initQueryForm = (): ICreateBbsPostQueryParams => ({
  viewFlag: 'a',
  postStatus: 'y',
  postId: '',
  postYear: '2025',
  postIssue: '',
  postContent: '',
  forumId: '',
  userId: '',
  enableAnonymous: 'y',
  postGameRef: '',
  postGametypeRef: '', // 默认是新加坡六合彩
  hasAttachment: 'n',
  isHot: 'n',
  isSelected: 'n',
  isTop: 'n',
  isRecommended: 'n',
  isVote: 'y',
  isBloom: 'n',
  title: '',
  attachments: [],
  predictionMode: '',
  predictionModeInit: '',
  predictions: []
})
const queryForm = reactive<ICreateBbsPostQueryParams>(initQueryForm())
const initialForm = reactive<ICreateBbsPostQueryParams>(initQueryForm())
const currentPostId = ref<string | null>(null)
const currentFormId = ref<string | null>(null)
const GameIssueList = ref<GameIssueItem[]>([])
const isSumitFormLoading = ref(false)
const isLoading = ref(false)
const activeTab = ref('addbbs')
const gamePage = ref(false)
const participationFlag = ref(false)
const chooseLastFlag = ref(false)
const lastPostList = ref<any[]>([])
const showLastContent = computed(() => {
  return !currentPostId.value
})
const ableToParticipate = computed(() => {
  return queryForm.forumId === 'userPublic' || queryForm.forumId === 'lottery'
})
// Local Storage key
const LAST_POST_KEY = 'last_bbs_post_content'
// 竞猜推荐论坛
const isBBSForLottery = computed(
  () => routes.path.includes('/bbsPostContentList/lottery') || queryForm.forumId === 'lottery'
)

// if(isBBSForLottery){
//   queryForm.title = queryForm.
// }
const { loadLotteryContentByPredictionsStrategy } = usePostGameUtilLogic()
// Save form data to local storage
const saveToLocalStorage = (formData: ICreateBbsPostQueryParams) => {
  try {
    localStorage.setItem(
      LAST_POST_KEY,
      JSON.stringify({
        ...formData,
        timestamp: new Date().getTime()
      })
    )
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Get form data from local storage
const getLastIssuePostFromApi = async () => {
  try {
    const res = await lastIssuePost({
      forumId: queryForm.forumId!,
      postGametypeRef: queryForm.postGametypeRef!,
      page: 1,
      size: 100,
      // @ts-ignore
      userId: queryForm.userId
    })
    if (res.success) {
      return res.data.list as any[]
    }
    showErrorMessage(res)
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
  return null
}
const resetForm = () => {
  ;(ruleFormRef?.value as unknown as ExposeBBSPostForm)?.resetForm()
  gamePage.value = false
  queryForm.postContent = ''
  queryForm.attachments = []
  addDialogVisible.value = false
  activeTab.value = 'addbbs'
  currentPostId.value = ''
  currentFormId.value = ''
}
const closeDialog = () => {
  // 重置当前页面数据
  resetForm()
  emits('onClosed')
}

const fetchGameHistory = async (gameId: number, year: number) => {
  const res = await getGameIssuesList({ year, gameType: gameId })
  if (res.success) {
    GameIssueList.value = res?.data!.map((item) => {
      return {
        label: item,
        value: item
      }
    })
    return true
  }
  showErrorMessage(res)
  return false
}
// wait for refactoring
const loadIssueOptions = async (gameType: string, year: string) => {
  let list = []
  if (!gameType || !year) {
    list = []
    return
  }
  try {
    const response = await getIssueListByParams({ gameType, year })

    if (!response?.success) {
      list = []
      showErrorMessage(response)
      return
    }

    list =
      response?.data?.map((item: string) => ({
        value: item,
        label: item
      })) || []
  } catch (error) {
    console.error('Failed to fetch issue options:', error)
    list = []
  }
  return list
}
async function loadIssueValue(params: { gameType: string; year: string }, withValue = true) {
  const gameIssueList = (await loadIssueOptions(params.gameType, params.year)) as Array<{
    value: string
    label: string
  }>
  if (!gameIssueList?.length) return
  if (!withValue) return
  queryForm.postIssue = gameIssueList[0]?.value || ''
}
const fetchData = async (postId: string, forumId: string) => {
  isLoading.value = true
  try {
    if (postId) {
      const res = await getPostDetail({ postId })
      if (res.success) {
        queryForm.postGametypeRef = res?.data!.postGametypeRef
        queryForm.enableAnonymous = res?.data?.enableAnonymous
        queryForm.forumId = forumId || res?.data?.forumId
        // isTop  isSelected  isHot  isBloom  isRecommended 拷贝 不需要这几个值，需要默认 false
        queryForm.isVote = res?.data?.isVote
        queryForm.postStatus = res?.data?.postStatus
        queryForm.userId = res?.data?.postUserId
        queryForm.title = isBBSForLottery.value ? queryForm.title : res?.data?.title
        queryForm.viewFlag = res?.data?.viewFlag
        queryForm.predictionMode = res?.data?.postPredictions?.code
        queryForm.postContent = res?.data?.postContent
        queryForm.attachments = res?.data?.attachments ?? []
        queryForm.predictions = res?.data?.postPredictions?.predictionDTOList || []
        participationFlag.value = !!res?.data?.postPredictions
        loadIssueValue({
          gameType: queryForm.postGametypeRef!,
          year: queryForm.postYear!
        })
      } else {
        showErrorMessage(res)
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    await nextTick()
    isLoading.value = false
  }
}
const formatPredictions = (predictions: PredictionInfo[]) => {
  return predictions.map((p) => {
    // @ts-ignore
    const code = p.playTypeCode ?? p.code
    return {
      ...p,
      code,
      playTypeCode: code
    }
  })
}

const submitForm = async (_: FormInstance | undefined) => {
  console.log('submitForm', queryForm)
  // @ts-ignore
  const { valid, fields } = await ruleFormRef.value!.validateForm()
  if (valid) {
    if (!participationFlag.value) {
      if (queryForm.forumId === 'lottery') {
        ElMessage({
          message: '请先完成参赛',
          type: 'warning'
        })
        return
      }
      // resetParticipation()
    }
    try {
      isSumitFormLoading.value = true
      const query: ICreateBbsPostQueryParams = {
        ...queryForm,
        postUserId: queryForm.userId
      }
      if (isBBSForLottery.value) {
        query.predictions = formatPredictions(queryForm.predictions as PredictionInfo[])
        const dicRes = await getPostPredictionRules({
          gameType: queryForm.postGametypeRef!,
          forumId: queryForm.forumId!
        })
        if (dicRes.success) {
          const dicList = dicRes.data![0].playRules
          if (dicList && query.predictions && query.predictions.length > 0) {
            query.predictions = query.predictions?.map((item, index) => {
              const dic = dicList[index]
              return {
                ...item,
                // @ts-ignore
                code: dic?.code,
                name: dic?.name,
                // @ts-ignore
                playTypeCode: dic?.code
              }
            })
          }
        }
      }
      const res = await createBbsPost(query)
      if (res.success) {
        // Save to localStorage after successful submission
        saveToLocalStorage(queryForm)
        ElMessage({
          message: '新增成功',
          type: 'success'
        })
        // 关闭dailog
        resetForm()
        addDialogVisible.value = false
      } else {
        ElMessage({
          message: '新增失败,请稍后再试试',
          type: 'error'
        })
      }
    } catch (error) {
      ElMessage({
        message: '提交出错',
        type: 'error'
      })
    } finally {
      isSumitFormLoading.value = false
    }
  } else {
    ElMessage({
      message: '信息不完整,请填写完善后提交',
      type: 'warning'
    })
    console.info('error submit!', fields)
  }
}
const loadLastPostDetail = async (lastPost: any) => {
  let resOfDetail: any
  try {
    resOfDetail = await getPostDetail({ postId: lastPost.postId })
  } catch (error) {
    console.error(error)
  }
  if (!resOfDetail?.success) {
    ElMessage({
      message: '获取帖子详情失败',
      type: 'error'
    })
  }
  return resOfDetail?.data
}

const handleLoadLastPost = async (lastPost: any) => {
  queryForm.enableAnonymous = lastPost.enableAnonymous
  queryForm.forumId = lastPost.forumId
  // 去掉置顶: 精选: 热门: 爆款: 推荐: 的值， 不要带过来
  queryForm.isVote = lastPost.isVote
  // queryForm.postGameRef = lastPost.postGameRef
  // queryForm.postIssue = lastPost.postIssue
  // queryForm.postStatus = lastPost.postStatus
  queryForm.userId = lastPost.postUserId
  // queryForm.postYear = lastPost.postYear
  queryForm.title = isBBSForLottery.value ? queryForm.title : lastPost.title
  queryForm.viewFlag = lastPost.viewFlag
  queryForm.postContent = lastPost.postContent
  queryForm.attachments = lastPost.attachmentDTOS.map((attachment: any) => {
    return {
      ...attachment
    }
  })
  const resOfDetail = await loadLastPostDetail(lastPost)
  queryForm.predictionMode = resOfDetail?.postPredictions?.code
  queryForm.predictions = resOfDetail?.postPredictions?.predictionDTOList || []
  participationFlag.value = !!resOfDetail?.postPredictions
  chooseLastFlag.value = false
}
const autoSetContent = async () => {
  if (!queryForm.postGametypeRef) {
    ElMessage({
      message: '请先指定彩种',
      type: 'warning'
    })
    return
  }
  try {
    lastPostList.value = (await getLastIssuePostFromApi()) as any[]
    if (lastPostList.value.length === 0) {
      ElMessage({
        message: '没有找到上一期内容',
        type: 'warning'
      })
      return
    }
    if (lastPostList.value.length === 1) {
      const lastPost = lastPostList.value[0]
      handleLoadLastPost(lastPost)

      // Fetch game history for the loaded game type and year
      await fetchGameHistory(Number(queryForm.postGametypeRef), Number(queryForm.postYear))

      ElMessage({
        message: '已加载上一期内容',
        type: 'success'
      })
    } else {
      ElMessage({
        message: '找到多个上一期内容,请手动选择',
        type: 'warning'
      })
      chooseLastFlag.value = true
    }
  } catch (error) {
    console.error('Error loading previous content:', error)
    ElMessage({
      message: '加载上一期内容失败',
      type: 'error'
    })
  } finally {
  }
}

const toGamePage = () => {
  gamePage.value = true
}
const viewGamePage = () => {
  toGamePage()
}
const resetParticipation = () => {
  queryForm.predictionMode = queryForm.predictionModeInit
  participationFlag.value = false
  if (isBBSForLottery.value) {
    queryForm.postContent = ''
  }
  queryForm.predictions = []
}
const participationCancle = () => {
  ElMessageBox.confirm('是否确认取消参赛?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    async () => {
      resetParticipation()
    },
    () => {
      // do nothing if cancel
    }
  )
}

// 清除postIssue 重新获取期数
watch(
  () => [queryForm.postGametypeRef, queryForm.postYear, queryForm.forumId, queryForm.postIssue],
  (newVal) => {
    if (isBBSForLottery.value) {
      // Extract the issue number and format it as requested
      const issueNumber = newVal[3]
      const formattedIssue = issueNumber && issueNumber.length > 3 ? issueNumber.slice(-3) : issueNumber
      queryForm.title = formattedIssue ? `第${formattedIssue}期推荐` : ''
    }

    if (isLoading.value) {
      return
    }

    if (!ableToParticipate.value) {
      resetParticipation()
    }

    fetchGameHistory(Number(newVal[0]), Number(newVal[1]))
  }
)
const reloadGame = async (_: string, __: string) => {
  if (ableToParticipate.value) {
    resetParticipation()
  }
}

defineExpose({
  openDialog: async (obj: { postId: string; forumId: string }) => {
    currentPostId.value = obj?.postId
    currentFormId.value = obj?.forumId
    queryForm.forumId = obj?.forumId
    //  open exist data
    addDialogVisible.value = true
    if (obj) {
      await fetchData(obj.postId, obj.forumId)
    }
    // create new data
  }
})

const cancel = async () => {
  console.log('cancel out gamePage')
  gamePage.value = false
}

const gameOn = async (state: any) => {
  console.log('gameOn', state.predictions)

  participationFlag.value = true
  gamePage.value = false
  queryForm.predictionMode = state.predictionMode
  queryForm.predictions = state.predictions
  queryForm.postContent = await loadLotteryContentByPredictionsStrategy(
    queryForm.predictions!,
    queryForm.forumId!,
    queryForm.postContent!
  )
}
onMounted(async () => {
  const result = await fetchGameHistory(Number(queryForm.postGametypeRef), Number(queryForm.postYear))
  if (!result) {
    console.error('Error fetching game history')
    return
  }
  await nextTick()
  Object.assign(initialForm, queryForm)
})
</script>

<template>
  <el-dialog v-model="addDialogVisible" class="custom-tabs-dialog" destroy-on-close @close="closeDialog">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="帖子信息" name="addbbs" :disabled="activeTab !== 'addbbs'">
        <div v-if="gamePage" style="display: flex; flex-direction: column; height: 100%; overflow: hidden">
          <LotteryRootGamePage v-if="isBBSForLottery" :queryForm="queryForm" @cancel="cancel" @gameOn="gameOn" />
          <GamePage v-else :queryForm="queryForm" @cancel="cancel" @gameOn="gameOn" />
        </div>
        <div v-show="!gamePage && !chooseLastFlag" style="display: flex; flex-direction: column; height: 100%">
          <el-row style="display: flex; flex-direction: row; margin: 10px 0">
            <el-col :span="13" style="flex: 1; padding: 0 0 0 10px; position: relative">
              <BBSPostForm
                :queryForm="queryForm"
                :initial-form="initialForm"
                ref="ruleFormRef"
                v-loading="isLoading"
                @autoSetContent="autoSetContent"
                style="flex: 1"
                :showLastContent="showLastContent"
                @reloadGame="reloadGame"
              />
              <div class="competition-btn">
                <el-button
                  v-if="!participationFlag"
                  type="primary"
                  :icon="Trophy"
                  color="#FE646F"
                  style="color: white"
                  @click="toGamePage()"
                  :disabled="!ableToParticipate"
                >
                  我要参赛
                </el-button>
                <div v-else style="display: flex; justify-content: space-around; align-items: center; cursor: pointer">
                  <el-button type="primary" :icon="Trophy" color="#67C23A" style="color: white" @click="viewGamePage()">
                    参赛信息
                  </el-button>
                  <el-icon style="color: #fe646f; font-size: 20px" @click="participationCancle()">
                    <CircleClose />
                  </el-icon>

                  <!-- <el-button :icon="Close" @click="participationCancle()">取消参赛</el-button> -->
                </div>
              </div>
            </el-col>
            <el-col :span="12" style="display: flex; flex-direction: row; justify-content: center">
              <PhoneFrame>
                <template #mainBody>
                  <LotteryGameContent v-if="isBBSForLottery" :queryForm="queryForm" />
                  <PostEditor v-else :queryForm="queryForm" ref="postEditorRef" />
                </template>
              </PhoneFrame>
            </el-col>
          </el-row>
          <AttachmentManage :queryForm="queryForm" v-if="!isBBSForLottery" />
        </div>

        <div v-if="chooseLastFlag">
          <ChooseLastPost :postList="lastPostList" @select-post="handleLoadLastPost" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="submit-wrapper-post" v-if="activeTab === 'addbbs'">
      <div v-if="!gamePage && chooseLastFlag">
        <el-button @click="() => (chooseLastFlag = false)">返回</el-button>
      </div>
      <div class="btn" v-else-if="!gamePage">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="isSumitFormLoading" @click="submitForm(ruleFormRef)">提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="less">
.submit-wrapper-post {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

//  custom-tabs-dialog
.custom-tabs-dialog {
  margin-top: 80px;
  padding: 10px;
  height: calc(100vh - 8.5rem);
  width: 78%;
  position: relative;
  border-radius: 0.6rem;
}

.custom-tabs-dialog .el-dialog__header {
  padding: 0;
  position: absolute;
  right: -15px;
  top: -15px;
  z-index: 1;
  border-radius: 100%;
  background: #e4e7ed;
  height: 40px;
  width: 40px;
}

.custom-tabs-dialog .el-dialog__header .el-dialog__headerbtn {
  height: 40px;
  width: 40px;
  line-height: 1;
}

.custom-tabs-dialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
  color: red;
}

.custom-tabs-dialog .el-dialog__body {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.custom-tabs-dialog .el-dialog__body .el-tabs {
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
}

.custom-tabs-dialog .el-dialog__body .el-tabs .el-tabs__content {
  flex: 1;
  overflow-y: auto;
}
.el-tab-pane {
  height: 100%;
}

.competition-btn {
  position: absolute;
  top: 0;
  right: 10px;
}
</style>
