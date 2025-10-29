<template>
  <section id="system_account">
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="siteName">
          <AutoComplete
            v-model="queryForm.siteName"
            max-length="255"
            keyword="siteName"
            :httpFunc="reqInputHttp"
            :displayFields="['siteName', 'appId']"
            :trigger-on-focus="true"
            placeholder="新闻站点名称"
            @input="(val) => handleInput(val, queryForm)"
            @select="handleAppIdChange"
            @keyup.enter="fetchData"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="typeOne">
          <AutoComplete
            v-model="queryForm.typeOne"
            max-length="200"
            keyword="typeName"
            :httpFunc="reqListLevelOneTypeName"
            :displayFields="['typeName']"
            :displayName="'typeName'"
            :trigger-on-focus="true"
            @keyup.enter="fetchData"
            :searchObj="{ appId: queryForm.appId, siteName: queryForm.siteName, level: 1 }"
            placeholder="分类层级一"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="typeOne">
          <AutoComplete
            v-model="queryForm.typeTwo"
            max-length="200"
            keyword="typeName"
            :httpFunc="reqListLeveTwoTypeName"
            :displayFields="['typeName']"
            :displayName="'typeName'"
            :trigger-on-focus="true"
            @keyup.enter="fetchData"
            :searchObj="{ appId: queryForm.appId, siteName: queryForm.siteName, level: 2 }"
            placeholder="分类层级二"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="typeOne">
          <AutoComplete
            v-model="queryForm.typeThree"
            max-length="200"
            keyword="typeName"
            :httpFunc="reqListLevelThreeTypeName"
            :displayFields="['typeName']"
            :displayName="'typeName'"
            :trigger-on-focus="true"
            @keyup.enter="fetchData"
            :searchObj="{ appId: queryForm.appId, siteName: queryForm.siteName, level: 3 }"
            placeholder="分类层级三"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="title">
          <el-input v-model="queryForm.title" placeholder="标题" />
        </el-form-item>
        <!-- <ExpandableSection
          v-model="isExpanded"
          :resizeRef="tableRef"
        ></ExpandableSection> -->
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="fetchData" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleReset" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="account-table">
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(tableRef).toString()"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        border
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #articleId="{ scope }">
          <linkWithCopy
            :row-data="scope.row"
            :config="{ idKey: 'articleId' }"
            @action="handleClickArticleId"
            :limit-func="formateStrNum"
          />
        </template>
        <template #imagePath="{ scope }">
          <linkWithCopy
            :row-data="scope.row"
            :config="{ idKey: 'imagePath' }"
            @action="handleClickImagePath"
            :limit-func="limitToLast10Digits"
          />
        </template>
        <template #typeOne="{ scope }">
          <p>
            {{ scope.row.typeOne }}{{ scope.row.typeTwo ? ' | ' + scope.row.typeTwo : '' }}
            {{ scope.row.typeThree ? ' | ' + scope.row.typeThree : '' }}
          </p>
        </template>
        <template #appId="{ scope }">
          <p>{{ scope.row.siteName }} | {{ scope.row.appId }}</p>
        </template>
        <template #detailUrl="{ scope }">
          <linkWithCopy
            :row-data="scope.row"
            :config="{ idKey: 'detailUrl' }"
            @action="handleClickDetail"
            :limit-func="limitToLast10Digits"
          />
        </template>
      </m-table>
    </section>
  </section>

  <el-dialog
    v-model="imageDialogVisible"
    :width="dialogWidth"
    :before-close="handleCloseImageDialog"
    class="tabs-dialog"
  >
    <mTabPane label="缩略图">
      <el-scrollbar>
        <el-form style="padding: 10px">
          <el-form-item label="路径:">
            <linkWithCopy :row-data="{ imagePathRef }" :config="{ idKey: 'imagePathRef', notShowLink: true }" />
          </el-form-item>
          <el-form-item label="URL:">
            <linkWithCopy
              :row-data="{ imageUrlRef }"
              :config="{ idKey: 'imageUrlRef' }"
              @action="onSrcImageClick(imageUrlRef)"
            />
          </el-form-item>
          <el-form-item label="预览:"></el-form-item>
        </el-form>

        <div class="image-container" :style="containerStyle" v-loading="isImgLoading">
          <el-image
            :src="imageUrlRef"
            :alt="imagePathRef"
            style="cursor: zoom-in; height: 100%"
            fit="scale-down"
            @load="onImageLoad"
            @error="onImageError"
            :preview-src-list="[imageUrlRef]"
            :max-scale="7"
            :min-scale="1"
            ref="imageRef"
            :zoom-rate="1.2"
            preview-teleported
            class="el-image-show"
          />
          <!-- <el-image
        :src="imageUrlRef"
        :alt="imagePathRef"
        @load="onImageLoad"
        @error="onImageError"
        ref="imageRef"
        fit="scale-down"
        style="cursor: zoom-in; height: 100%"
        @click="onImageClick"
      /> -->
        </div>
      </el-scrollbar>
    </mTabPane>
  </el-dialog>
  <el-dialog v-model="articleDialogVisible" :width="'80%'" class="tabs-dialog">
    <el-tabs v-model="activeTab" class="article-tabs">
      <el-tab-pane label="内容" name="content" class="tab-pane">
        <div class="tab-content tab-content-view">
          <h2 style="text-align: center">{{ selectedArticle.title }}</h2>
          <div v-html="selectedArticle.content"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资源" name="images">
        <div v-if="selectedArticle.files?.length > 0" class="tab-content">
          <el-carousel type="card" height="450px" :autoplay="false" style="padding: 10px">
            <el-carousel-item
              v-for="(item, index) in selectedArticle.files"
              :key="index"
              class="three-d-div"
              style="background-color: #cfe3f7"
            >
              <div style="width: 100%; height: 100%; padding: 10px; position: relative">
                <a v-if="!!item.s3Url" :href="item.s3Url" class="image-link">
                  <el-icon style="font-size: 20px"><Download /></el-icon>
                </a>
                <el-image
                  v-if="item.fileType === 'i'"
                  :src="item.s3Url"
                  :alt="`Image ${index + 1}`"
                  style="width: 100%; height: 100%; cursor: zoom-in"
                  fit="scale-down"
                  :preview-src-list="[item.s3Url]"
                  :max-scale="7"
                  :min-scale="1"
                  :zoom-rate="1.2"
                  preview-teleported
                  class="el-image-show"
                >
                  <template #error>
                    <el-icon style="font-size: 50px"><Picture /></el-icon>
                  </template>
                </el-image>
                <VideoViewer v-else-if="item.fileType === 'v'" :videoSource="item.s3Url" />
                <el-image v-else class="el-image-show" fit="scale-down">
                  <template #error>
                    <el-icon style="font-size: 200px"><Files /></el-icon>
                  </template>
                </el-image>
              </div>

              <!-- <video :src="sampleVideo"></video> -->
            </el-carousel-item>
          </el-carousel>
        </div>
        <el-empty v-else description="暂无资源" :image-size="200" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SearchBtnOptions, SearchOption } from '@/components/mSearchForm/types'
