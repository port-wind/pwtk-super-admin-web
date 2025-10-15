<template>
  <!-- @keyup.enter="props?.onChangeSearch()" -->
  <!-- @handleKeyEnter="props?.onChangeSearch()" -->
  <el-autocomplete
    v-model="query"
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
        <template v-if="props.isTwoList">
          <span style="float: left">{{ item.value }}</span>
          <span style="float: right; font-size: 13px">- {{ item.name }}</span>
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
import { reqUserList } from '@/api/user/index'
import showErrorMessage from '@/utils/showErrorMessage'
/**
 * @property {String} query - 用户输入的查询字符串
 * @property {Boolean} isLoading - 是否正在加载数据
 * @property {Object|null} pageData - 分页数据，如果需要分页则包含 page 和 size
 * @property {String} lastQuery - 上一次查询的字符串，用于避免重复查询
 * @property {Array} suggestions - 当前的建议列表
 *
 */
const props = defineProps({
  name: {
    type: String,
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
  label: {
    type: String,
    default: ''
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
  }
})

const remoteId = defineModel('remoteId')

// const remoteId = ref(props.remoteId);
const query = ref(remoteId || '')
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
  }
})

watch(
  () => remoteId,
  (newVal) => {
    query.value = newVal
  }
)

const remoteIdChange = async (queryString, cb) => {
  queryString = queryString.trim()
  if (!queryString) {
    tempArr.value = []
    cb(tempArr.value)
    return
  }
  if (queryString) {
    // isLoading3.value = true;
    try {
      const res = await reqUserList({ [props.name]: queryString, ...pageData })
      remoteOptions.value = res.data.list
      if (res?.success) {
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
  console.log(item.value)
  query.value = item.value
  remoteId.value = item.name
}
</script>

<style lang="less" scoped></style>
