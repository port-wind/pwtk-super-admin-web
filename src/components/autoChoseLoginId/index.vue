<template>
  <el-autocomplete
    v-model="state"
    v-bind="$attrs"
    ref="refdom"
    :fetch-suggestions="querySearch"
    popper-class="my-autocomplete"
    placeholder="登入账号"
    @clear="onClear"
    @select="handleSelect"
    @change="inputChange"
  >
    <template #loading>
      <svg class="circular" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" />
      </svg>
    </template>
    <template #default="{ item }">
      <div class="value">{{ item.value }}</div>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { reqUserList } from '@/api/user/index'
import type { IReqUserListQueryParams } from '@/api/user/type'

interface IProps {
  modelValue: string | undefined
}

const props = defineProps<IProps>()
const emit = defineEmits(['update:modelValue', 'on-select'])
const refdom = ref()
const loadAll = ref<IAllData[]>([])
// const afterSearchLoadAll = ref<IAllData[]>([])
const state = ref<string | undefined>('')

interface IAllData {
  /**
   * userId
   */
  id: string
  /**
   * loginId
   */
  value: string
  /**
   * loginId + userId
   */
  label: string
}

const defaultSuggest = (): Promise<IAllData[]> => {
  return reqUserList({
    page: 1,
    size: 100,
    sortOrder: 'DESC',
    sortName: 'last_login_time'
  }).then((response) => {
    let results: IAllData[] = []
    if (response.success && response.data) {
      results = response.data.list.map(({ nickname, userId, loginId, ...rest }) => ({
        id: userId,
        value: loginId,
        label: loginId + ' ' + nickname,
        ...rest
      }))
      return results
    }
    return results
  })
}

const createFilter = (queryString: string, flag) => {
  if (flag) {
    return (item: IAllData) => {
      return item.id === queryString
    }
  } else {
    return (item: IAllData) => {
      return item.value.toLowerCase().includes(queryString.toLowerCase())
    }
  }
}

const querySearch = (queryString: string, cb: (arg: any) => void) => {
  if (!queryString && loadAll.value.length !== 0) {
    cb && cb(loadAll.value)
    return
  }

  const query: IReqUserListQueryParams = {
    page: 1,
    size: 100,
    searchId: queryString,
    sortOrder: 'DESC',
    sortName: 'last_login_time'
  }

  const reg = /\d{19}/g
  let flag = false
  if (reg.test(queryString)) {
    query.userId = queryString
    delete query.searchId
    flag = true
  } else {
    flag = false
  }

  reqUserList(query)
    .then((response) => {
      if (response.success && response.data) {
        const results = response.data.list
          .map(({ userId, loginId, ...rest }) => ({
            id: userId,
            value: loginId,
            label: loginId + ' ' + userId,
            ...rest
          }))
          .filter(createFilter(queryString, flag))

        loadAll.value = results

        cb && cb(results)
      } else {
        cb && cb([])
      }
    })
    .catch((error) => {
      ElMessage.error('获取userId时出错')
      // cb([])
    })
}

const handleSelect = (item: IAllData) => {
  state.value = item.value
  emit('update:modelValue', item.id)
  emit('on-select', item.id)
}
const onClear = (evt) => {
  refdom.value.focus()
  emit('update:modelValue', '')
  emit('on-select', '')
}

const inputChange = (value) => {
  if (props.select) {
    const res = loadAll.value.find((item) => item.value === value)
    if (res && state.value) {
      state.value = value
      emit('update:modelValue', value.trim())
    } else {
      state.value = ''
      // console.info('当前无匹配的信息')
      fetchData()
    }
  } else {
    // 随意搜索,打开这个
    state.value = value
    emit('update:modelValue', value.trim())
  }
}

const fetchData = () => {
  defaultSuggest().then((res) => {
    if (res.length > 0) {
      loadAll.value = res
    }
  })
}

const defaultMatch = (userId) => {
  const reg = /\d{19}/g
  if (reg.test(userId)) {
    const query: IReqUserListQueryParams = {
      page: 1,
      size: 10,
      userId: userId,
      sortOrder: 'DESC',
      sortName: 'last_login_time'
    }
    reqUserList(query).then((response) => {
      if (response.success && response.data) {
        const results = response.data.list.map(({ userId, loginId, ...rest }) => ({
          id: userId,
          value: loginId,
          label: loginId + ' ' + userId,
          ...rest
        }))
        if (results.length === 1) {
          loadAll.value = results
          state.value = results[0].value
        }
      }
    })
  }
}

watch(
  () => props.modelValue,
  (userId, oldUserId) => {
    if (!userId) {
      state.value = ''
      return
    }
    if (userId && !oldUserId) {
      defaultMatch(userId)
    }
  },
  {
    immediate: true
  }
)

onMounted(() => {
  fetchData()
})
</script>

<style>
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete li .highlighted .addr {
  color: #ddd;
}

.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}
.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}

@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>
