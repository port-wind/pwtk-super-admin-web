<template>
  <div id="system_account">
    <el-form :model="editForm" ref="editFormRef" :rules="issueFormRules" style="display: flex" class="dialog-form">
      <div style="flex: 0.4">
        <el-form-item label="图解标题:" prop="name">
          {{ editForm.name }}
        </el-form-item>
        <el-form-item prop="postUserId" label="模拟用户:">
          {{ explainInfo.loginId }} - {{ explainInfo.nickname }}
        </el-form-item>

        <el-form-item prop="postContent" label="内容:">
          <div
            v-html="editForm.postContent"
            style="
              overflow-y: auto;
              padding: 10px;
              border: 1px solid #dcdfe6;
              border-radius: 10px;
              width: 80%;
              height: 130px;
            "
          ></div>
        </el-form-item>

        <el-form-item label="状态:">
          <el-radio-group v-model="editForm.status">
            <el-radio value="y">启用</el-radio>
            <el-radio value="n">删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="postTime" label="发布时间:">
          {{ unitFormatDate(explainInfo.postTime, 'yyyy-MM-dd HH:mm:ss') }}
        </el-form-item>
      </div>
      <div style="flex: 0.3" class="image-upload-wrapper">
        <el-form-item label="评论:" prop="commentFlag">
          <el-radio-group v-model="editForm.commentFlag">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="推荐:">
          <el-radio-group v-model="editForm.isRecommended">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="热门:">
          <el-radio-group v-model="editForm.isHot">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="置顶:">
          <el-radio-group v-model="editForm.isTop">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="精选:">
          <el-radio-group v-model="editForm.isSelected">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="爆款:">
          <el-radio-group v-model="editForm.isBloom">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div
        style="
          flex: 0.3;
          overflow: hidden;
          margin: 20px;
          border: 1px solid #dcdfe6;
          border-radius: 10px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        "
      >
        <el-image :src="imgPath" fit="scale-down" style="height: 100%" />
      </div>
    </el-form>
    <div class="button-row">
      <el-button @click="resetForm">取消</el-button>
      <el-button type="primary" :loading="isLoading" @click="handleSave">提交</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { replyIssuePost, getExplainDetailByPostId, updateGraphicSolution } from '@/api/photoSys/issues'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
const { VITE_CDN_URL } = webConfigApi
const imgPath = ref('')
const props = defineProps({
  explainInfo: {
    type: Object,
    required: true
  }
})
const issueInfo = computed(() => {
  return props.explainInfo.issueDTO || {}
})
const emit = defineEmits(['returnTo'])
const isLoading = ref(false)
const initEditForm = () => ({
  issue: 10,
  seriesCode: '',
  newspaperCode: '',
  gameType: '',
  imgPath: '',
  isColorful: 'y',
  isTop: 'n',
  isSelected: 'n',
  isHot: 'n',
  isBloom: 'n',
  isRecommended: 'n',
  commentFlag: 'y',
  voteFlag: 'y',
  isAllAnnotateContent: 'y',
  annotateContent: '',
  status: 'y',
  createTime: 0,
  seriesName: '',
  newspaperName: '',
  name: `第${issueInfo.value.issue?.toString()}期 ${issueInfo.value?.name} 图解`,
  readCount: 0,
  postUserId: '',
  postContent: ''
})
const editForm = reactive(initEditForm())
const editFormRef = ref()
const issueFormRules = reactive({})
const resetForm = () => {
  //   issueDialogVisible.value = false
  Object.assign(editForm, initEditForm())
  if (editFormRef.value) {
    editFormRef.value.clearValidate()
  }
  emit('returnTo')
}
const handleSave = async () => {
  let res
  try {
    let isValid = false
    await editFormRef.value.validate(async (valid, fields) => {
      isValid = valid
      if (valid) {
        console.log(editForm)
        const req = {
          ...editForm
        }
        try {
          res = await updateGraphicSolution(req)
        } catch (error) {
          console.error('Error saving data:', error)
        }
      } else {
        console.log('error submit!', fields)
      }
    })
    if (!isValid) {
      return
    }

    // if (isEditMode.value) {
    //   res = await update(editForm)
    // } else {
    //   res = await create({ ...editForm })
    // }

    if (checkSuccess(res)) {
      ElMessage.success('保存成功')
      resetForm()
      //   issueDialogVisible.value = false
      //   currentPage.value = 1
      //   fetchData()
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const checkSuccess = (res) => {
  return !!res?.success
}
const getDetail = async () => {
  try {
    const response = await getExplainDetailByPostId({ postId: props.explainInfo.postId })
    if (response.success) {
      Object.assign(editForm, props.explainInfo)
      imgPath.value = VITE_CDN_URL + issueInfo.value.imgPath
      // if (editForm.imgPath) {
      //   const parts = editForm.imgPath.split('/')
      //   const lastPart = parts[parts.length - 1]
      // }
      // fileList.value = [editForm.imgPath]
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
  }
}

onMounted(async () => {
  await getDetail()
})
</script>
