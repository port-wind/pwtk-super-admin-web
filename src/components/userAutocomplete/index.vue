<template>
  <el-autocomplete
    v-model="remoteValue"
    @input="inputChange"
    :placeholder="props.placeholder"
    clearable
    spellcheck="false"
    :fetch-suggestions="remoteIdChange"
    @select="change"
    :loading="isLoading3"
  >
    <template #default="{ item }">
      <slot name="suggestion" :item="item">
        <template v-if="props.name == 'searchId'">
          <span style="float: left">{{ item.value }}</span>
          <span style="float: right; font-size: 13px">- {{ item.name }}</span>
        </template>
        <template v-if="props.name == 'nickname'">
          <span style="float: left">{{ item.value }}</span>
        </template>
        <template v-if="props.name == 'parentId'">
          <span style="float: left">{{ item.value }}</span>
          <span style="float: right; font-size: 13px">- {{ item.name }}</span>
        </template>
        <template v-if="props.name == 'parentNickname'">
          <span style="float: left">{{ item.value }}</span>
        </template>
      </slot>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'
import { reqUserList } from '@/api/user/index'
import showErrorMessage from '@/utils/showErrorMessage'
import type { AutocompleteFetchSuggestionsCallback } from 'element-plus'
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入内容'
  },
  onChangeSearch: {
    type: Function,
    default: null
  }
})

const remoteValue = defineModel('remoteValue')

const remoteOptions: any = ref([])

const isLoading3 = ref(false)

const tempArr = ref([])

watch(remoteValue, (newX) => {
  if (!newX) {
    remoteValue.value = ''
  }
})

const remoteIdChange = async (queryString: string, cb: AutocompleteFetchSuggestionsCallback) => {
  queryString = queryString.trim()
  if (!queryString) {
    tempArr.value = []
    cb(tempArr.value)
    return
  }
  if (queryString) {
    isLoading3.value = true
    try {
      const res = await reqUserList({ [props.name]: queryString, page: 1, size: 100 })
      remoteOptions.value = res.data.list
      if (res?.success) {
        if (props.name == 'searchId') {
          tempArr.value = remoteOptions.value.map((val) => {
            return {
              value: val.loginId,
              name: val.userId
            }
          })
        }
        if (props.name == 'nickname') {
          tempArr.value = remoteOptions.value.map((val) => {
            return {
              value: val.nickname,

              name: val.nickname
            }
          })
        }

        if (props.name == 'parentId') {
          tempArr.value = remoteOptions.value.map((val) => {
            return {
              value: val.parentLoginId,

              name: val.parentId
            }
          })
        }
        if (props.name == 'parentNickname') {
          tempArr.value = remoteOptions.value.map((val) => {
            return {
              value: val.parentNickname,
              name: val.parentNickname
            }
          })
        }
        cb(tempArr.value)
      } else {
        showErrorMessage(res)
        cb([])
      }
    } catch (err) {
      // handle error
      cb([])
    } finally {
      isLoading3.value = false
    }
  } else {
    remoteOptions.value = []
    tempArr.value = []
  }
}

const change = (item) => {
  remoteValue.value = item.name
}

const inputChange = (val) => {
  remoteValue.value = val
}
</script>

<style lang="less" scoped></style>
