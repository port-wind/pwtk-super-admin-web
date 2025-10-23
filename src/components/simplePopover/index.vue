<script setup lang="ts">
interface IProps {
  modelValue: string
}
const props = defineProps<IProps>()
</script>

<template>
  <el-popover
    v-bind="$attrs"
    :width="300"
    placement="top-start"
    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
  >
    <template #reference>
      <div style="height: 24px">
        <div class="post-content g-text-nowrap-ellipsis" v-html="props.modelValue"></div>
      </div>
    </template>
    <template #default>
      <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
        <p class="demo-rich-content__desc" style="margin: 0" v-html="props.modelValue"></p>
      </div>
    </template>
  </el-popover>
</template>

<style lang="less" scoped></style>
