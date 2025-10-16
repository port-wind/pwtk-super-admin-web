<template>
  <section id="system_account" class="main_container">
    <section ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left" label-width="70px">
        <!-- <el-form-item prop="manageSiteId">
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item> -->
        <el-form-item label="" prop="attachmentId">
          <AutoComplete
            v-model="queryForm.attachmentId"
            :httpFunc="reqHttp"
            keyword="attachmentId"
            :displayFields="['attachmentId']"
            :trigger-on-focus="true"
            placeholder="附件ID"
            isPage
            isList
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="附件类型" prop="attachmentType">
          <el-select v-model="queryForm.attachmentType" placeholder="类型">
            <el-option label="全部" value="L" />
            <el-option
              v-for="item in optionsAttachmentType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="附件状态" prop="attachmentStatus">
          <el-select v-model="queryForm.attachmentStatus" placeholder="状态">
            <el-option label="全部" value="L" />
            <el-option label="启用" value="y" />
            <el-option label="关闭" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可见" prop="isView">
          <el-select v-model="queryForm.isView" placeholder="是否可见">
            <el-option label="全部" value="L" />
            <el-option label="是" value="y" />
            <el-option label="否" value="n" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="fetchData({ page: 1, size: pageSize })" :loading="isLoading">
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
          <!-- <el-button
            v-if="isShowCheckboxTable"
            type="success"
            plain
            @click="() => handleSpecialClick('bbsForumAttachment')"
          >
            <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
            同步
          </el-button> -->
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #postName="{ scope }">
          <p class="like-a overflow-hidden" @click="handlePostEdit(scope.row)">
            {{ scope.row.postName }}
          </p>
        </template>
        <template #forumName="{ scope }">
          <p class="like-a overflow-hidden" @click="handleForumEdit(scope.row)">
            {{ scope.row.forumName }}
          </p>
        </template>
        <template #tags="{ scope }">
          <span v-for="item in optionsAttachmentType">
            <span v-if="item.value == scope.row.attachmentType">{{ item.label }}</span>
          </span>
          |
          <span v-if="scope.row.attachmentStatus == 'y'">启用</span>
          <span v-else>关闭</span>
          |
          <span v-if="scope.row.isView == 'y'">是</span>
          <span v-else>否</span>
          |
          <span v-if="scope.row.prefixPostfixFlag == 'h'">在前面</span>
          <span v-else>在后面</span>
        </template>
        <template #attachmentPath="{ scope }">
          <p class="attachment-ellipsis overflow-hidden">
            {{ VITE_CDN_URL + scope.row.attachmentUrl }}
          </p>
        </template>
        <template #time="{ scope }">
          {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #attachmentUrl="{ scope }">
          <linkWithCopy
            :row-data="scope.row"
            :config="{ idKey: 'fullAttachmentUrl' }"
            @action="handleAttachmentUrl"
            :limit-func="limitToFirstAndLastDigits"
          />
        </template>
      </m-table>
    </section>
  </section>
  <modalPostSeries v-if="modalsStore.postSeriesModal.isVisible" @refreshPage="fetchData" />
  <modalForumSeries @refreshPage="fetchData" />
  <checkbox-table v-if="modalsStore?.checkboxTable?.isVisible" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAttachmentApi } from '@/api/bss/attachmentManagement/index'
import type { TableData, GetRequest } from '@/api/bss/attachmentManagement/types'
import { TableOptions } from '@/components/mTable/types'

import AutoComplete from '@/components/AutoComplete/index.vue'

import { optionsAttachmentType } from '@/const/options'

import { unitFormatDate } from '@/utils/dateFormat'
import { limitToFirstAndLastDigits } from '@/utils/dateFormat'

const { VITE_CDN_URL } = webConfigApi

const tableRef = ref(null)
const queryRef = ref()

import i18n from '@/i18n'
const { t } = i18n.global as any

//弹窗
import modalPostSeries from '@/components/modalCommon/postSeriesModal/index.vue'
import modalForumSeries from '@/components/modalCommon/forumSeriesModal/index.vue'
import { useModalsStore } from '@/stores/modalStore'
import { useDeployConfig } from '@/components/checkboxTable/util'
const { isShowCheckboxTable, handleSpecialClick } = useDeployConfig()

const modalsStore = useModalsStore()

const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//窗口
const postDialogVisible = ref(false)
const postId = ref()
const forumDialogVisible = ref(false)
const forumId = ref()

const manageSiteId = computed(() => {
  return queryForm.value.manageSiteId
})

const { reqHttp } = useAttachmentApi(manageSiteId)

const initForm = {
  manageSiteId: '',
  sortName: 'create_time',
  sortOrder: 'DESC',
  attachmentId: '',
  attachmentType: 'L',
  attachmentStatus: 'L',
  isView: 'L',
  attachmentUrl: ''
}

const queryForm = ref(initForm)

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'attachmentId',
    label: '附件ID',
    columAttr: {
      minWidth: 190
    }
  },
  {
    prop: 'postName',
    label: '帖子',
    slot: 'postName',
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: 'forumName',
    label: '论坛',
    slot: 'forumName',
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    slot: 'time',
    columAttr: {
      minWidth: 170
    }
  },
  {
    prop: 'tags',
    label: '类型｜状态｜可见｜位置',
    slot: 'tags',
    columAttr: {
      minWidth: 180
    }
  },
  {
    prop: 'fullAttachmentUrl',
    label: '附件URL',
    showOmission: true,
    slot: 'attachmentUrl',
    columAttr: {
      minWidth: 200
    }
  }
]

//loading 按钮
const isLoading = ref(false)

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const handleAttachmentUrl = (row: any) => {
  window.open(row.fullAttachmentUrl, '_blank')
}

//页面初始化获取数据
const fetchData = async (_queryForm?: GetRequest) => {
  if (_queryForm?.page) {
    currentPage.value = _queryForm.page
  }
  let params = {
    page: currentPage.value,
    size: pageSize.value
  }
  params = queryForm.value ? { ...params, ...queryForm.value } : params
  isLoading.value = true
  try {
    const response = await reqHttp(params)
    if (response.success) {
      tableData.value = response.data.list.map((item: any) => ({
        ...item,
        fullAttachmentUrl: VITE_CDN_URL + item.attachmentUrl
      }))
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const handlePostEdit = (row: any) => {
  postId.value = row.forumPostId
  modalsStore.showModal('postSeriesModal')
  modalsStore.setActiveTab('postSeriesModal', 'first')
  modalsStore.setModalData('postSeriesModal', {
    postId: postId.value,
    manageSiteId: manageSiteId.value
  })
  postDialogVisible.value = true
}

const handleForumEdit = (row: any) => {
  forumId.value = row.forumId
  modalsStore.showModal('forumSeriesModal')
  modalsStore.setModalData('forumSeriesModal', {
    forumId: forumId.value,
    manageSiteId: manageSiteId.value
  })
  forumDialogVisible.value = true
}

const resetButton = () => {
  queryRef.value.resetFields()
  currentPage.value = 1
  fetchData()
}

//页面初始化加载
onMounted(fetchData)
</script>

<style scoped lang="less">
.attachment-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
