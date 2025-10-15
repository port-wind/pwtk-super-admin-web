<template>
  <!-- ページネーションコンポーネント -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[15, 30, 50, 100]"
    :page-size="pageSize"
    layout="prev, pager, next, jumper, ->, sizes, total"
    :total="total"
  ></el-pagination>
</template>

<script setup lang="ts">
interface SearchForm {
  sortName: string
  sortOrder: string
  domain: string
  ownerUserId: string
  websiteRef: string
  langCodes: string[]
  areaCodes: string[]
  websiteInnerName: string
  websiteTitle: string
}
import { defineProps, inject, computed } from 'vue'
// 注入 fetchData 方法
const fetchData = inject('fetchData') as (params: any) => void
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['update:current-page', 'update:page-size'])
// 注入搜索表单状态
const searchForm = inject('searchForm') as {
  model: { value: SearchForm }
  update: (newFormModel: Partial<SearchForm>) => void
}
// 父コンポーネントからの検索入力の変数を受けとてからすぐにバックにリクエストすべきだ。
// 创建一个计算属性来访问最新的搜索表单数据
const currentSearchForm = computed(() => searchForm.model.value)
const handleSizeChange = (size: number) => {
  console.log('handSonSizeChange')
  emit('update:page-size', size)
  fetchData({ ...currentSearchForm.value, size, page: 1 })
}
const handleCurrentChange = (page: number) => {
  emit('update:current-page', page)
  fetchData({ ...currentSearchForm.value, size: props.pageSize, page })
}
</script>
