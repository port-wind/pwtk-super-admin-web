<script setup lang="ts">
import { ref } from 'vue'
import codeList from '@/assets/json/phone.json'
import { reqShowMobile } from '@/api/user'
import { useModalsStore } from '@/stores/modalStore'

interface IAllData {
  value: string
  label: string
  phone_code: string
  english_name: string
}

const filterPlus = (val) => {
  return val?.replaceAll(/\+/g, '')
}

interface IProps {
  mobile: string
  mobileCountryCode: string
}
const props = defineProps<IProps>()

const modalsStore = useModalsStore()
const loadAll = ref<IAllData[]>([])
const tempMobile = ref<string | undefined>(props.mobile)
const tempMobileCountryCode = ref(filterPlus(props.mobileCountryCode))

const emits = defineEmits(['update:mobileCountryCode', 'update:mobile'])

const showAllMobile = ref<string | undefined>('')

const phoneCode = codeList.map((item) => {
  return {
    value: item.phone_code,
    label: item.phone_code + '|' + item.english_name + '|' + item.country_code + '|' + item.chinese_name,
    ...item
  }
})

onMounted(() => {
  loadAll.value = phoneCode
})

watch(
  () => modalsStore?.userInfoModal?.modalData?.accountInfo,
  (accountInfo) => {
    tempMobile.value = accountInfo?.mobile
    tempMobileCountryCode.value = filterPlus(accountInfo?.mobileCountryCode)
    if (accountInfo?.userId) {
      getTempMobileCurrentValue(accountInfo.userId)
    }
  },
  {
    deep: true
  }
)

onMounted(() => {
  if (modalsStore?.userInfoModal?.modalData?.accountInfo?.userId) {
    getTempMobileCurrentValue(modalsStore?.userInfoModal?.modalData?.accountInfo.userId)
  }
})

const getTempMobileCurrentValue = async (userId: string) => {
  try {
    let res = await reqShowMobile(userId)
    if (res.success) {
      showAllMobile.value = res.data
    }
  } catch (error) {}
}

const onBlur = () => {
  emits('update:mobile', tempMobile)
}
const onChange = () => {
  emits('update:mobileCountryCode', tempMobileCountryCode)
}
</script>

<template>
  <el-input @blur="onBlur()" class="input-with-select" placeholder="输入手机号码" v-model="tempMobile">
    <template #prepend>
      <el-select
        class="select_phone_code"
        v-model="tempMobileCountryCode"
        @change="onChange"
        type="number"
        placeholder="手机区号"
        filterable
        clearable
        style="min-width: 108px"
      >
        <el-option v-for="item in loadAll" :key="item.value" :label="`${item.value}`" :value="item.value">
          <template #default>
            <div class="phone_code">{{ `${item.phone_code} ${item.english_name}` }}</div>
          </template>
        </el-option>
      </el-select>
    </template>
  </el-input>
</template>

<style lang="less">
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.input-with-select.is-disabled .el-input-group__prepend {
  background-color: #f5f7fa;
}

.input-with-select .el-input-group__append {
  width: 35px;
  padding: 0 10px;
  background: white;
}

.select_phone_code .el-select__placeholder::before {
  content: '+';
}

.phone_code::before {
  content: '+';
}
</style>
