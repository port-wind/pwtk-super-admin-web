<template>
  <div id="menu">
    <el-aside
      v-show="isFlexible"
      class="aside"
      :class="isunfold ? '' : 'fold'"
      style="height: 100%; display: flex; flex-direction: column"
    >
      <div class="name">
        <img :src="logo" alt="" />
        <div style="height: 25px" v-if="props.isunfold">
          <span>{{ t('com.NetflixDuomeng') }}</span>
          <div>version: {{ version }}</div>
        </div>
      </div>
      <el-scrollbar>
        <el-menu
          :unique-opened="true"
          :collapse="!props.isunfold"
          style="display: flex; flex-direction: column; height: 100%"
          active-text-color="#ffd04b"
          background-color="#17173F"
          :collapse-transition="false"
          class="el-menu-vertical-demo"
          :default-active="route.path"
          :router="true"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
        >
          <template v-for="(menu, index) in menuliststore.labelOption" :key="index">
            <el-sub-menu v-if="menu.children" :index="menu.index" :route="menu.path">
              <template #title>
                <span>{{ menu.name }}</span>
              </template>
              <el-menu-item :index="m.index" v-for="(m, i) of filteredChildren(menu.children)" :key="i" :route="m.path">
                {{ m.name }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="menu.index" :route="menu.path">
              <template #title>
                <span>{{ menu.name }}</span>
              </template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <div class="flexible" @click="isFlexible = !isFlexible">
      <el-button v-if="isFlexible" type="primary">
        <el-icon>
          <arrow-left-bold />
        </el-icon>
      </el-button>
      <el-button v-else type="primary">
        <el-icon>
          <arrow-right-bold />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
import logoImg from '@/assets/images/logo.png'
import { useMenuListStore } from '@/stores/menulist'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'

// 网站logo
const logo = webConfigApi ? webConfigApi?.logoPath : logoImg
const { version } = webConfigApi
const route = useRoute()
const props = defineProps({ isunfold: Boolean })
// const defaultActive = ref(); //默认路由
const menuliststore = useMenuListStore()
const excludedPaths = [
  '/user/pointDetail',
  '/user/starDetail',
  '/chatroomSystem/chatroomUserManagement',
  '/chatroomSystem/chatroomMsgManagement',
  '/chatroomSystem/batchRoomCreator',
  '/photosSys/batchIssueAdd',
  '/voiceRoomManagement/voiceRoomUserManagement',
  '/voiceRoomManagement/voiceRoomMessageManagement',
  '/photosSys/batchIssueAdd'
]

const filteredChildren = computed(() => {
  return (children) => children.filter((child) => !excludedPaths.includes(child.index))
})
const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath)
}

const isFlexible = ref(true)
const menuStore = useMenuListStore()

onMounted(async () => {
  await menuStore.getSiteMenu()
})

watch(
  () => menuliststore,
  (newVal) => {},
  { immediate: true, deep: true }
)
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
<style lang="less" scoped>
#menu {
  height: 100%;
  position: relative;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  .aside {
    width: 200px;
    transition: all 0.3s;
    background-color: #17173f;
  }

  .fold {
    width: 69px;
    overflow: hidden;
  }

  .name {
    color: #ffffff;
    display: flex;
    align-items: center;
    width: 199px;
    height: 80px;
    flex-wrap: nowrap;
    overflow: hidden;
    border-radius: solid 1px #ffffff;

    i {
      font-weight: bold;
      font-size: 18px;
    }

    img {
      width: 46px;
      // border-radius: 46px;
      margin-right: 10px;
      margin-left: 10px;
    }
  }

  // 自定义菜单样式
  .el-menu-item {
    background-color: #3f3f99;
  }

  .el-menu-item:hover {
    background-color: #7390fd;
  }

  .el-menu-item.is-active {
    background-color: #7390fd !important;
    color: white;
  }

  :deep(.el-scrollbar__view) {
    > .el-menu {
      > li:first-child {
        background-color: #17173f;
      }
    }
  }
  .flexible {
    position: absolute;
    top: 48%;
    right: -20px;
    .el-button {
      width: 20px;
      height: 30px;
      padding: 0;
      margin: 0;
      border-radius: 0;
      .el-icon {
        font-size: 20px;
      }
    }
  }
}

:deep(.el-menu--collapse) {
  width: 70px;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}

:deep(.el-menu) {
  border-right: none;
}
</style>
