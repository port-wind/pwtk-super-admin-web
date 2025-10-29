<template>
  <!-- <el-form-item :label="props?.lable" prop="props.prop"> -->
  <el-select
    @keyup.enter="props?.onChangeSearch()()"
    v-model="remoteId"
    filterable
    remote
    reserve-keyword
    :placeholder="props.placeholder"
    clearable
    :remote-method="remoteIdChange"
    @change="change()"
    :loading="isLoading3"
  >
    <el-option
      v-if="props.name == 'userId'"
      v-for="(item, index) in remoteOptions"
      :key="index"
      :label="item[`${props.name}`]"
      :value="item[`${props.name}`]"
    >
      <span style="float: left">{{ item[`loginId`] }}</span>
      <!-- <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
         -  {{ item[`${props.name}`]  }}
      </span> -->
      <span style="float: right; font-size: 13px">- {{ item[`${props.name}`] }}</span>
    </el-option>
    <!-- <el-option v-if="props.name == 'searchId'" v-for="(item, index) in remoteOptions" :key="index"
      :label="item[`${props.name}`]" :value="item[`${props.name}`]">
      <span style="float: left">{{ item[`loginId`] }}</span>
      <span style="float: right; font-size: 13px">
        - {{ item[`userId`] }}
      </span>
    </el-option> -->
    <el-option
      v-else-if="props.name == 'loginId'"
      v-for="(item, index) in remoteOptions"
      :key="item.userId"
      :label="item[`${props.name}`]"
      :value="item[`${props.name}`]"
    ></el-option>
    <el-option
      v-else-if="props.name == 'searchId'"
      v-for="(item, index) in remoteOptions"
      :key="item.userId"
      :label="item.loginId + '-' + item.userId"
      :value="item.userId"
    >
      <span style="float: left">{{ item.loginId }}</span>
      <span style="float: right; font-size: 13px">- {{ item.userId }}</span>
    </el-option>
    <el-option
      v-else-if="props.name == 'nickname'"
      v-for="(item, index) in remoteOptions"
      :key="item.userId"
      :label="item[`${props.name}`]"
      :value="item[`${props.name}`]"
    ></el-option>
    <el-option
      v-else-if="props.name == 'parentNickname'"
      v-for="(item, index) in remoteOptions"
      :key="item.userId"
      :label="item[`${props.name}`]"
      :value="item[`${props.name}`]"
    ></el-option>
    <el-option
      v-else-if="props.name == 'userLevel'"
      v-for="(item, index) in remoteOptions"
      :key="item.index"
      :label="item[`${props.name}`]"
      :value="item[`${props.name}`]"
    ></el-option>
    <el-option
      v-else
      v-for="(item, index) in remoteOptions"
      :key="item.userId"
      :label="item[`${props.name}`]"
      :value="item[`${props.name}`]"
    ></el-option>
  </el-select>
  <!-- </el-form-item> -->
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { reqUserList } from '@/api/user/index'
// const props = defineProps(['name', 'lable', 'prop', 'placeholder', 'onChangeSearch'])
// 定义 props 的类型和默认值
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
  remoteId: {
    type: String,
    required: true
  },
  onChangeSearch: {
    type: Function,
    default: null
  },
  isConectLabel: {
    type: Boolean,
    default: true
  },
  isAddForm: {
    type: Boolean,
    default: false
  }
})

const remoteId = defineModel('remoteId')

const remoteOptions: any = ref([])
const inputId = ref('')
const isLoading3 = ref(false)

// 单个 ref
watch(remoteId, (newX) => {
  console.log(`x is ${newX}`)
  if (!newX) {
    remoteId.value = ''
  }
})
function handleCycleTime(date) {}

async function remoteIdChange(val) {
  console.log(val)
  val = val.trim()
  if (!val) {
    remoteOptions.value = []
    // cb(remoteOptions.value)
    return
  }
  // let c = { `${props.name}`: val, page: 1, size: 100 }
  if (val) {
    try {
      let res = await reqUserList({ [props.name]: val, page: 1, size: 100 })
      remoteOptions.value = res.data.list
      console.log(remoteOptions.value)
    } catch (err) {}
  } else {
    remoteOptions.value = []
  }
}
const change = (item) => {
  console.log(item)
  if (props.isAddForm) {
    // remoteId.value = item
  }
}
</script>
<style lang="less" scoped></style>
