<script setup lang="ts">
const props = defineProps<{
  queryForm: any
}>()
</script>

<template>
  <el-form :model="props.queryForm" width="100%" label-width="auto">
    <el-form-item label="帖子标题:" style="margin-bottom: 5px">
      <el-input v-model="props.queryForm.title" :disabled="true" />
    </el-form-item>
    <el-form-item style="margin-bottom: 7px">
      <section>
        <span style="margin-right: 10px">帖子内容</span>
      </section>
      <section style="width: 100%">
        <div class="post-content-text resizable-content">
          <div v-html="props.queryForm?.postContent || null"></div>
        </div>
      </section>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="less">
.post-content-text {
  height: 350px;
  border: 1px solid #999;
  padding: 0 10px;
  margin-top: 5px;
  overflow: auto;
}
.resizable-content {
  width: 100%;
  overflow: auto;
  resize: vertical;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
