<template>
  <el-dialog v-model="isVisible" class="tabs-dialog" v-bind="$attrs" @close="close" draggable overflow destroy-on-close>
    <el-tabs class="m_tabs">
      <el-tab-pane label="设置聊天室名称" class="m_tabs_pane">
        <div class="wrap">
          <el-input v-model="roomName" placeholder="请输入聊天室名称" maxlength="24" show-word-limit />
        </div>
        <div class="footer">
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <UserListComponent></UserListComponent>
</template>
<script lang="ts" setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const isVisible = computed(() => props.isVisible)
const roomName = ref('')

const emit = defineEmits(['callBack', 'refreshPage'])

const close = () => {
  emit('callBack')
}

const confirm = () => {
  emit('callBack', roomName)
}
</script>
<style lang="less" scoped>
.wrap {
  width: 60%;
  margin: 50px auto;
  :deep(.el-input__wrapper) {
    padding: 10px !important;
  }
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  margin-bottom: 50px;
}
</style>
