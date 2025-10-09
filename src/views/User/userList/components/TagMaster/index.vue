<template>
  <el-collapse v-model="activeNames" @change="handleChange" style="height: 300px; overflow-y: auto">
    <el-collapse-item v-for="(tags, category) in customerTags" :key="category" :title="category" :name="category">
      <el-button
        v-for="tag in tags"
        :key="tag.tagId"
        :type="isTagSelected(tag.tagId) ? 'primary' : 'info'"
        round
        plain
        @click="toggleTag(tag.tagId)"
      >
        {{ tag.tagName }}
      </el-button>
    </el-collapse-item>
  </el-collapse>
  <div class="button-row">
    <el-button @click="cancle">取消</el-button>
    <el-button type="primary" :loading="isLoading" @click="handleSave">提交</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getAllCustomerTags, uploadCustomerTagsRelation } from '@/api/user/customerTags'
import { reqUserInfo } from '@/api/user'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const props = defineProps<{
  userId: number
}>()
const activeNames = ref<string[]>([])
const customerTags = ref<Record<string, any[]>>({})
const selectedTags = ref<string[]>([])
const isLoading = ref<boolean>(false)
const emit = defineEmits(['refresh', 'close'])
const handleChange = (val: string[]) => {
  console.log(val)
}
const reset = () => {
  activeNames.value = []
  customerTags.value = {}
  isLoading.value = false
  selectedTags.value = []
}
const isTagSelected = (tagId: string): boolean => {
  return selectedTags.value.includes(tagId)
}

const handleSave = async () => {
  isLoading.value = true
  try {
    const res = await uploadCustomerTagsRelation({
      userId: props.userId,
      userTagList: selectedTags.value
    })
    if (res.success) {
      ElMessage.success('提交成功')
      emit('refresh')
      emit('close')
    } else {
      ElMessage.error('提交失败')
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const cancle = () => {
  emit('close')
}
const toggleTag = (tagId: string) => {
  if (isTagSelected(tagId)) {
    selectedTags.value = selectedTags.value.filter((id) => id !== tagId)
  } else {
    selectedTags.value.push(tagId)
  }
}

onMounted(async () => {
  try {
    const res = await getAllCustomerTags()
    if (res.success && res.data) {
      customerTags.value = res.data
      const userTagsRes = await reqUserInfo(props.userId)
      if (userTagsRes.success && userTagsRes.data) {
        selectedTags.value = userTagsRes.data.tags.map((tag: any) => tag.tagId)
      }
      // Initialize selectedTags with tag IDs where state === 'y'
    }
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped>
.el-button {
  margin: 5px;
}
</style>
