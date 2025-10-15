<template>
  <div id="system_account">
    <el-form :model="editForm" ref="editFormRef" :rules="issueFormRules" style="display: flex" class="dialog-form">
      <div style="flex: 0.3">
        <el-form-item label="图解标题:" prop="name">
          {{ editForm.name }}
        </el-form-item>
        <el-form-item prop="postUserId" label="模拟用户:">
          <UniRemoteInput
            v-model="editForm.postUserId"
            :search-obj="{}"
            valueKey="userId"
            labelKey="loginId"
            searchKey="userId"
            placeholder="用户ID"
            event-focus="focus"
            :fetchOptions="reqUserListByUserId"
            style="width: 240px"
            :formatLabel="(item) => (item.loginId ? `${item.loginId} - ${item.userId}` : item.userId)"
          />
        </el-form-item>

        <el-form-item prop="postContent" label="内容:">
          <div class="text-editor-wrapper">
            <TextEditor v-if="editForm" placeholder="请输入正文..." v-model="editForm.postContent" mode="simple" />
          </div>
        </el-form-item>
      </div>
      <div style="flex: 0.4" class="image-upload-wrapper">
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
        <el-image :src="VITE_CDN_URL + issueInfo.imgPath" fit="scale-down" style="height: 100%" />
      </div>
    </el-form>
    <div class="button-row">
      <el-button @click="resetForm">取消</el-button>
      <el-button type="primary" :loading="isLoading" @click="handleSave">提交</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getDetailById, replyIssuePost } from '@/api/photoSys/issues'
import showErrorMessage from '@/utils/showErrorMessage'
import { reqUserListByUserId } from '@/api/user/index'
import { decodeHtmlEntities } from '@/utils/dataFormat'
const { VITE_CDN_URL } = webConfigApi

let edit = ref()
const props = defineProps({
  issueInfo: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['returnToChooseIssue'])
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
  name: `第${props.issueInfo.issue}期 ${props.issueInfo.newspaperName} 图解`,
  readCount: 0,
  postUserId: '',
  postContent: ''
})
const editForm = reactive(initEditForm())
const editFormRef = ref()
const issueFormRules = reactive({
  seriesCode: [{ required: true, message: '请选择图纸系列', trigger: 'blur' }],
  name: [{ required: true, message: '请输入图纸名称', trigger: 'blur' }],
  postUserId: [{ required: true, message: '请输入模拟用户', trigger: 'blur' }],
  newspaperCode: [{ required: true, message: '请选择报纸', trigger: 'blur' }],
  postContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  hostDomain: [{ required: true, message: '请输入域名', trigger: 'blur' }],
  navOutStyle: [{ required: true, message: '请选择导航方式' }]
})
const resetForm = () => {
  //   issueDialogVisible.value = false
  Object.assign(editForm, initEditForm())
  if (editFormRef.value) {
    editFormRef.value.clearValidate()
  }
  emit('returnToChooseIssue')
}
const handleSave = async () => {
  let res
  try {
    let isValid = false
    const htmlContent = edit.value.txt.html()
    const postContent = decodeHtmlEntities(htmlContent)
    editForm.postContent = edit.value.txt.html() || editForm.postContent
    await editFormRef.value.validate(async (valid, fields) => {
      isValid = valid
      if (valid) {
        console.log(editForm)
        console.log(postContent)

        const req = {
          ...editForm,
          issueId: props.issueInfo.issueId,
          postContent,
          postType: 'a',
          gameType: props.issueInfo.gameType
        }
        try {
          res = await replyIssuePost(req)
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
const getDetail = async (id) => {
  try {
    const response = await getDetailById({ issueId: id })
    if (response.success) {
      const { data } = response
      Object.assign(editForm, data)

      if (editForm.imgPath) {
        const parts = editForm.imgPath.split('/')
        const lastPart = parts[parts.length - 1]
      }
      // fileList.value = [editForm.imgPath]
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
  }
}
</script>
<style lang="less" scoped>
:deep(.w-e-text-container) {
  height: 250px !important;
  width: 100% !important;
  // overflow-y: auto !important;
}
.text-editor-wrapper {
  height: 500px;
}
</style>
