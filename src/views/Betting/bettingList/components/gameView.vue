<script setup lang="ts">
import { defineProps, computed } from 'vue'

interface IDefineProps {
  zodiacList: string[]
}
const props = defineProps<IDefineProps>()

const style = computed(() => {
  const arr = ['合', '头', '段', '左', '右', '家禽', '兽禽', '天肖', '地肖', '尾']
  function containsJudgmentValue(zodiacList, arr) {
    return zodiacList.some((zodiac) => arr.some((judgment) => zodiac.includes(judgment)))
  }
  const result = containsJudgmentValue(props.zodiacList, arr)
  return result ? 'pure_text' : ''
})
</script>

<template>
  <ul class="game_list">
    <li :class="style" v-for="item in props.zodiacList">
      {{ item }}
    </li>
  </ul>
</template>

<style lang="less" scoped>
.game_list {
  padding-left: 0;
  padding-top: 10px;
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  gap: 20px;
  > li {
    background-color: green;
    border-radius: 100%;
    height: 30px;
    width: 30px;
    display: inline-block;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    color: white;
    &.pure_text {
      padding: 5px;
      border-radius: 10px;
      height: initial;
      width: initial;
      line-height: initial;
    }
  }
}
</style>
