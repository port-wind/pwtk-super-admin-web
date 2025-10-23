<template>
  <!-- 表格组件 -->
  <el-table
    :data="tableData"
    v-loading="isLoading"
    :element-loading-text="elementLoadingText"
    :element-loading-spinner="elementLoadingSpinner"
    :element-loading-background="elementLoadingBackground"
    :element-loading-svg="elementLoadingSvg"
    :element-loading-svg-view-box="elementLoadingSvgViewBox"
    :height="tableHeight"
    @row-click="handleRowClick"
    style="width: 100%; height: 100%"
    v-bind="$attrs"
  >
    <el-table-column v-if="showSelection" type="selection" width="55"></el-table-column>
    <!-- 渲染一般列和自定义插槽列 -->
    <template v-for="(item, index) in tableOption" :key="index">
      <!-- 表格列 -->
      <el-table-column
        v-if="item.prop && !item.action"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :min-width="item.minWidth"
        :max-width="item.maxWidth"
        :align="item.align"
        :fixed="item.fixed"
        :type="item.type"
        v-bind="{
          ...(item.showOmission ? { 'show-overflow-tooltip': { disabled: true } } : {}),
          ...item.columAttr
        }"
      >
        <template #default="scope">
          <!-- 自定义插槽 -->
          <slot v-if="item.slot" :name="item.slot" :scope="scope"></slot>

          <!-- 日期格式化 -->
          <template v-else-if="item.dateName">
            {{
              item.dateName
                ? unitFormatDate(
                    typeof scope.row[item.dateName] === 'string'
                      ? Number(scope.row[item.dateName])
                      : scope.row[item.dateName],
                    item.formatStr || 'yyyy-MM-dd'
                  )
                : null
            }}
          </template>

          <!-- 图片数据  -->
          <template v-else-if="item.cellType === 'image'">
            <el-image v-if="item.image" class="m_image" :src="item.image.src" />
          </template>

          <!-- JSON数据显示  只要在JSON中配置了选项就可以在这里遍历显示-->
          <template v-else-if="item.json">
            {{ jsonOptions[item.json.sourceName][scope.row[item.json.keyName]] }}
          </template>

          <!-- 可复制文本 -->
          <template v-else-if="item.isCopyText">
            <span>{{ scope.row[item.prop!] }}</span>
            <copy :content="scope.row[item.prop!]" />
          </template>
          <template v-else-if="item.truncateText">
            <span>{{ truncateText(scope.row[item.prop!], item.truncateTextLength) }}</span>
          </template>
          <!-- 普通文本 -->
          <span v-else>{{ scope.row[item.prop!] }}</span>
        </template>
      </el-table-column>
    </template>

    <!-- 渲染操作列 -->
    <el-table-column
      v-if="actionOption"
      :label="actionOption.label"
      :width="actionOption.width"
      :align="actionOption.align"
      fixed="right"
    >
      <template #default="scope">
        <slot name="action" :scope="scope"></slot>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页组件 -->
  <div v-if="pagination && !isLoading" class="pagination" :style="{ justifyContent }">
    <el-pagination
      :currentPage="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script lang="ts" setup>
import { PropType, computed, ref, watch, onMounted } from 'vue'
import { unitFormatDate } from '@/utils/dateFormat/index'
import jsonOptions from '@/const/options.json'
import { TableOptions } from './types'
import { toLine } from '@/utils/table/index'
import { truncateText } from '@/utils/dataFormat'
import i18n from '@/i18n'
import { min } from 'date-fns'
import { cloneDeep } from 'lodash-es'
const { t } = i18n.global as any

// 定义props
let props = defineProps({
  // 表格配置选项
  options: {
    type: Array as PropType<TableOptions[]>,
    required: true
  },
  // 表格数据
  data: {
    type: Array as () => any[],
    required: true
  },
  // 加载文案
  elementLoadingText: {
    type: String
  },
  // 加载图标名
  elementLoadingSpinner: {
    type: String
  },
  // 加载背景颜色
  elementLoadingBackground: {
    type: String
  },
  // 加载图标是svg
  elementLoadingSvg: {
    type: String
  },
  // 加载图标是svg的配置
  elementLoadingSvgViewBox: {
    type: String
  },
  // 是否显示分页
  pagination: {
    type: Boolean,
    default: false
  },
  // 显示分页的对齐方式
  paginationAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  // 当前是第几页
  currentPage: {
    type: Number,
    default: 1
  },
  // 当前一页多少条数据
  pageSize: {
    type: Number,
    default: 15
  },
  // 显示分页数据多少条的选项
  pageSizes: {
    type: Array,
    default: () => [15, 30, 50, 100]
  },
  // 数据总条数
  total: {
    type: Number,
    default: 0
  },
  //表格高度
  tableHeight: {
    type: String
  },
  isLoading: {
    type: Boolean
  },
  showSelection: {
    // 新增参数：控制选择列是否显示
    type: Boolean,
    default: false
  }
})

// 定义emits
let emits = defineEmits(['size-change', 'current-change', 'row-click'])

// 分页的每一页数据变化
let handleSizeChange = (val: number) => {
  emits('size-change', val)
}

// 分页页数改变
let handleCurrentChange = (val: number) => {
  emits('current-change', val)
}

// 行点击事件处理函数
let handleRowClick = (row: any, column: any, event: Event) => {
  emits('row-click', row)
}

// 拷贝一份表格的数据
let tableData = ref<any[]>(cloneDeep(props.data))

// 监听data的变化，更新tableData
watch(
  () => props.data,
  (val) => {
    tableData.value = cloneDeep(val)
  },
  { deep: true }
)

// 过滤操作项之后的配置
let tableOption = computed(() => props.options.filter((item) => !item.action))

// 操作项
let actionOption = computed(() => props.options.find((item) => item.action))

// 是否在加载中
// let isLoading = computed(() => !props.data || !props.data.length)

// 表格分页的排列方式
let justifyContent = computed(() => {
  if (props.paginationAlign === 'left') return 'flex-start'
  else if (props.paginationAlign === 'right') return 'flex-end'
  else return 'center'
})

// // 点击行的事件
// let rowClick = (row: any, column: any) => {
//   // 判断是否是点击的操作项
//   if (column.label === actionOption.value!.label) {
//     // 如果有需要可以在这里添加操作项的处理逻辑
//   }
// }
</script>

<style lang="css" scoped>
.m_image {
  width: 48px;
  height: 48px;
}
</style>
