<template>
  <!-- @keyup.enter="props?.onChangeSearch()" -->
  <!-- @handleKeyEnter="props?.onChangeSearch()" -->
  <el-autocomplete
    v-model="query"
    :placeholder="props.placeholder"
    clearable
    spellcheck="false"
    :fetch-suggestions="remoteIdChange"
    @select="select"
    @input="inputChange"
    :loading="isLoading3"
  >
    <!-- 使用插槽定义自动补全选项的显示方式 -->
    <template #default="{ item }">
      <slot name="suggestion" :item="item">
        <template v-if="props.isTwoList">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; font-size: 13px">- {{ item.value }}</span>
        </template>
        <template v-else>
          <span style="float: left">{{ item.value }}</span>
        </template>
      </slot>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { defineProps } from 'vue'
import { reqListBlurTemplate } from '@/api/site/index'
import showErrorMessage from '@/utils/showErrorMessage'
/**
 * @property {Function} httpFunc - 必须，发送 HTTP 请求获取建议数据的函数
 * @property {String} query - 用户输入的查询字符串
 * @property {Boolean} isLoading - 是否正在加载数据
 * @property {Object|null} pageData - 分页数据，如果需要分页则包含 page 和 size
 * @property {Array} suggestions - 当前的建议列表
 * @property {String} name - 必须，用于在请求中指定查询关键字的字段名称
 *
 */
const props = defineProps({
  name: {
    type: String,
    required: true
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
const remoteName = defineModel('remoteName')

// const remoteId = ref(props.remoteId);
const query: any = ref('')
const remoteOptions: any = ref([])
const isLoading3 = ref(false)
const tempArr = ref([])
const pageData = props.isPage ? { page: 1, size: 100 } : {}

watch(query, (newX) => {
  console.log(`x is ${newX}`)
  if (!newX) {
    query.value = ''
    remoteId.value = ''
  } else {
    // query.value = ''
    remoteId.value = newX
  }
})

watch(remoteId, (newX) => {
  console.log(`x is ${newX}`)
  if (!newX) {
    query.value = ''
    remoteId.value = ''
  } else {
    query.value = newX
  }
})

const remoteIdChange = async (queryString, cb) => {
  queryString = queryString.trim()
  if (!queryString) {
    tempArr.value = []
    cb(tempArr.value)
    return
  }
  console.log(1111)
  if (queryString) {
    isLoading3.value = true
    try {
      const res = await props.httpFunc({ [props.name]: queryString, ...pageData })
      if (res?.success) {
        remoteOptions.value = res.data

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
      // tempArr.value = []
    }
  } else {
    remoteOptions.value = []
    tempArr.value = []
  }
}

const select = (item) => {
  console.log('item', item)
  console.log('item', item.value)
  console.log('item', item.name)
  query.value = item.value
  remoteId.value = item.value
  remoteName.value = item.name
}
const inputChange = (val) => {
  console.log('inputChange', val)
  remoteName.value = ''
}
</script>

<style lang="less" scoped></style>
