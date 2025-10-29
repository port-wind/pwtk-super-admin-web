<template>
  <div class="custommodule">
    {{ datas.name }}
    <!-- {{ datas.jsonData }} -->
    <!-- <img
      :src="datas.img"
      alt=""
    /> -->
    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ComponentStyle } from './type'

// export default defineComponent({
//   name: 'CustomModule',
//   props: {
//     datas: {
//       type: Object as PropType<PageComponent>,
//       required: true
//     }
//   }
// })
// 接收 props
const props = defineProps({
  datas: { type: Object as PropType<ComponentStyle>, required: true }
})

onMounted(() => {
  // console.log('getdata', props.datas)
})
</script>

<style scoped lang="less">
.custommodule {
  position: relative;
  min-height: 3rem;
}
</style>