import linkWithCopy from '@/components/linkWithCopy/index.vue'
import {
  reqHttp,
  reqInputHttp,
  reqlistLevelTypeName,
  reqContentPage,
  reqFilesList,
  reqListLevelOneTypeName,
  reqListLeveTwoTypeName,
  reqListLevelThreeTypeName
} from '@/api/newsSiteMgr/articleList'
import type { TableData, GetRequest } from '@/api/newsSiteMgr/articleList/types'
import { TableOptions } from '@/components/mTable/types'
import { limitToLast10Digits } from '@/utils/dateFormat'
import count from '@/utils/tableHeight'
import { createWholeUrl, formateStrNum } from '@/utils/dataFormat'
import ExpandableSection from '@/components/expandIcon/index.vue'
import VideoViewer from '@/components/videoViewer/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
// import SampleVideo from '@/assets/test-video.mp4'

//上传相关
const { VITE_CDN_URL } = webConfigApi

// Refs
const tableRef = ref()
const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const sortName = ref('article_id')
const sortOrder = ref('DESC')
const total = ref<number>(0)
const imageDialogVisible = ref(false)
const imagePathRef = ref('')
const imageUrlRef = ref('')
const isLoading = ref(false)
const isImgLoading = ref(false)
const imageWidth = ref(0)
const imageHeight = ref(0)
// const isExpanded = ref(false);

// Constants
const maxDialogWidth = 1000
const maxDialogHeight = 400
const articleDialogVisible = ref(false)
const activeTab = ref('content')
const selectedArticle = reactive({
  title: '',
  content: '',
  files: [] as any[]
})
const dialogWidth = computed(() => {
  const width = Math.min(imageWidth.value + 40, maxDialogWidth)
  return `${width < maxDialogWidth ? maxDialogWidth : width}px`
})

const containerStyle = computed(() => {
  const height = Math.min(imageHeight.value, maxDialogHeight - 200)
  return {
    height: `${height}px`,
    maxHeight: `${maxDialogHeight - 200}px`
  }
})
const initQueryFormValue = () => ({
  siteName: '',
  typeOne: '',
  appId: '',
  typeTwo: '',
  typeThree: '',
  title: ''
})
const initPageObj = () => ({
  page: 1,
  size: 15
})
const pageObj = ref(initPageObj())

