<!-- SvgLottoBall.vue -->
<template>
  <div class="svg-lotto-ball-container">
    <svg
      :width="size + 'px'"
      :height="size + 'px'"
      viewBox="0 0 60 60"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <circle :id="'path-1-' + uniqueId" cx="25.7678571" cy="25.7678571" r="25.7678571"></circle>
        <filter
          x="-11.6%"
          y="-11.6%"
          width="123.3%"
          height="123.3%"
          filterUnits="objectBoundingBox"
          :id="'filter-2-' + uniqueId"
        >
          <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
          <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0"
            type="matrix"
            in="shadowBlurOuter1"
          ></feColorMatrix>
        </filter>
        <linearGradient
          x1="36.0923423%"
          y1="66.7335304%"
          x2="73.9125845%"
          y2="-7.92687218%"
          :id="'linearGradient-3-' + uniqueId"
        >
          <stop :stop-color="colorLight" stop-opacity="0.975442526" offset="0%"></stop>
          <stop :stop-color="colorDark" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="15.1402379%"
          y1="59.3007393%"
          x2="72.6368947%"
          y2="5.0539727%"
          :id="'linearGradient-4-' + uniqueId"
        >
          <stop stop-color="#FFFFFF" offset="0%"></stop>
          <stop stop-color="#EAEAEA" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="55.8285348%"
          y1="50%"
          x2="85.1741293%"
          y2="79.2853393%"
          :id="'linearGradient-5-' + uniqueId"
        >
          <stop stop-color="#000000" stop-opacity="0" offset="0%"></stop>
          <stop stop-color="#000000" stop-opacity="0.421711101" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-646, -68)">
          <g transform="translate(650, 72)">
            <g>
              <g transform="translate(25.7679, 25.7679) scale(1, -1) translate(-25.7679, -25.7679)">
                <g>
                  <use
                    fill="black"
                    fill-opacity="1"
                    :filter="'url(#filter-2-' + uniqueId + ')'"
                    :xlink:href="'#path-1-' + uniqueId"
                  ></use>
                  <use fill="#FFFFFF" fill-rule="evenodd" :xlink:href="'#path-1-' + uniqueId"></use>
                </g>
                <path
                  d="M25.7678571,0 C29.059677,0 32.2073276,0.617262099 35.1013778,1.74235512 C35.960253,4.53984461 37.8582577,7.73543328 40.5936796,10.6688142 C43.6418656,13.9375935 47.0873922,16.1917552 50.0368595,17.0878971 C51.0072513,19.799586 51.5357143,22.722007 51.5357143,25.7678571 C51.5357143,31.3445408 49.7641803,36.5074604 46.7531726,40.7245559 C44.2651,41.4732295 41.5181117,42.875239 38.8879219,44.8572292 C36.6081025,46.5751963 34.7229676,48.4976271 33.3458294,50.4023789 C30.949673,51.1395507 28.4050295,51.5357143 25.7678571,51.5357143 C21.3334169,51.5357143 17.1606011,50.4155671 13.5169254,48.4427884 C12.4928972,46.2772299 10.9413882,43.9941345 8.94288313,41.8510001 C6.85896725,39.616274 4.58933919,37.8557677 2.41946999,36.6792099 C0.866788425,33.367082 0,29.6686942 0,25.7678571 C0,21.9849257 0.815181712,18.3923901 2.27946477,15.1563308 C5.55958586,14.8114283 9.86817042,12.3339912 13.5857403,8.34738562 C15.8044319,5.9681301 17.4722054,3.4163739 18.4809907,1.04503366 C20.7910052,0.364918642 23.2368155,0 25.7678571,0 Z"
                  :fill="'url(#linearGradient-3-' + uniqueId + ')'"
                ></path>
                <ellipse
                  :fill="'url(#linearGradient-4-' + uniqueId + ')'"
                  transform="translate(26.1578, 27.8832) rotate(7) translate(-26.1578, -27.8832)"
                  cx="26.1578493"
                  cy="27.8832295"
                  rx="19.0357143"
                  ry="16.6833333"
                ></ellipse>
              </g>
              <path
                d="M46.7295785,10 C49.9727984,14.3375634 51.8933604,19.7216023 51.8933604,25.5542125 C51.8933604,39.913616 40.2527639,51.5542125 25.8933604,51.5542125 C15.1810906,51.5542125 5.98192409,45.075847 2,35.8232552 Z"
                :fill="'url(#linearGradient-5-' + uniqueId + ')'"
              ></path>

              <!-- Text number with adjusted size -->
              <text
                x="25.7678571"
                y="30"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-weight="bold"
                :font-size="textFontSize"
                :fill="textColor"
                class="ball-number"
              >
                {{ number || '' }}
              </text>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

