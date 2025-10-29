<template>
  <div class="line" ref="line">折线</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
let line = ref()
//echarts.init(容器DOM节点)
onMounted(() => {
  //初始化echarts类的实例
  let mycharts = echarts.init(line.value)
  //配置对象
  let options = {
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  }

  //设置配置项
  mycharts.setOption(options)

  //监听浏览器窗口的变化
  window.addEventListener('resize', () => {
    //调用echarts实例的resize方法达到自适应
    mycharts.resize()
  })
})
</script>

<style scoped>
.line {
  height: 100%;
  width: 100%;
}
</style>
