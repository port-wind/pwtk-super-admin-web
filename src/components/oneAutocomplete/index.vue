<template>
  <!-- @keyup.enter="props?.onChangeSearch()" -->
  <!-- @handleKeyEnter="props?.onChangeSearch()" -->
  <el-autocomplete
    v-model="query"
    :placeholder="props.placeholder"
    clearable
    spellcheck="false"
    :fetch-suggestions="remoteValueChange"
    @select="change"
    @input="inputChange"
    :loading="isLoading3"
    @blur="
      () => {
        if (!remoteValue && autoClear) {
          query = ''
          remoteValue = ''
          remoteName = ''
        }
      }
    "
  >
    <!-- 使用插槽定义自动补全选项的显示方式 -->
    <template #default="{ item }">
      <slot name="suggestion" :item="item">
        <template v-if="props.isTwoList">
          <div v-if="props.name == 'searchId'" class="two-list-item">
            <span class="item-name">{{ item.value }}</span>
            <span class="item-separator">-</span>
            <span class="item-value">{{ item.name }}</span>
          </div>
          <div v-else class="two-list-item">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-separator">-</span>
            <span class="item-value">{{ item.value }}</span>
          </div>
        </template>
        <template v-else>
          <span>{{ item.value }}</span>
        </template>
        <!-- <template v-if="props.name == 'searchId'">
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
        </template> -->
      </slot>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { defineProps } from 'vue'
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
  //传入接口
  httpFunc: {
    type: Function,
    required: true
  },
  nameAuto: {
    type: String,
    required: true
  },
  valueAuto: {
    type: String,
    required: true
  },
  isTwoList: {
    type: Boolean,
    default: false
  },
  isPage: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: '请输入内容'
  },
  onChangeSearch: {
    type: Function,
    default: null
  },
  autoClear: {
    type: Boolean,
    default: false
  }
})

const remoteValue = defineModel('remoteValue')
const remoteName = defineModel('remoteName')
// const remoteValue = ref(props.remoteValue);
const query: any = ref('')
const remoteOptions: any = ref([])
const isLoading3 = ref(false)
const tempArr = ref([])
const pageData = props.isPage ? { page: 1, size: 100 } : {}

// watch(() => remoteValue, (newVal) => {
//   remoteValue.value = newVal;
// });
// 单个 ref
watch(query, (newX) => {
  console.log(`x is ${newX}`)
  if (!newX) {
    query.value = ''
    remoteValue.value = ''
    // TimeArr.value = [null,null]
  } else {
    // remoteValue.value = newX
    // TimeArr.value = [unitFormatDate(startDate.value),unitFormatDate(endDate.value)]
  }
})

watch(remoteValue, (newX) => {
  // console.log()
  // remoteValue.value = newX
  if (!newX) {
    query.value = ''
    remoteValue.value = ''
  } else {
    // query.value = newX
  }
})
watch(remoteName, (newX) => {
  // console.log()
  // remoteValue.value = newX
  if (!newX) {
    query.value = ''
    remoteValue.value = ''
  } else {
    // query.value = newX
  }
})

const remoteValueChange = async (queryString, cb) => {
  queryString = queryString.trim()
  if (!queryString) {
    tempArr.value = []
    cb(tempArr.value)
    return
  }
  if (queryString) {
    isLoading3.value = true
    try {
      const res = await props.httpFunc({
        [props.name]: queryString,
        ...pageData
      })
      // console.log(props.searchObj.value)

      if (res?.success) {
        remoteOptions.value = Array.isArray(res.data) ? res.data : res.data?.list
        tempArr.value = remoteOptions.value.map((val) => {
          return {
            value: val?.[props.valueAuto],
            name: val?.[props.nameAuto]
          }
        })
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
  remoteValue.value = item.value
  remoteName.value = item.name
}

const inputChange = (val) => {
  console.log('inputChange', val)
  remoteName.value = val
}

onMounted(() => {
  query.value = remoteName.value
})
</script>

<style lang="less" scoped>
.two-list-item {
  display: flex;
  align-items: center;
  width: 100%;

  .item-name {
    flex: 1;
    text-align: left;
  }

  .item-separator {
    padding: 0 8px;
    color: #888;
  }

  .item-value {
    flex: 1;
    text-align: right;
    font-size: 13px;
  }
}
</style>
