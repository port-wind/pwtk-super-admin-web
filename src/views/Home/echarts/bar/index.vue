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
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: ['product', '2015', '2016', '2017'],
      source: [
        { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
        { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
        { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
        { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1 }
      ]
    },
    xAxis: { type: 'category' },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
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
