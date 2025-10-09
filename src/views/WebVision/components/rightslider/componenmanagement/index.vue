<template>
  <div class="componenManagement">
    <p class="Prompt">*底部导航组件为固定页面底部，无需拖拽调整位置*</p>
    <div v-show="data.length > 0" class="selectAll">
      <el-checkbox class="selectAll-checkbox" v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
      <el-button size="small" type="danger" :disabled="!hasSelectedItems" @click.stop="deleteSelected">删除</el-button>
    </div>

    <vuedraggable
      v-model="data"
      item-key="index"
      :forceFallback="true"
      :animation="200"
      :delay="400"
      filter=".delDragitem"
    >
      <template #item="{ element, index }">
        <div :class="element.text === '底部导航' ? 'item delDragitem' : 'item'">
          <el-checkbox v-model="element.selected" @change="handleItemSelect"></el-checkbox>
          <p>{{ element.text }}</p>
          <el-popconfirm title="您确定要删除该组件吗?" icon="Warning" icon-color="red" @confirm="onConfirms(index)">
            <template #reference>
              <div class="cursor-pointer">
                <el-icon size="large"><Delete /></el-icon>
              </div>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </vuedraggable>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, PropType } from 'vue'
import vuedraggable from 'vuedraggable'
import { Delete } from '@element-plus/icons-vue'
import { PageComponent } from '@/views/WebVision/type'
import { delTemCom } from '@/api/webgw/template'
import { delSitCom } from '@/api/webgw/websit'

const props = defineProps({
  datas: {
    type: Array,
    required: true
  },
  pageModel: {
    type: String
  }
})

onMounted(() => {
  // console.log('right_management', props.datas)
})

const emit = defineEmits(['componenmanagement'])

const data = ref<PageComponent[]>(props.datas as PageComponent[])
const selectAll = ref(false)

const hasSelectedItems = computed(() => {
  return data.value.some((item) => item.selected)
})

const handleSelectAll = (val: boolean) => {
  data.value.forEach((item) => {
    item.selected = val
  })
}

const handleItemSelect = (event: Event) => {
  // event.stopPropagation()
  selectAll.value = data.value.every((item) => item.selected)
}
const deleteArray = ref<string[]>([])

const deleteComponents = async (componentIds: string[]) => {
  const deleteApi = props.pageModel === 'templateMode' ? delTemCom : delSitCom

  try {
    const res = await deleteApi({ componentId: componentIds })
    if (res.success) {
      ElMessage.success('删除成功')
      return true
    } else {
      ElMessage.error(res.errMessage || '删除失败')
      return false
    }
  } catch (err) {
    console.error('删除出错:', err)
    ElMessage.error('删除过程中发生错误')
    return false
  }
}

const deleteSelected = async () => {
  const selectedIds = data.value
    .filter((item) => item.selected)
    .map((item) => item.componentId)
    .filter(Boolean) as string[]

  if (await deleteComponents(selectedIds)) {
    data.value = data.value.filter((item) => !item.selected)
    emit('componenmanagement', data.value)
  }
}

const onConfirms = (index: number) => deleteItem(index)

const deleteItem = async (index: number) => {
  const componentId = data.value[index].componentId

  if (!componentId) {
    ElMessage.error('无效的组件ID')
    return
  }

  if (await deleteComponents([componentId])) {
    data.value.splice(index, 1)
    emit('componenmanagement', data.value)
  }
}

watch(
  [() => props.datas, data],
  ([newProps, newData]) => {
    if (newProps !== newData) {
      data.value = newProps as PageComponent[]
    }
    emit('componenmanagement', newData)
  },
  { deep: true }
)
</script>
<style scoped lang="less">
/* 局部样式 */
:deep(.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}
/* 组件管理 */
.componenManagement {
  width: 100%;
  left: 0;
  top: 0;
  box-sizing: border-box;

  .Prompt {
    text-align: center;
    color: #aca8a8;
    line-height: 2rem;
  }
  .selectAll {
    // margin: 0 0 10px 10px;
    padding: 0 0 10px 10px;
    display: flex;
    justify-content: space-between;
  }

  /* 选项 */
  .item {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 14px;
    cursor: all-scroll;
    color: #323233;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 4px 0 rgba(10, 42, 97, 0.2);
    margin-bottom: 10px;
    i {
      color: #999;
    }
  }
  .delDragitem {
    background-color: rgba(10, 42, 97, 0.2);
    cursor: no-drop;
  }

  .cursor-pointer {
    height: 100%;
    line-height: 2.5rem;
    width: 1.5rem;
    cursor: pointer;
    text-align: center;
  }
}
</style>
