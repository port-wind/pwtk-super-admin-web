<template>
  <el-dialog
    v-model="isVisible"
    class="tabs-dialog"
    v-bind="$attrs"
    @close="cancel"
    draggable
    overflow
    destroy-on-close
  >
    <el-tabs v-model="activeTab" class="m_tabs">
      <el-tab-pane label="修改标签" name="basic" class="m_tabs_pane" v-loading="isLoading">
        <el-form :model="tagFormData" :rules="rules" ref="editFormRef" class="dialog-form">
          <el-row justify="center" class="customer-tag-header-item" style="margin-left: 5%; margin-right: 5%">
            <el-col :span="18">
              <div class="customer-tag-header">
                <span style="font-weight: 900">标签类型</span>
                <span style="font-weight: 900">标签名称</span>
              </div>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>
          <el-row
            v-for="(tag, index) in tagFormData.tags"
            :key="tag.key"
            justify="center"
            style="border-bottom: 1px solid #e0e0e0; margin-left: 5%; margin-right: 5%"
          >
            <el-col :span="9" style="padding: 10px 20px 0 20px">
              <el-form-item :prop="'tags.' + index + '.flag'" :rules="rules.flag">
                <el-select v-model="tag.flag" placeholder="标签类型">
                  <el-option v-for="item in flagOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9" style="padding: 10px 20px 0 20px">
              <el-form-item :prop="'tags.' + index + '.tagName'" :rules="rules.tagName">
                <el-input v-model="tag.tagName" placeholder="标签名称" />
              </el-form-item>
            </el-col>
            <el-col :span="2" style="padding: 10px 0">
              <div v-if="addMode" style="display: flex; justify-content: center; align-items: center">
                <el-button link @click="addTag" style="color: blue" v-if="index === 0">增加</el-button>
                <el-button link @click="removeTag(tag)" style="color: red" v-else>删除</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div class="button-row">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="handleSave">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import showErrorMessage from '@/utils/showErrorMessage'
import { reqCustomerTags, updateCustomerTags, uploadCustomerTags } from '@/api/user/customerTags'
const modalsStore = useModalsStore()
const mode = computed(() => (modalsStore?.editCustomerTagModal?.modalData?.tagId ? 'edit' : 'add'))
const addMode = computed(() => mode.value === 'add')
const editMode = computed(() => mode.value === 'edit')

const isLoading = ref(false)
const editFormRef = ref()
const isVisible = computed(() => modalsStore.editCustomerTagModal.isVisible)
const activeTab = computed(() => modalsStore.editCustomerTagModal.activeTab)
const savaApi = computed(() => (editMode.value ? updateCustomerTags : uploadCustomerTags))
const tagFormData = reactive({
  tags: [
    {
      key: Date.now(),
      tagName: '',
      flag: '',
      tagId: null
    }
  ]
})
const flagOptions = ref<any[]>([
  {
    label: '用户标签',
    value: '用户标签'
  },
  {
    label: '平台标签',
    value: '平台标签'
  },
  {
    label: '内容标签',
    value: '内容标签'
  }
])
const emit = defineEmits(['callBack', 'refreshPage'])

const rules = {
  tagName: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  flag: [{ required: true, message: '请选择标签类型', trigger: 'change' }]
}

const cancel = () => {
  modalsStore.editCustomerTagModal = {
    isVisible: false,
    activeTab: 'basic',
    modalData: null
  }
}

const addTag = () => {
  tagFormData.tags.push({
    key: Date.now(),
    tagName: '',
    flag: '',
    tagId: null
  })
}

const removeTag = (tag) => {
  const index = tagFormData.tags.indexOf(tag)
  if (index !== -1) {
    tagFormData.tags.splice(index, 1)
  }
}

const handleSave = async () => {
  try {
    const valid = await editFormRef.value.validate()
    if (!valid) {
      return
    }
    const editReq = [...tagFormData.tags].map((item) => ({
      tagId: item.tagId,
      tagName: item.tagName,
      flag: item.flag
    }))[0]
    const addReq = [...tagFormData.tags].map((item) => ({
      tagName: item.tagName,
      flag: item.flag
    }))
    const response = await savaApi.value(addMode.value ? addReq : editReq)
    if (response.success) {
      ElMessage.success(addMode.value ? '新增成功' : '更新成功')
      cancel()
      emit('refreshPage')
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

const initializeFormData = async () => {
  if (mode.value === 'edit') {
    const data = modalsStore.editCustomerTagModal.modalData
    tagFormData.tags = [
      {
        key: Date.now(),
        tagName: data?.tagName,
        flag: data?.flag,
        tagId: data?.tagId
      }
    ]
  }
}

onMounted(async () => {
  await initializeFormData()
})
</script>

<style lang="scss" scoped>
.tags-dialog {
  .dialog-form {
    margin-top: 20px;
  }
  .button-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
.customer-tag-header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 16px;
  height: 60px;
}
.customer-tag-header-item {
  color: #333;
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
}
</style>
