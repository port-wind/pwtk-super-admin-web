<template>
  <div id="home" :class="lang">
    <el-container>
      <el-container class="content">
        <Menu :isunfold="isunfold" />
        <el-container>
          <el-header style="padding: 0"><Header @toggleClick="toggleClick" /></el-header>
          <el-main>
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component v-if="$route.meta.keepAlive" :is="Component" :key="$route.name" />
              </keep-alive>
              <component v-if="!$route.meta.keepAlive" :is="Component" :key="$route.name" />
            </router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { menupermissions } from '@/api/system/index'
import { setPermissionsStore } from '@/stores/index'

const isunfold = ref(true)
const toggleClick = (data) => {
  isunfold.value = data
}
const lang = localStorage.getItem('language')
const permissions = setPermissionsStore()
// 获取权限集
const getPermissions = () => {
  menupermissions().then((res) => {
    // console.log(res, '权限')
    if (res.success) {
      permissions.setPermissions(JSON.parse(JSON.stringify(res.data.permList)))
    }
  })
}
onMounted(() => {
  getPermissions()
})
</script>

<style scoped lang="less">
#home {
  width: 100%;
  height: 100%;
  .el-container {
    height: 100%;
    background: #fff;
  }
  :deep(.el-header) {
    height: auto;
  }
  .el-main {
    padding: 10px 20px 0 20px;
  }
}
</style>