// Generate a unique ID for this component instance
const uniqueId = ref('')

onMounted(() => {
  uniqueId.value = Math.random().toString(36).substring(2, 9)
})

// Define props with script setup syntax
const props = defineProps({
  size: {
    type: Number,
    default: 30
  },
  number: {
    type: [Number, String],
    required: false
  },
  wholeColor: {
    type: String,
    default: 'blue'
  },
  customColorLight: {
    type: String,
    default: null
  },
  customColorDark: {
    type: String,
    default: null
  },
  customTextColor: {
    type: String,
    default: null
  }
})

// Calculate font size based on ball size
const textFontSize = computed(() => {
  return Math.max(12, props.size) // Adjusted ratio for better text sizing
})

// Color mapping with explicit return statements
const colorLight = computed(() => {
  if (props.customColorLight) return props.customColorLight

  // Map colors
  if (props.wholeColor === 'red') return '#FF6B6B'
  if (props.wholeColor === 'green') return '#6BFF6B'
  if (props.wholeColor === 'blue') return '#3894D6'
  if (props.wholeColor === 'yellow') return '#FFD166'
  if (props.wholeColor === 'purple') return '#9D66FF'
  if (props.wholeColor === 'orange') return '#FF9F66'
  if (props.wholeColor === 'gray') return '#808080'

  // Default color
  return '#3894D6'
})

const colorDark = computed(() => {
  if (props.customColorDark) return props.customColorDark

  // Map colors
  if (props.wholeColor === 'red') return '#9A0000'
  if (props.wholeColor === 'green') return '#008100'
  if (props.wholeColor === 'blue') return '#00397B'
  if (props.wholeColor === 'yellow') return '#B38600'
  if (props.wholeColor === 'purple') return '#4B0082'
  if (props.wholeColor === 'orange') return '#B35900'

  // Default color
  return '#00397B'
})

const textColor = computed(() => {
  if (props.customTextColor) return props.customTextColor
  return '#000' // White text for better contrast on most colors
})
</script>

<style lang="less" scoped>
// Color variables
@ball-blue: #3894d6;
@ball-blue-dark: #00397b;
@ball-red: #ff6b6b;
@ball-red-dark: #9a0000;
@ball-green: #6bff6b;
@ball-green-dark: #008100;
@ball-yellow: #ffd166;
@ball-yellow-dark: #b38600;
@ball-purple: #9d66ff;
@ball-purple-dark: #4b0082;
@ball-orange: #ff9f66;
@ball-orange-dark: #b35900;
@ball-white: #ffffff;
@ball-white-shadow: #eaeaea;

.svg-lotto-ball-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 2px;

  // Hover effect
  &:hover {
    filter: brightness(1.05);
  }

  // Transition mixin
  .transition(@property: all, @duration: 0.3s) {
    transition: @property @duration ease;
  }

  .transition(transform, 0.2s);

  &:active {
    transform: scale(0.95);
  }

  // Style for the number
  .ball-number {
    transform: translateY(-2px); // Slight vertical adjustment
    user-select: none;
  }
}
</style>
