<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="sliderassembly">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item
        :title="items.title"
        :name="index + 1"
        v-for="(items, index) in datas"
        :key="index"
        :disabled="items.disabled"
      >
        <div
          :class="items.isLine ? 'component-list-line' : 'component-list-box '"
          draggable="true"
          @dragstart="drag($event)"
          @dragend="draGend($event)"
          :data-name="item.name"
          v-for="(item, ind) in items.comList"
          :key="ind"
        >
          <i class="iconfont" :class="item.icon" v-if="item.icon" />

          <p>{{ item.text }}</p>
        </div>
      </el-collapse-item>

      <el-collapse-item title="页面组件库" :name="2" accordion>
        <div
          :class="['component-list-line', { disabled: items.disabled }]"
          :draggable="!items.disabled"
          @dragstart="drag($event)"
          @dragend="draGend($event)"
          :data-name="items.name"
          v-for="(items, index) in fetchData"
          :key="index"
        >
          <el-icon><ElementPlus /></el-icon>
          <section>
            <p>{{ items.text }}</p>
            <span>{{ items.type }}</span>
          </section>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import type { TableData } from '@/api/webgw/webVision/types'
// import { getComponent } from '@/api/reqComponent.js';
import { ElMessage } from 'element-plus'
import { reqSysCompList } from '@/api/site/sysComponent'
import componentProperties from '@/utils/componentProperties' // 组件数据
import { leftComponentData } from './type'

const props = defineProps<{
  pointer: any
  pageComponent: leftComponentData[]
}>()

// 侧边栏组件显示
const activeNames = ref([2])

// 组件信息配置
const datas = reactive([
  {
    title: '基础组件库',
    disabled: true,
    isLine: false,
    comList: [
      {
        text: '商品搜索',
        type: '1-1',
        icon: 'icon-shangpinsousuo',
        name: 'commoditysearch'
      },
      {
        text: '标题文本',
        type: '1-3',
        icon: 'icon-Component-biaotiwenzi',
        name: 'captiontext'
      },
      // 其他组件信息
      {
        text: '自定义组件1',
        type: 'demo',
        vanIcon: 'orders-o',
        name: 'custommodule'
      }
    ]
  }
])

const fetchData = ref<leftComponentData[]>(props.pageComponent)

/**
 * 当用户开始拖动元素或选择文本时触发此事件
 *
 * @param {DragEvent} event event对象
 */
const drag = (event: DragEvent) => {
  /* 开启穿透 */
  props.pointer.show = true

  /* 传递参数 */
  const target = event.target as HTMLElement
  if (target.dataset.name) {
    // console.log('target.dataset.name', target.dataset.name)
    event.dataTransfer?.setData('componentName', target.dataset.name)
  }
}

/**
 * 当拖动操作结束时（释放鼠标按钮或按下退出键），会触发此事件
 *
 * @param {DragEvent} event event对象
 */
const draGend = (event: DragEvent) => {
  /* 关闭穿透 */
  props.pointer.show = false
}

onMounted(() => {
  // console.log('pageComponent', props.pageComponent)
  //  props.pageComponent
})
</script>

<style scoped lang="less">
/* 组件 */
.sliderassembly {
  width: 17rem;
  height: 100%;
  overflow-y: scroll;
  border-right: 1px solid #ebedf0;
  box-sizing: border-box;
  padding: 0 0.5rem;
  background: #fff;
  /* 滚动条 */
  &::-webkit-scrollbar {
    width: 1px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #155bd4;
  }
  :deep(.el-collapse-item__header),
  :deep(.el-collapse-item__wrap) {
    border-bottom: 0 !important;
  }

  /* 组件列表 */
  .component-list-box {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    width: 80px;
    height: 88px;
    margin-bottom: 8px;
    align-items: center;
    cursor: all-scroll;
    transition: all 0.3s;
    &:hover {
      background: #155bd4;
      border-radius: 2px;
      font-weight: 700;
      i,
      p,
      span {
        color: #fff;
      }
    }
    /* 图标 */
    i {
      font-size: 32px;
      width: 32px;
      height: 32px;
      line-height: 32px;
      color: #b0a8a8;
      margin-top: 4px;
    }
    /* 标题 */
    p {
      font-size: 12px;
      color: #323233;
      margin-top: 4px;
    }
    /* 数量 */
    span {
      color: #7d7e80;
      margin-top: 4px;
      font-size: 10px;
    }
  }
  .component-list-line {
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    height: 4rem;
    gap: 0.5rem;
    align-items: center;
    cursor: all-scroll;
    transition: all 0.3s;
    &:hover {
      background: #155bd4;
      border-radius: 2px;
      font-weight: 700;
      i,
      p,
      span {
        color: #fff;
      }
    }
    /* 图标 */
    i {
      font-size: 1.5rem;
      width: 2rem;
      // height: 32px;
      line-height: 32px;
      color: #b0a8a8;
      margin-top: 4px;
    }
    /* 标题 */
    p {
      font-size: medium;
      color: #323233;
      // margin-top: 4px;
    }
    /* 数量 */
    span {
      color: #7d7e80;
      margin-top: 4px;
      font-size: small;
    }
  }
  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
    i,
    p,
    span {
      color: #b0a8a8;
    }
    &:hover {
      background: #fff;
      border-radius: 2px;
      font-weight: 700;
      i,
      p,
      span {
        color: #b0a8a8;
      }
    }
  }
}
</style>