const queryForm = reactive(initQueryFormValue())
const queryObj = computed(() => ({
  ...queryForm,
  ...pageObj.value
}))
const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  Object.assign(pageObj.value, initPageObj())
  fetchData(queryObj.value)
}
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'articleId',
    label: '文章ID',
    width: 150,
    slot: 'articleId'
  },
  {
    prop: 'appId',
    label: '新闻站点名称 | ID',
    width: 160,
    slot: 'appId'
  },
  {
    prop: 'typeOne',
    label: '分类',
    width: 180,
    slot: 'typeOne'
  },
  {
    prop: 'title',
    label: '标题',
    width: 160,
    showOmission: true
  },
  {
    prop: 'subtitle',
    label: '副标题',
    width: 160,
    showOmission: true
  },
  {
    prop: 'imagePath',
    label: '缩略图路径',
    width: 160,
    slot: 'imagePath'
  },
  {
    prop: 'detailUrl',
    label: '详情URL',
    width: 160,
    slot: 'detailUrl'
  },
  // {
  //   prop: 'lastMsg',
  //   label: '最后消息'
  // },
  // {
  //   prop: 'lastMsgId',
  //   label: '最后消息ID'
  // },
  {
    prop: 'articleTime',
    label: '爬取时间',
    width: 160
  },
  {
    prop: 'updateTime',
    label: '更新时间',
    width: 160,
    dateName: 'updateTime'
  },
  {
    prop: 'status',
    label: '状态',
    json: {
      sourceName: 'statusType',
      keyName: 'status'
    }
  }
]
// Search options
const searchOptions: SearchOption[] = [
  {
    prop: 'siteName',
    type: 'autoComplete',
    slot: 'autoComplete'
  },
  {
    prop: 'typeOne',
    type: 'autoComplete',
    slot: 'typeOne'
  },
  {
    prop: 'typeTwo',
    type: 'autoComplete',
    slot: 'typeTwo'
  },
  {
    prop: 'typeThree',
    type: 'autoComplete',
    slot: 'typeThree'
  },
  {
    prop: 'title',
    type: 'input'
  }
]

const searchBtnOptions: SearchBtnOptions = {
  isSearch: true,
  isReset: true,
  isAdd: false
}

// Methods
const fetchData = async (val?: GetRequest) => {
  let params: any = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: sortName.value,
    sortOrder: sortOrder.value,
    ...queryForm
  }
  isLoading.value = true
  try {
    const response = await reqHttp(params)
    if (response.success) {
      tableData.value = response.data.list
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

const handleSizeChange = (val: number) => {
  currentPage.value = 1
  pageSize.value = val
  fetchData()
}

const onDialogClose = () => {
  imageDialogVisible.value = false
  isImgLoading.value = false
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const handleClickDetail = (row) => {
  const { detailUrl } = row
  window.open(detailUrl, '_blank')
}
const handleClickArticleId = async (row: any) => {
  const { articleId } = row
  articleDialogVisible.value = true
  activeTab.value = 'content'
  try {
    const response = await reqContentPage({ articleId })
    if (response.success) {
      const { data } = response
      selectedArticle.title = data.title
      selectedArticle.content = data.content
    } else {
      showErrorMessage(response)
    }

    const resFiles = await reqFilesList({ articleId })
    if (resFiles.success) {
      const { data } = resFiles
      selectedArticle.files = data.list.map((item) => {
        return {
          ...item,
          s3Url: item?.s3OssPath ? VITE_CDN_URL + item.s3OssPath : item.fileUrl
        }
      })
    } else {
      showErrorMessage(response)
    }
    console.log(resFiles)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
  }
}
const handleClickImagePath = (row) => {
  // queryDataUrl
  const { imagePath, imageUrl, queryDataUrl } = row
  imagePathRef.value = imagePath
  imageUrlRef.value = createWholeUrl(imageUrl, queryDataUrl)
  imageDialogVisible.value = true
  isImgLoading.value = true
  const img = new Image()
  img.src = imageUrl
  if (img.complete) {
    onImageLoad({ target: img })
  }
}

const onImageLoad = (event) => {
  const img = event.target
  imageWidth.value = img.naturalWidth
  imageHeight.value = img.naturalHeight
  isImgLoading.value = false
}
const onImageError = () => {
  isImgLoading.value = false
}

const handleCloseImageDialog = () => {
  imageDialogVisible.value = false
}
const onImageClick = () => {
  window.open(imageUrlRef.value, '_blank')
}
const onSrcImageClick = (link) => {
  window.open(link, '_blank')
}
const handleAppIdChange = (val) => {
  console.log(val)
  if (val?.valueObj?.appId) {
    queryForm.appId = val.valueObj.appId
  }
  queryForm.typeOne = ''
  queryForm.typeTwo = ''
  queryForm.typeThree = ''
}
const handleInput = (val, form) => {
  if (form?.appId) {
    form.appId = ''
  }
}
// Lifecycle hooks
onMounted(fetchData)
</script>

<style scoped lang="less">
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  overflow: hidden;
  img {
    object-fit: contain;
  }
}
.mb-4 {
  margin-bottom: 16px;
}
.article-tabs {
  height: 600px; /* Adjust this value as needed */
  display: flex;
  flex-direction: column;
  .tab-pane {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .image-link {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 5px 5px;
    color: black;
    z-index: 99;
    cursor: pointer;
  }
  .el-image-show {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .three-d-div {
    border-radius: 20px;
    background-color: #f0f0f0;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2);
    transform: perspective(500px) rotateX(10deg);
    transition: all 0.3s ease;
  }

  .three-d-div:hover {
    transform: perspective(500px) rotateX(0deg);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3), 0 20px 40px rgba(0, 0, 0, 0.2);
  }
}

.article-tabs :deep(.el-tabs__content) {
  flex: 1;
}

.tab-content {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}
.tab-content-view {
  width: 60%;

  * {
    width: 100%;
  }
}
</style>
