<script setup lang="ts">
import { attachmentOptionsForAdd } from '@/views/Bbs/bbsPostContentManagement/data'
import { reqHttp as reqAttachmentHttp } from '@/api/bss/attachmentManagement/index'
// import i18n from '@/locales'
import { truncateText } from '@/utils/dataFormat'
import { computed } from 'vue'
import { ElMessageBox } from 'element-plus'
// const { t } = i18n.global as any
const props = defineProps({
  queryForm: {
    type: Object,
    required: true
  }
})
const attachmentData = computed(() => props.queryForm.attachments || [])
const { VITE_CDN_URL } = webConfigApi
//附件页码
// const attachmentCurrentPage = ref(1)
// const attachmentPageSize = ref(15)
// const attachmentTotal = ref(0)
const isLoading = ref(false)
//附件初始化获取数据
// const fetchAttachmentData = async () => {
//   let params = {
//     page: attachmentCurrentPage.value,
//     size: attachmentPageSize.value,
//     forumPostId: props.queryForm.postId
//   }
//   isLoading.value = true
//   try {
//     const response = await reqAttachmentHttp(params)
//     if (response.success) {
//       props.queryForm.attachments = response.data.list
//       attachmentTotal.value = Number(response.data.total)
//     } else {
//       props.queryForm.attachments = []
//       attachmentTotal.value = 0
//       showErrorMessage(response)
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error)
//   } finally {
//     isLoading.value = false
//   }
// }
//附件删除
const handleAttachmentDel = (scope: any) => {
  ElMessageBox.confirm('当您点击确定按钮后, 这些资源将会被彻底删除, 如果其包含子资源, 也将一并删除', '警告', {
    confirmButtonText: '確定',
    cancelButtonClass: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      props.queryForm.attachments = attachmentData.value.filter(
        (item) => item.attachmentUrl !== scope.row.attachmentUrl
      )
    } catch (error) {
      console.error('Error saving data:', error)
    }
  })
}
// //分页的每一页数据变化
// const handleSizeChange = (val: number) => {
//   attachmentCurrentPage.value = Math.ceil(((attachmentCurrentPage.value - 1) * attachmentPageSize.value + 1) / val)
//   attachmentPageSize.value = val
//   fetchAttachmentData()
// }
// //分页页数改变
// const handleCurrentChange = (val: number) => {
//   attachmentCurrentPage.value = val
//   fetchAttachmentData()
// }
</script>

<template>
  <div style="display: flex; flex-direction: column; flex: 1">
    <m-table :options="attachmentOptionsForAdd" :data="attachmentData" :isLoading="isLoading" isEditRow stripe>
      <template #fileName="{ scope }">
        <!-- {{ truncateText(scope.row.fileName, 10) }} -->
        <el-image
          v-if="scope.row.attachmentUrl"
          style="width: 48px; height: 48px; object-fit: contain"
          :src="VITE_CDN_URL + scope.row.attachmentUrl"
          fit="cover"
        ></el-image>
      </template>
      <template #prefixPostfixFlag="{ scope }">
        <span style="margin-right: 10px">
          {{ scope.row.prefixPostfixFlag === 'h' ? '在前面' : '在后面' }}
        </span>
        <el-switch
          v-model="scope.row.prefixPostfixFlag"
          :active-value="'h'"
          :inactive-value="'t'"
          :before-change="
            () =>
              !!(scope.row.prefixPostfixFlag === 'h'
                ? (scope.row.prefixPostfixFlag = 't')
                : (scope.row.prefixPostfixFlag = 'h'))
          "
          class="custom-switch-prefix-postfix"
        ></el-switch>
      </template>
      <template #attachmentStatus="{ scope }">
        <span style="margin-right: 10px">
          {{ scope.row.attachmentStatus === 'y' ? '启用' : '关闭' }}
        </span>
        <el-switch
          v-model="scope.row.attachmentStatus"
          :active-value="'y'"
          :inactive-value="'n'"
          :before-change="
            () =>
              !!(scope.row.attachmentStatus === 'y'
                ? (scope.row.attachmentStatus = 'n')
                : (scope.row.attachmentStatus = 'y'))
          "
        ></el-switch>
      </template>
      <template #isView="{ scope }">
        <span style="margin-right: 10px">
          {{ scope.row.isView === 'y' ? '是' : '否' }}
        </span>
        <el-switch
          v-model="scope.row.isView"
          :active-value="'y'"
          :inactive-value="'n'"
          :before-change="() => !!(scope.row.isView === 'y' ? (scope.row.isView = 'n') : (scope.row.isView = 'y'))"
        ></el-switch>
      </template>
      <template #operate="{ scope }">
        <el-button size="small" type="danger" plain @click="handleAttachmentDel(scope)">删除</el-button>
      </template>
    </m-table>
  </div>
</template>
<style lang="css" scoped>
:deep(.custom-switch-prefix-postfix) {
  --el-switch-on-color: #4eb1f3 !important;
  --el-switch-off-color: #4eb1f3 !important;
}
</style>
