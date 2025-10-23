<script setup lang="ts">
type Color = 'R' | 'G' | 'B'

type ZodiaSigns = '鼠' | '牛' | '虎' | '兔' | '龙' | '蛇' | '马' | '羊' | '猴' | '鸡' | '狗' | '猪'

interface Props {
  color?: Color
  number?: number
  zodiacSigns?: ZodiaSigns
}

const props = defineProps<Props>()
const numberShow = computed(() => props.number?.toString().padStart(2, '0') ?? '')
const mappedColor = computed(() => {
  switch (props.color) {
    case 'R':
      return 'red'
    case 'G':
      return 'green'
    case 'B':
      return 'blue'
    default:
      return ''
  }
})
</script>

<template>
  <div class="_wrapper" v-if="props.color && props.number != null && props.zodiacSigns">
    <!-- <div :class="['ball', props.color]">{{ props.number.toString().padStart(2, '0') }}</div>
    <span>{{ zodiacSigns }}</span> -->
    <SvgLottoBall :size="30" :wholeColor="mappedColor" :number="numberShow" />
    <span style="display: inline-flex; align-items: center; margin: 0">{{ zodiacSigns }}</span>
  </div>
  <div class="_wrapper" v-else>
    <SvgLottoBall :size="30" :wholeColor="'gray'" :number="0" />
    <span style="display: inline-flex; align-items: center; margin: 0; width: 12px"></span>
  </div>
</template>
<style scoped>
._wrapper {
  display: inline-flex;
  align-items: center;
}

.ball {
  width: 17px;
  height: 17px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  /* 居中 */
  display: inline-block;
  text-align: center;
  line-height: 17px;
  border-radius: 50%;
}

.G {
  background-color: #67c23a;
}

.R {
  background-color: #f56c6c;
}

.B {
  background-color: #409eff;
}

span {
  font-size: 12px;
  color: #666;
  margin-left: 2px;
  margin-right: 4px;
  font-weight: bold;
}
</style>
