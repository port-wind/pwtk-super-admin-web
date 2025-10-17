<template>
  <!-- @keyup.enter="props?.onChangeSearch()" -->
  <!-- @handleKeyEnter="props?.onChangeSearch()" -->
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
    <!-- 使用插槽定义自动补全选项的显示方式 -->
    <template #default="{ item }">
      <slot name="suggestion" :item="item">
        <template v-if="props.name == 'searchId'">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; font-size: 13px">- {{ item.value }}</span>
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
import { ref, watch } from 'vue'
import { defineProps } from 'vue'
import { reqUserList } from '@/api/user/index'
import showErrorMessage from '@/utils/showErrorMessage'
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

const remoteId = defineModel('remoteId')
const remoteValue = defineModel('remoteValue')
// const remoteId = ref(props.remoteId);
const query: any = ref('')
const remoteOptions: any = ref([])
const isLoading3 = ref(false)
const tempArr = ref([])

// watch(() => remoteId, (newVal) => {
//   remoteId.value = newVal;
// });

// watch(remoteId, (newX) => {
//   console.log(`x is ${newX}`)
//     // remoteId.value = newX
//     if (!newX) {
//     query.value = ''
//     remoteId.value = ''
//   } else {
//     // query.value = newX

//   }
// })
watch(
  () => remoteId,
  (newVal) => {
    console.log(`x is ${newVal}`)
    if (!newVal) {
      remoteValue.value = ''
      remoteId.value = ''
    } else {
    }
  },
  { deep: true }
)
// 单个 ref
watch(remoteValue, (newX) => {
  console.log(`x is ${newX}`)
  if (!newX) {
    remoteValue.value = ''
    remoteId.value = ''
    // TimeArr.value = [null,null]
  } else {
    // remoteId.value = newX
    // TimeArr.value = [unitFormatDate(startDate.value),unitFormatDate(endDate.value)]
  }
})

const remoteIdChange = async (queryString, cb) => {
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
              value: val.userId,
              name: val.loginId
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
        console.log(tempArr.value)
        cb(tempArr.value)
      } else {
        console.log(res)
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
  console.log('item', item)
  remoteValue.value = item.name
  remoteId.value = item.value
}
const inputChange = (val) => {
  console.log('inputChange', val)
  remoteId.value = val
}
</script>

<style lang="less" scoped></style>
