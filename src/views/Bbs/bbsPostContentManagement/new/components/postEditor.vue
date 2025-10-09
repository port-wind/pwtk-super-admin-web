<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { changeUploadDataWithCustom } from '@/utils/dataFormat'
import mUpload from '@/components/mUpload/index.vue'
import type { fileUploadOption } from '@/api/system/upload/types'
import { useRoute } from 'vue-router'
const props = defineProps<{
  queryForm: any
}>()
const routes = useRoute()
const isViewMode = ref(false)
// 竞猜推荐论坛
const isBBSForLottery = computed(() => routes.path.includes('/bbsPostContentList/lottery'))

const attachmentData = computed(() => props.queryForm.attachments || [])
const handledAttachments = computed(() => {
  return attachmentData.value.map((item: any) => {
    return {
      url: item.attachmentUrl,
      fileType: item.attachmentType
    }
  })
})
const uploadDataHead = ref({
  fileType: 'img',
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
} as fileUploadOption)

// Limit number of attachments in this example
const attachmentTotal = computed(() => handledAttachments.value.length)

function editPostContent(mode: string) {
  // If switching to rich text, you could set editor content here
  isViewMode.value = false
}

function closeEditorDialog() {
  isViewMode.value = true
}

function beforeUpload(val: any) {
  const result = changeUploadDataWithCustom(val.type, '')
  uploadDataHead.value = result.uploadData as fileUploadOption
}
function handleExceed(val: any) {
  ElMessage.warning(`只可以上传 ${val.files.length} 个文件`)
}

async function handleSuccessOfAttachment(val: any, prefixPostfixFlag: string) {
  if (attachmentTotal.value >= 9) {
    ElMessage.warning('附件数量已达上限')
    return
  }
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, '')
  const attachmentUrl = val.response.path
  const params = {
    attachmentUrl,
    forumPostId: props.queryForm.postId,
    isView: 'y',
    attachmentStatus: 'y',
    attachmentType: result.fileType,
    fileName: val.file?.name,
    prefixPostfixFlag
  }
  props.queryForm.attachments.push(params)
  ElMessage.success('添加附件成功')
}
</script>

<template>
  <div class="dialog_tabs_form-warp">
    <el-form :model="queryForm" width="100%" label-width="auto">
      <el-form-item label="帖子标题:" style="margin-bottom: 5px">
        <el-input v-model="queryForm.title" :disabled="isViewMode" />
      </el-form-item>
      <el-form-item style="margin-bottom: 7px">
        <section>
          <span style="margin-right: 10px">帖子内容</span>
          <div v-show="isViewMode && !isBBSForLottery" style="display: inline-block">
            <el-button size="small" round @click="editPostContent('rich')">编辑</el-button>
          </div>
        </section>
        <section style="width: 100%">
          <div v-show="isViewMode" class="post-content-text resizable-content">
            <div v-html="queryForm?.postContent || null"></div>
          </div>
          <div v-if="!isViewMode">
            <div>
              <TextEditor
                placeholder="请输入正文..."
                v-model="queryForm.postContent"
                mode="simple"
                style="height: 350px"
              />
            </div>
          </div>
        </section>
      </el-form-item>
    </el-form>

    <MediaPreview v-if="!isViewMode" :attachments="handledAttachments" class="post-media-preview" />

    <div class="button-row" v-show="!isViewMode" style="justify-content: space-between">
      <div style="display: flex; justify-content: space-between">
        <mUpload
          class="custom-upload"
          :useDefault="true"
          :uploadOption="uploadDataHead"
          mute
          :before-upload="beforeUpload"
          @on-success="(val) => handleSuccessOfAttachment(val, 'h')"
          @on-exceed="handleExceed"
          style="margin-right: 10px"
        >
          <template #uploadArea>
            <el-button color="#409EFF" size="small" plain>
              <el-icon><Upload /></el-icon>
              上传附件
            </el-button>
          </template>
        </mUpload>
      </div>

      <div style="display: flex; justify-content: space-between">
        <el-button size="small" type="default" @click="closeEditorDialog">预览</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.post-content-text {
  height: 350px;
  border: 1px solid #999;
  padding: 0 10px;
  margin-top: 5px;
  overflow: auto;
}
.resizable-content {
  width: 100%;
  overflow: auto;
  resize: vertical;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
