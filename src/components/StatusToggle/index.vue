<!-- StatusToggle.vue -->
<template>
  <el-switch
    :model-value="modelValue"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    :disabled="isProcessing"
    :loading="isProcessing"
    @click.stop="onSwitchClick"
  />
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isProcessing = ref(false)

const props = defineProps({
  // Data props
  modelValue: {
    type: String,
    required: true
  },
  item: {
    type: Object,
    required: true
  },

  // API function
  updateApi: {
    type: Function,
    required: true
  },
  fieldName: {
    type: String,
    required: true
  },
  // Switch props
  activeValue: {
    type: String,
    default: 'y'
  },
  inactiveValue: {
    type: String,
    default: 'n'
  },

  // UI props
  confirmMessage: {
    type: String,
    default: ''
  },
  skipConfirmation: {
    type: Boolean,
    default: false
  },
  successMessage: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'before-update', 'update-success', 'update-error', 'refresh-needed'])

/**
 * Show confirmation dialog
 */
const showConfirmation = () => {
  if (props.skipConfirmation) return Promise.resolve(true)

  return new Promise((resolve) => {
    ElMessageBox.confirm(props.confirmMessage || t('fyComfirm.switchComfirm'), t('pop.warn'), {
      confirmButtonText: t('button.determine'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      callback: (action) => {
        resolve(action === 'confirm')
      }
    })
  })
}

/**
 * Update the status using the provided API
 */
const updateStatus = async (newValue) => {
  // Create a copy of the item to avoid mutations
  const params = { ...props.item }
  params[props.fieldName] = newValue

  // Emit before-update event
  emit('before-update', params)

  try {
    // Call the API
    const response = await props.updateApi(params)

    // Handle API response
    if (response && response.success) {
      // Show success message
      ElMessage({
        type: 'success',
        message: props.successMessage || t('messages.updateSuccess', '修改成功')
      })

      // Update model value (UI state)
      emit('update:modelValue', newValue)

      // Emit success event
      emit('update-success', response)

      // Emit refresh needed
      emit('refresh-needed')

      return true
    }
    throw new Error(response?.message || 'Update failed')
  } catch (error) {
    // Handle errors
    console.error('Error updating status:', error)

    ElMessage({
      type: 'error',
      message: props.errorMessage || t('errors.updateFailed', '修改失败')
    })

    // Emit error event
    emit('update-error', error)

    // Also emit refresh needed to ensure UI consistency
    emit('refresh-needed')

    return false
  }
}

/**
 * Handle switch click
 */
const onSwitchClick = async (event) => {
  // Prevent event propagation
  event.stopPropagation()

  // Calculate the new value
  const newValue = props.modelValue === props.activeValue ? props.inactiveValue : props.activeValue

  // Show confirmation dialog
  const confirmed = await showConfirmation()
  if (!confirmed) return

  // Set loading state
  isProcessing.value = true

  try {
    // Update the status
    await updateStatus(newValue)
  } finally {
    // Reset loading state
    isProcessing.value = false
  }
}
</script>
