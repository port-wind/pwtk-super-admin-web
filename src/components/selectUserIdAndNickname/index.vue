<template>
  <el-select
    v-model="state"
    v-bind="$attrs"
    value-key="id"
    class="my-select"
    filterable
    remote
    placeholder="所属用户|ID"
    clearable
    @change="onchange"
    :remote-method="querySearch"
    :loading="loading"
  >
    <el-option v-for="item in loadAll" :key="item.id" :label="`${item.label}`" :value="`${item.id}`">
      <template #default>
        <div class="value">{{ item.label }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { reqUserList, reqUserListByUserIdAndName } from '@/api/user'
import type { IReqUserListByUserIdAndNameQueryParams, IReqUserListQueryParams } from '@/api/user/type'

interface IProps {
  modelValue: string
  /**
   * 使用那个值做匹配
   * 举例  v-model="scope.form.postUserId!"
   *             id="userId"                      表示： 下拉列表值中的userId 给 postUserId
   */
  id: 'userId' | 'loginId'
  default?: number
  /**
   * group 是配置显示效果的 举例[loginId,nickname] --> loginId - nickname
   * 匹配还是以id为主 ,
   */
  group?: string[]
}
const props = defineProps<IProps>()
const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const state = ref(props.modelValue) // 组件内部的 v-model 绑定
const emits = defineEmits(['update:modelValue'])
interface IAllData {
  id: string
  value: string
  label: string
}

const fetchDataByName = async (querySearch: string): Promise<any> => {
  loading.value = true
  try {
    const query: IReqUserListByUserIdAndNameQueryParams = {
      inputText: querySearch,
      page: 1,
      size: 200
    }
    const res = await reqUserListByUserIdAndName(query)
    if (res.success && res?.data) {
      loadAll.value = res.data.list.map((item) => {
        let tempItem: IAllData = {
          id: '',
          value: '',
          label: ''
        }

        if (props.group && props?.group?.length !== 0) {
          switch (props.id) {
            case 'userId':
              tempItem = {
                id: item.userId.toString(),
                value: item.userId.toString(),
                label: item[props.group[0]] + ' - ' + item[props.group[1]]
              }
              break
            case 'loginId':
              tempItem = {
                id: item.loginId,
                value: item.loginId,
                label: item[props.group[0]] + ' - ' + item[props.group[1]]
              }
              break
          }
          return tempItem
        }
        switch (props.id) {
          case 'userId':
            tempItem = {
              id: item.userId.toString(),
              value: item.userId.toString(),
              label: item.userId + ' - ' + item.nickname
            }
            break
          case 'loginId':
            tempItem = {
              id: item.loginId,
              value: item.loginId,
              label: item.loginId + ' - ' + item.nickname
            }
            break
        }
        return tempItem
      })
      // 默认选择第一个
      if (props.default && !props.modelValue) {
        state.value = loadAll.value[props.default - 1].id
        emits('update:modelValue', state.value)
      }

      loading.value = false
      return Promise.resolve(loadAll.value)
    } else {
      loadAll.value = []
      return Promise.resolve([])
    }
  } catch (error) {
    ElMessage.error('获取用户ID时出错')
  } finally {
    loading.value = false
  }
}

const fetchDataByLoginIdAndUserId = async (querySearch: string): Promise<any> => {
  loading.value = true
  try {
    const query: IReqUserListQueryParams = {
      searchId: querySearch,
      page: 1,
      size: 200
    }
    if (isCheckUserId(querySearch)) {
      query.userId = querySearch
      delete query.searchId
    }

    const res = await reqUserList(query)
    if (res.success && res?.data) {
      loadAll.value = res.data.list.map((item) => {
        let tempItem: IAllData = {
          id: '',
          value: '',
          label: ''
        }

        if (props.group && props?.group?.length !== 0) {
          switch (props.id) {
            case 'userId':
              tempItem = {
                id: item.userId.toString(),
                value: item.userId.toString(),
                label: item[props.group[0]] + ' - ' + item[props.group[1]]
              }
              break
            case 'loginId':
              tempItem = {
                id: item.loginId,
                value: item.loginId,
                label: item[props.group[0]] + ' - ' + item[props.group[1]]
              }
              break
          }
          return tempItem
        }
        switch (props.id) {
          case 'userId':
            tempItem = {
              id: item.userId.toString(),
              value: item.userId.toString(),
              label: item.userId + ' - ' + item.nickname
            }
            break
          case 'loginId':
            tempItem = {
              id: item.loginId,
              value: item.loginId,
              label: item.loginId + ' - ' + item.nickname
            }
            break
        }
        return tempItem
      })
      // 默认选择第一个
      if (props.default && !props.modelValue) {
        state.value = loadAll.value[props.default - 1].id
        emits('update:modelValue', state.value)
      }

      loading.value = false
      return Promise.resolve(loadAll.value)
    } else {
      loadAll.value = []
      return Promise.resolve([])
    }
  } catch (error) {
    ElMessage.error('获取用户ID时出错')
  } finally {
    loading.value = false
  }
}

const querySearch = async (queryString: string) => {
  if (queryString && queryString.trim()) {
    loading.value = true
    if (isCheckUserId(queryString)) {
      await fetchDataByLoginIdAndUserId(queryString)
    } else {
      await fetchDataByName(queryString)
    }
    setTimeout(() => {
      const results = isCheckUserId(queryString)
        ? loadAll.value.filter((item) => item.id === queryString)
        : loadAll.value.filter((item) => item.label.toLowerCase().includes(queryString.toLowerCase()))
      loadAll.value = results.length ? results : []
      loading.value = false
    }, 200)
  } else {
    fetchDataByName('')
  }
}

const isCheckUserId = (item) => typeof item === 'string' && Number(item).toString().length === 19

onMounted(async () => {
  if (props.modelValue) {
    if (isCheckUserId(props.modelValue)) {
      fetchDataByLoginIdAndUserId(props.modelValue)
    } else {
      fetchDataByName(props.modelValue)
    }
  }
})

const onchange = (val) => {
  emits('update:modelValue', val ?? '')
}

watch(
  () => props.modelValue,
  async (newVal, oldVal) => {
    state.value = newVal
    querySearch(newVal)
    // if (newVal && isCheckUserId(newVal)) {
    //   const res = await reqUserList({
    //     searchId: newVal,
    //     page: 1,
    //     size: 100
    //   })
    //   const list = res.data.list.map((item) => {
    //     return {
    //       id: item.userId.toString(),
    //       value: item.nickname,
    //       label: item.loginId + ' - ' + item.nickname
    //     }
    //   })
    //   loadAll.value = list
    // }
    // fetchData(newVal)
  },
  { immediate: true }
)
</script>

<style scoped>
.my-select {
  width: 100%;
}
.value {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
