<template>
  <el-form :inline="true" class="search_left" :model="localSearchForm" label-width="70px" ref="formRef">
    <el-form-item label="" prop="manageSiteId">
      <ManageSiteSelect @onSelect="onSiteSelect" />
    </el-form-item>
    <el-form-item label="" prop="domain">
      <AutoComplete
        v-model="localSearchForm.domain"
        :displayFields="['domain']"
        keyword="domain"
        :is-empty="false"
        :is-list="false"
        isPage
        placeholder="域名"
        :httpFunc="queryDomainConfigBbsAndNaviga"
        :trigger-on-focus="false"
      ></AutoComplete>
    </el-form-item>

    <el-form-item label="" prop="ownerUserId">
      <el-autocomplete
        clearable
        v-model="localSearchForm.ownerUserId"
        :fetch-suggestions="querySearchUserLogin"
        placeholder="所属用户 | ID"
        @select="handleSelectUserId"
        :trigger-on-focus="false"
      >
        <template #default="{ item }">
          <div class="autocomplete-item">
            <div>{{ item.loginId }}-{{ item.userId }}</div>
          </div>
        </template>
      </el-autocomplete>
    </el-form-item>
    <el-form-item label="" prop="websiteInnerName">
      <el-input v-model="localSearchForm.websiteInnerName" placeholder="站点内部名称" clearable />
    </el-form-item>

    <el-form-item label="" prop="websiteTitle">
      <el-input v-model="localSearchForm.websiteTitle" placeholder="标题" clearable />
    </el-form-item>
    <el-form-item label="" prop="websiteRef">
      <el-autocomplete
        clearable
        v-model="localSearchForm.websiteRef"
        :fetch-suggestions="querySearchWebsiteRef"
        placeholder="绑定站点ID"
        @select="handleSelectWebsiteRef"
        :trigger-on-focus="false"
      >
        <template #default="{ item }">
          <div class="autocomplete-item">
            <div>{{ item.websiteRef }} | {{ item.websiteRefName }}</div>
          </div>
        </template>
      </el-autocomplete>
    </el-form-item>
    <el-form-item label="" prop="langCodes">
      <el-select v-model="localSearchForm.langCodes" multiple placeholder="语言">
        <el-option v-for="item in optionsLang" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="" prop="areaCodes">
      <el-select v-model="localSearchForm.areaCodes" multiple placeholder="地区">
        <el-option v-for="item in optionsArea" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch()" :loading="isLoading">
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
      <el-button type="success" @click="handleAddButton">
        <el-icon style="margin: 0 5px 0 0">
          <Plus />
        </el-icon>
        新增
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
interface SearchForm {
  sortName: string
  sortOrder: string
  domain: string
  ownerUserId: string
  websiteRef: string
  langCodes: string[]
  areaCodes: string[]
  websiteInnerName: string
  websiteTitle: string
}
import { ref, inject } from 'vue'
import { defineEmits } from 'vue'
import AutoComplete from '@/components/AutoComplete/index.vue'
import { optionsLang, optionsArea } from '@/const/options'
import { queryDomainConfigBbsAndNaviga } from '@/api/site/nav'
import { reqUserList, reqUserListFilter } from '@/api/user/index'
import { getWebSiteInfo } from '@/api/site'
import { SiteInfo } from '@/api/manageSite/manageSiteList/types'
const fetchData = inject('fetchData') as (params: any) => void
const queryForm = reactive({
  manageSiteId: ''
})
const props = defineProps({
  loadingBtn: {
    type: Boolean,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const onSiteSelect = (val: SiteInfo) => {
  queryForm.manageSiteId = val.manageId
}

let backUpOwnerUserIdList: string[] = []
let backUpWebsiteRefList: string[] = []
const initDefaultPageObj = () => ({ size: 100, page: 1 })
const querySearchUserLogin = async (queryString: string, cb: (arg: any) => void) => {
  try {
    const response = await reqUserListFilter({
      userId: queryString,
      fileType: 'd',
      ...initDefaultPageObj()
    })
    if (response.success && response.data) {
      const results = response.data.list.map((item: any) => ({
        value: item.userId,
        loginId: item.loginId,
        userId: item.userId
      }))
      backUpOwnerUserIdList = response.data.list.map((item: any) => item.userId)
      cb(results)
    } else {
      cb([])
    }
  } catch (error) {
    console.error('Error fetching domain suggestions:', error)
    ElMessage.error('获取用户id时出错')
    cb([])
  }
}
const querySearchWebsiteRef = async (queryString: string, cb: (arg: any) => void) => {
  try {
    const response = await getWebSiteInfo({ websiteId: queryString, ...initDefaultPageObj() })
    if (response.success && response.data) {
      const results = response.data.list.map((item: any) => ({
        websiteRef: item.websiteId,
        websiteRefName: item.websiteInnerName
      }))
      backUpWebsiteRefList = response.data.list.map((item: any) => item.websiteId)
      cb(results)
    } else {
      cb([])
    }
  } catch (error) {
    console.error('Error fetching domain suggestions:', error)
    ElMessage.error('获取站点id时出错')
    cb([])
  }
}
const handleSelectUserId = (item: { loginId: string; userId: string }) => {
  localSearchForm.value.ownerUserId = item.userId
}
const handleSelectWebsiteRef = (item: any) => {
  localSearchForm.value.websiteRef = item.websiteRef
}
const isLoading = ref(props.loadingBtn)
const initForm = () => ({
  sortName: 'create_time',
  sortOrder: 'DESC',
  domain: '',
  ownerUserId: '',
  websiteRef: '',
  langCodes: [],
  areaCodes: [],
  websiteInnerName: '',
  websiteTitle: ''
})
const formRef = ref()
const emit = defineEmits(['update:visible', 'search', 'update:model', 'resetPagination'])
const searchForm = inject('searchForm') as {
  model: { value: SearchForm }
  update: (newFormModel: Partial<SearchForm>) => void
}
const localSearchForm = ref<SearchForm>({ ...searchForm.model.value })
watch(
  localSearchForm,
  (newValue) => {
    searchForm.update(newValue)
  },
  { deep: true }
)

watch(
  () => searchForm.model.value,
  (newValue) => {
    Object.assign(localSearchForm.value, newValue)
  },
  { deep: true }
)
const handleSearch = () => {
  emit('search', localSearchForm.value)
}
const handleAddButton = () => {
  emit('update:visible', true)
}

const handleReset = () => {
  formRef.value.resetFields()
  const defaultPage = { size: 15, page: 1 }
  fetchData({ ...initForm(), ...defaultPage })
  emit('resetPagination')
}
watch(
  localSearchForm,
  (newValue) => {
    emit('update:model', newValue)
  },
  { deep: true }
)
</script>
