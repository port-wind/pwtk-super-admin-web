<script setup lang="ts">
import { Hide, View } from '@element-plus/icons-vue'
import codeList from '@/assets/json/phone.json'
import { reqShowMobile } from '@/api/user'
import { useModalsStore } from '@/stores/modalStore'

interface ICountryCode {
  english_name?: string
  chinese_name?: string
  country_code: string
  phone_code: string
  value: string
  label: string
}

interface IProps {
  mobileCountryCode: string
  mobile: string
}

const props = defineProps<IProps>()
const modalsStore = useModalsStore()
const countryCodeList = ref<ICountryCode[]>([])
const emits = defineEmits(['update:mobileCountryCode', 'update:mobile'])

const mobileCountryCode = defineModel('mobileCountryCode')
const mobile = defineModel('mobile')
const tempMobile = ref(mobile.value)
const showAllMobile = ref<string | undefined>('')
const tempMobileCountryCode = ref(mobileCountryCode)
console.log('🚀 ~ tempMobileCountryCode:', tempMobileCountryCode.value)

if (tempMobileCountryCode.value.includes('+')) {
  tempMobileCountryCode.value = tempMobileCountryCode.value.replaceAll(/\+/g, '')
}

const isPhoneVisible = ref<boolean>(true)

const phoneCode = codeList.map((item) => {
  return {
    value: item.phone_code,
    label: item.phone_code + '|' + item.english_name + '|' + item.country_code + '|' + item.chinese_name,
    ...item
  }
})

const togglePhoneVisibility = () => {
  isPhoneVisible.value = !isPhoneVisible.value
  if (isPhoneVisible.value) {
    tempMobile.value = mobile.value
  } else {
    tempMobile.value = showAllMobile.value
  }
}

onMounted(() => {
  countryCodeList.value = phoneCode
})

const createFilter = (queryString: string) => {
  return (countryCode: ICountryCode) => {
    return countryCode.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const querySearch = (queryString: string, cb: any) => {
  const results = queryString ? countryCodeList.value.filter(createFilter(queryString)) : countryCodeList.value
  cb(results)
}

const onChange = (item) => {
  emits('update:mobile', item)
}

const handleSelect = (item: ICountryCode) => {
  emits('update:mobileCountryCode', item.phone_code)
}

watch(
  () => modalsStore?.userInfoModal?.modalData?.accountInfo,
  (accountInfo) => {
    tempMobile.value = accountInfo?.mobile
    tempMobileCountryCode.value = accountInfo.mobileCountryCode.replace(/\+/g, '')
    if (accountInfo.userId) {
      getTempMobileCurrentValue(accountInfo.userId)
    }
  },
  {
    deep: true
  }
)

onMounted(() => {
  if (modalsStore?.userInfoModal?.modalData?.userId) {
    getTempMobileCurrentValue(modalsStore?.userInfoModal?.modalData?.userId)
  }
})

const getTempMobileCurrentValue = async (userId: string) => {
  try {
    let res = await reqShowMobile({ userId: userId })
    if (res.success) {
      showAllMobile.value = res.data
    }
  } catch (error) {}
}

const onBlur = (value) => {
  //@ts-ignore
  tempMobile.value = tempMobile?.value?.replace(/[^0-9*]/g, '')
}
</script>

<template>
  <el-input
    ref="mobileRef"
    v-model.trim="tempMobile"
    placeholder="输入手机号码"
    class="input-with-select"
    type="text"
    @change="onChange"
    @blur="onBlur"
  >
    <template #prepend>
      <el-autocomplete
        v-model="tempMobileCountryCode"
        :fetch-suggestions="querySearch"
        placeholder="手机区号"
        @select="handleSelect"
      >
        <template #default="{ item }">
          <div class="phone_number">
            <div class="country_code">{{ item.phone_code }}</div>
            <div class="english_name">{{ item.english_name }}</div>
          </div>
        </template>
      </el-autocomplete>
    </template>
    <template #append>
      <el-button v-if="isPhoneVisible" @click="togglePhoneVisibility" :icon="Hide" />
      <el-button v-else @click="togglePhoneVisibility" :icon="View" />
    </template>
  </el-input>
</template>

<style>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
  padding-left: 0;
  padding-right: 0;
  width: 85px;
}

.el-form-item.is-error .input-with-select .el-input-group__prepend {
  border: 1px solid #ff0707;
}

.input-with-select .el-input-group__append {
  width: 35px;
  padding: 0 10px;
}

.input-with-select .el-input-group__append > btn {
  color: red;
}

.input-with-select .el-input__wrapper {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}

.el-input .el-input--suffix {
  margin-top: -2px;
}

.phone_number {
  display: flex;
  justify-content: space-between;
  min-width: 100px;
  column-gap: 10px;
}
.phone_number .country_code::before {
  content: '+';
}

.input-with-select .el-input__wrapper:first-of-type::before {
  content: '+';
}
</style>
