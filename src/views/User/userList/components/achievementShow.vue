<template>
  <!-- 匿名访客 -->
  <div id="system_account" class="main_container" v-loading="isLoading">
    <el-scrollbar>
      <section v-if="recentMedal.length > 0">
        <h2 class="achievement-title">最近获得</h2>
        <div class="achievement-list">
          <div v-for="medal in recentMedal" :key="medal.id" class="medal-container">
            <img
              :src="getImageUrl(getMedalImageName(medal))"
              :alt="medal.name"
              :class="{ 'rotate-animation': medal.isRotating }"
            />
            <p>{{ medal.name }}</p>
          </div>
        </div>
      </section>
      <section v-for="(item, index) in platformGroups" :key="item.dictId">
        <h2 class="achievement-title">{{ item.type }}</h2>
        <div
          class="achievement-list"
          :ref="
            (el) => {
              item.listRef = el
            }
          "
          :class="{ rotated: item.expand }"
        >
          <div v-for="medal in item.list" :key="medal.dictId" class="medal-container">
            <img
              :src="getImageUrl(getMedalImageName(medal))"
              :alt="medal.name"
              @click="toggleMedalState(medal)"
              :class="{ 'rotate-animation': medal.isRotating }"
              @animationend="onAnimationEnd(medal)"
              :style="{ filter: medal.isOn ? 'grayscale(0)' : 'grayscale(1)' }"
            />
            <p>{{ medal.name }}</p>
          </div>

          <el-icon
            v-if="shouldShowExpandIcon(item)"
            class="expand-query-icon"
            :class="{ rotated: item.expand }"
            @click="handleExpand(item)"
          >
            <ArrowDownBold />
          </el-icon>
        </div>
      </section>
      <section>
        <el-button style="position: absolute; right: 20px; top: 10px" type="primary" @click="saveMedal">保存</el-button>
      </section>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { reqUserAchievement, setUserAchievement } from '@/api/user'
import { GetUserIdResponse } from '@/api/user/type'
import { idToBadgeMap } from '@/const/medalMap'
import showErrorMessage from '@/utils/showErrorMessage'
import { ref, onMounted, VNodeRef } from 'vue'
import { ArrowDownBold } from '@element-plus/icons-vue'
import { throttle } from 'lodash-es'
import { useManageSiteStore } from '@/stores/manageSiteStore'

interface Medal {
  dictId: string
  groupId: string
  name: string
  type: string
  desc: string
  flag: 0 | 1
  id: string
  sort: number
  dateTime: number
  isOn: boolean
  isRotating: boolean
}

interface PlatformGroups {
  dictId: string
  type: string
  sort: number
  list: Medal[]
  listRef: VNodeRef | null
  expand: boolean
}
const manageSite = useManageSiteStore()
const props = defineProps({
  accountInfo: {
    type: Object as () => GetUserIdResponse['data'] | null
  }
})
const windowWidth = ref(window.innerWidth)
const isLoading = ref(false)
const platformGroups = ref<PlatformGroups[]>([])
const recentMedal = ref<Medal[]>([])
const handleResize = throttle(
  () => {
    windowWidth.value = window.innerWidth
  },
  500,
  { leading: true, trailing: true }
)
// Function to get the correct image name based on medal state
const getMedalImageName = (medal: Medal) => {
  const baseImgName = idToBadgeMap.get(medal.id)?.imgName
  if (!baseImgName) return ''
  return baseImgName
}

// Function to toggle medal state and trigger rotation
const toggleMedalState = (medal: Medal) => {
  medal.isRotating = true // Start rotation
  // Do not toggle medal.isOn here
}

const onAnimationEnd = (medal: Medal) => {
  medal.isOn = !medal.isOn // Change image after rotation
  medal.isRotating = false // Reset rotation state
}

const getImageUrl = (name?: string) => {
  if (!name) return ''
  return new URL(`/src/assets/images/medals/${name}`, import.meta.url).href
}

const saveMedal = async () => {
  isLoading.value = true
  const medalDictIdList: string[] = []
  platformGroups.value.forEach((group) => {
    group.list.forEach((medal) => {
      if (medal.isOn) {
        medalDictIdList.push(medal.dictId)
      }
    })
  })
  const params = {
    targetUserId: props.accountInfo?.userId,
    medalDictIdList
  }
  try {
    const res = await setUserAchievement(params)
    if (res.success) {
      ElMessage.success('保存成功')
      await getAchievement()
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    showErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

const handleExpand = (item: PlatformGroups) => {
  item.expand = !item.expand
}
const shouldShowExpandIcon = computed(() => {
  return (item: PlatformGroups) => {
    // Add windowWidth.value as a dependency to force recomputation
    if (!item.listRef || !windowWidth.value) return false
    const itemWidth = 140
    return (item.listRef as unknown as HTMLDivElement).scrollWidth / itemWidth < item.list.length
  }
})
const getAchievement = async () => {
  isLoading.value = true
  try {
    const res = await reqUserAchievement({
      targetUserId: props.accountInfo?.userId!,
      manageSiteId: manageSite.manageSiteId
    })
    if (res.success) {
      platformGroups.value = res.data?.platformGroups || []
      recentMedal.value = (res.data?.myGroups as PlatformGroups[])
        .flatMap((group) => group.list as Medal[])
        .sort((a, b) => b.dateTime - a.dateTime)
        .slice(0, 3)
        .map((medal) => ({
          ...medal,
          isOn: true,
          isRotating: false
        }))
      // Initialize medal state properties
      platformGroups.value.forEach((group) => {
        group.listRef = null
        group.list.forEach((medal) => {
          medal.isOn = medal.flag === 1
          medal.isRotating = false // No rotation initially
        })
      })
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    showErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}
onMounted(async () => {
  window.addEventListener('resize', handleResize)
  await getAchievement()
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  handleResize.cancel()
})
</script>

<style lang="less" scoped>
.achievement-title {
  margin-left: 10px;
}
.main_container {
  position: relative;
}

.achievement-list {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 60px;
  height: 163px;
  overflow: hidden;
  position: relative;
}

.achievement-list.rotated {
  height: auto;
  overflow: visible;
}

.medal-container {
  cursor: pointer;
  margin: 10px;
}

.rotate-animation {
  animation: rotate 0.5s linear;
}

@keyframes rotate {
  from {
    transform: rotateY(0deg);
    filter: grayscale(1);
  }
  to {
    transform: rotateY(360deg);
    filter: grayscale(0);
  }
}

.expand-query-icon {
  transition: transform 0.3s ease;
  position: absolute;
  top: 60px;
  right: -10px;
}

.expand-query-icon.rotated {
  transform: rotate(180deg);
}

.expand-query-icon {
  margin-right: 10px;
  cursor: pointer !important;
}

.medal-container p {
  text-align: center;
}
</style>
