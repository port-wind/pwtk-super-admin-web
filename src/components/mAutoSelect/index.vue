<template>
  <el-autocomplete
    v-model="query"
    :loading="isLoading"
    :fetch-suggestions="fetchSuggestions"
    :placeholder="placeholder"
    @select="handleSelect"
    :debounce="1000"
    v-bind="$attrs"
  >
    <!-- 使用插槽定义自动补全选项的显示方式 -->
    <template #default="{ item }">
      <slot name="suggestion" :item="item">
        <div>{{ item.value }}</div>
      </slot>
    </template>
  </el-autocomplete>

  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="Please enter a keyword"
    :remote-method="remoteMethod"
    :loading="loading"
    style="width: 240px"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
/**
 * 定义组件的 props
 * @property {Function} httpFunc - 必须，发送 HTTP 请求获取建议数据的函数
 * @property {String} keyword - 必须，用于在请求中指定查询关键字的字段名称
 * @property {Boolean} isPage - 可选，是否分页查询，默认为 false
 * @property {String} placeholder - 可选，输入框的占位符文本，默认为 '请输入搜索内容'
 */
const props = defineProps({
  modelValue: String,
  httpFunc: {
    type: Function,
    required: true
  },
  keyword: {
    type: String,
    required: true
  },
  isPage: {
    type: Boolean,
    default: true
  },
  isList: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '请输入搜索内容'
  },
  displayFields: {
    type: Array,
    default: () => ['keyword']
  },
  searchObj: {
    type: Object,
    default: () => ({})
  }
})

/**
 * 定义组件的 emits
 * @event select - 当用户选择一个建议项时触发，传递选中的项
 */
const emit = defineEmits(['update:modelValue', 'select'])
/**
 * @property {String} query - 用户输入的查询字符串
 * @property {Boolean} isLoading - 是否正在加载数据
 * @property {Object|null} pageData - 分页数据，如果需要分页则包含 page 和 size
 * @property {String} lastQuery - 上一次查询的字符串，用于避免重复查询
 * @property {Array} suggestions - 当前的建议列表
 */

type KeyValue = {
  key: string | number
  value: string
}
const query = ref(props.modelValue || '')
const isLoading = ref(false)
const pageData = props.isPage ? { page: 1, size: 100 } : {}
const lastQuery = ref('')
const restaurants = ref<KeyValue[]>([])

/**
 * 从后台获取建议数据并调用回调函数返回结果
 * @param {String} queryString - 当前输入的查询字符串
 * @param {Function} cb - 回调函数，用于传递建议数据
 */

const fetchSuggestions = async (queryString, cb) => {
  queryString = queryString.trim()
  if (queryString && queryString === lastQuery.value) {
    cb(restaurants.value)
    return
  }

  isLoading.value = true
  lastQuery.value = queryString

  try {
    const response = await props.httpFunc({
      [props.keyword]: queryString,
      ...pageData,
      ...props.searchObj
    })

    if (response?.success) {
      let suggestions = props.isList ? response?.data?.list : response?.data
      // 确保 suggestions 是一个数组
      if (!Array.isArray(suggestions)) {
        cb([])
        return
      }
      const isPrimitive = isPrimitiveArray(suggestions)
      console.log('isPrimitive', isPrimitive)

      const result = suggestions.map((item, index) => {
        if (isPrimitive) {
          return {
            key: index,
            value: item
          }
        } else {
          let displayValues: string
          // if (!!(props.displayFields))
          if (props.displayFields.length > 1) {
            displayValues = props.displayFields.map((field) => item[field as keyof typeof item] || '暂无数据').join('-')
          } else {
            const displayField = props.displayFields[0] as string
            displayValues = item[displayField]
          }
          return {
            key: item[props.keyword],
            value: displayValues
          }
        }
      })

      restaurants.value = result
      cb(restaurants.value)
    } else {
      cb([])
    }
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    cb([])
  } finally {
    isLoading.value = false
  }
}
const isPrimitiveArray = (arr) => {
  return arr.every((item) => typeof item !== 'object' || item === null)
}
/**
 * 处理用户选择建议项的事件
 * @param {Object} item - 用户选择的建议项
 */
const handleSelect = (item) => {
  console.log('item', item)
  emit('update:modelValue', item.key)
  emit('select', item)
}

/**
 * 监听 props.modelValue 的变化
 */
watch(
  () => props.modelValue,
  (newVal) => {
    // console.log(newVal)
    newVal ? (query.value = newVal) : null
  }
)

watch(query, (newVal) => {
  emit('update:modelValue', newVal)
})

//   ------------------------------------------------- select part-------------------------------------------------------

interface ListItem {
  value: string
  label: string
}

const list = ref<ListItem[]>([])
const options = ref<ListItem[]>([])
const value = ref<string[]>([])
const loading = ref(false)

onMounted(() => {
  list.value = states.map((item) => {
    return { value: `value:${item}`, label: `label:${item}` }
  })
})

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = list.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
]
</script>

<style scoped>
/* 你的样式 */
</style>
