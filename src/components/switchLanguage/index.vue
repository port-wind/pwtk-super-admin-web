<!-- 切换语言 -->
<template>
  <div id="switch_language">
    <el-dropdown @command="handleCommand">
      <el-icon v-if="currentLanguage === 'zh-cn'" :size="50">
        <IconBaseChina />
      </el-icon>
      <el-icon v-else-if="currentLanguage === 'en'" :size="50">
        <IconBaseUK />
      </el-icon>
      <el-icon v-else="currentLanguage === 'zh-tw'" :size="50">
        <IconBaseHK />
      </el-icon>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="zh-cn" :disabled="currentLanguage === 'zh-cn'">中文简体</el-dropdown-item>
          <el-dropdown-item command="en" :disabled="currentLanguage === 'en'">English</el-dropdown-item>
          <el-dropdown-item command="zh-tw" :disabled="currentLanguage === 'zh-tw'">中文繁体</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import IconBaseChina from '~icons/twemoji/flag-china'
import IconBaseUK from '~icons/twemoji/flag-united-kingdom'
import IconBaseHK from '~icons/twemoji/flag-hong-kong-sar-china'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()
import { useAppStore } from '@/stores/changeI18n'
const appStore = useAppStore()

const emit = defineEmits(['language'])

//获取当前的语言是什么,让页面标签el-dropdown-item变成灰色不然点击,只能让其点击没选中的
const currentLanguage = computed(() => {
  return i18n.locale.value
})

//command用法很简单,绑定在el-dropdown-item标签的"zh"值和"en",让其发生变化时候做出其他操作,类似监听标签属性
//和在便签中定义函数传参类似的
const handleCommand = (val: string) => {
  //command获取值切换语音
  i18n.locale.value = val
  console.log(i18n.locale.value)
  localStorage.setItem('language', val)
  emit('language', val)
  document.title = i18n.t('login.title')
  appStore.changeLanguage(val)
}
</script>

<style lang="scss" scoped>
.el-dropdown {
  position: absolute;
  right: 10px;
}
.el-icon {
  margin-top: 3px;
}
</style>
