<template>
  <div class="editor-wrapper">
    <div class="editor-box-shadow">
      <div class="form-group">
        <h3>内容：</h3>

        <div
          ref="contentEditor"
          class="rich-text-editor"
          contenteditable="plaintext-only"
          :placeholder="placeholder"
          @input="handleContentInput"
          @mouseup="handleTextSelection"
          @keyup="handleKeyUp"
          @keydown="handleKeyDown"
          @focus="handleTextSelection"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @paste="handlePaste"
          :data-placeholder="placeholder"
        ></div>
      </div>
      <div class="word-count">
        <span>{{ contentLength }}</span>
        /{{ maxLength }}
      </div>
    </div>

    <!-- 文字顏色選擇器 -->
    <div class="color-picker-wrapper" v-if="showColorPicker">
      <div class="color-picker-box-shadow">
        <h3 class="color-picker-title">选择文字变色：</h3>
        <div class="color-picker-list">
          <div
            class="color-picker-item"
            :class="{ active: presetColor === item }"
            v-for="item in textColorList"
            :key="item"
            :style="{ backgroundColor: item }"
            @mousedown="saveCurrentSelection"
            @click="applyTextColor(item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入内容'
  },
  maxLength: {
    type: Number,
    default: 10000
  },
  showColorPicker: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'content-change'])

const contentEditor = ref(null)
const hasTextSelected = ref(false)
const selectedColor = ref('')
const contentLength = ref(0)
const savedSelection = ref(null)
const presetColor = ref('')
const isComposing = ref(false)

// 文字顏色列表
const textColorList = ['#333333', '#2fc147', '#1ad7f1', '#428bfc', '#af00ff', '#f12859', '#fc0e22', '#fc7b1f']

// 監聽 modelValue 變化，同步到編輯器
watch(
  () => props.modelValue,
  (newValue) => {
    if (contentEditor.value && contentEditor.value.innerHTML !== newValue) {
      contentEditor.value.innerHTML = newValue
      contentLength.value = getTextLength(newValue)
    }
  },
  { immediate: true }
)

const handleContentInput = () => {
  if (contentEditor.value) {
    const content = contentEditor.value.innerHTML
    emit('update:modelValue', content)
    emit('content-change', content)
    contentLength.value = getTextLength(content)
  }
}

const handleTextSelection = () => {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()
  hasTextSelected.value = selectedText.length > 0

  if (selectedText.length > 0 && selection.rangeCount > 0) {
    savedSelection.value = selection.getRangeAt(0).cloneRange()
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    if (isComposing.value) {
      event.preventDefault()
      return
    }
  }
}

const handleKeyUp = (event) => {
  handleTextSelection()
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = () => {
  isComposing.value = false
  setTimeout(() => {
    handleTextSelection()
  }, 10)
}

const handlePaste = (event) => {
  setTimeout(() => {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(contentEditor.value)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)

    contentEditor.value.focus()
  }, 0)
}

const saveCurrentSelection = () => {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()

  if (selectedText.length > 0 && selection.rangeCount > 0) {
    savedSelection.value = selection.getRangeAt(0).cloneRange()
  } else if (selection.rangeCount > 0) {
    savedSelection.value = selection.getRangeAt(0).cloneRange()
  } else {
    savedSelection.value = null
  }
}

const insertColoredSpanAtCursor = (color) => {
  if (!contentEditor.value) return

  const selection = window.getSelection()
  let range

  if (savedSelection.value) {
    range = savedSelection.value
  } else if (selection.rangeCount > 0) {
    range = selection.getRangeAt(0)
  } else {
    range = document.createRange()
    range.selectNodeContents(contentEditor.value)
    range.collapse(false)
  }

  if (!contentEditor.value.contains(range.commonAncestorContainer)) {
    range = document.createRange()
    range.selectNodeContents(contentEditor.value)
    range.collapse(false)
  }

  const coloredSpan = document.createElement('span')
  coloredSpan.setAttribute('style', `color: ${color}`)
  coloredSpan.innerHTML = '&nbsp;'

  range.insertNode(coloredSpan)

  const newRange = document.createRange()
  newRange.setStart(coloredSpan.firstChild, 0)
  newRange.setEnd(coloredSpan.firstChild, 1)

  selection.removeAllRanges()
  selection.addRange(newRange)

  contentEditor.value.focus()

  savedSelection.value = null
}

const applyTextColor = (color) => {
  if (savedSelection.value) {
    const range = savedSelection.value
    const selectedText = range.toString().trim()

    if (selectedText.length > 0) {
      if (!contentEditor.value.contains(range.commonAncestorContainer)) {
        return
      }

      const span = document.createElement('span')
      span.setAttribute('style', `color: ${color}`)
      span.textContent = selectedText

      range.deleteContents()
      range.insertNode(span)

      const selection = window.getSelection()
      selection.removeAllRanges()

      handleContentInput()
      hasTextSelected.value = false
      selectedColor.value = color
      presetColor.value = color
      savedSelection.value = null

      const newRange = document.createRange()
      newRange.setStartAfter(span)
      newRange.collapse(true)
      selection.addRange(newRange)

      contentEditor.value.focus()
      return
    }
  }

  const selection = window.getSelection()
  const selectedText = selection.toString().trim()

  if (selectedText.length > 0) {
    const range = selection.getRangeAt(0)

    if (!contentEditor.value.contains(range.commonAncestorContainer)) {
      return
    }

    const span = document.createElement('span')
    span.setAttribute('style', `color: ${color}`)
    span.textContent = selectedText

    range.deleteContents()
    range.insertNode(span)

    selection.removeAllRanges()

    handleContentInput()
    hasTextSelected.value = false
    selectedColor.value = color
    presetColor.value = color
    savedSelection.value = null

    const newRange = document.createRange()
    newRange.setStartAfter(span)
    newRange.collapse(true)
    selection.addRange(newRange)

    contentEditor.value.focus()
  } else {
    insertColoredSpanAtCursor(color)
  }
}

const getTextLength = (html) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent.length
}

const clearContent = () => {
  if (contentEditor.value) {
    contentEditor.value.innerHTML = ''
    emit('update:modelValue', '')
    emit('content-change', '')
    contentLength.value = 0
  }
  hasTextSelected.value = false
  selectedColor.value = ''
  savedSelection.value = null
  presetColor.value = ''
}

const setContent = (content) => {
  if (contentEditor.value) {
    contentEditor.value.innerHTML = content
    contentLength.value = getTextLength(content)
    emit('update:modelValue', content)
    emit('content-change', content)

    nextTick(() => {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(contentEditor.value)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      contentEditor.value.focus()
    })
  }
}

// 暴露方法給父組件使用
defineExpose({
  applyTextColor,
  clearContent,
  setContent,
  saveCurrentSelection
})
</script>

<style lang="scss" scoped>
.editor-wrapper {
  margin-top: 0.625rem;
  font-variant: tabular-nums;
}

.editor-box-shadow {
  padding: 0.625rem;
  background-color: #fff;
  border-radius: 0.625rem;
  margin-bottom: 0.625rem;
  box-shadow: 0 0 0.25rem 0 rgba(0, 0, 0, 0.1);
}

.form-group {
  line-height: 1.375;
  letter-spacing: 0.02rem;

  h3 {
    color: #434343;
    margin-bottom: 0.625rem;
  }
}

.word-count {
  letter-spacing: 0.0175rem;
  line-height: 1.375rem;
  font-size: 0.875rem;
  color: #aeaeb1;
  text-align: right;
  margin-top: 0.3125rem;
}

.rich-text-editor {
  line-height: 1.5;
  min-height: 22.5rem;

  &:focus {
    outline: none;
  }

  &:empty:before {
    content: attr(data-placeholder);
    color: #aeaeb1;
    pointer-events: none;
  }

  span[style*='color'] {
    display: inline;
  }
}

.color-picker-wrapper {
  margin-top: 0.625rem;
}

.color-picker-box-shadow {
  padding: 0.625rem;
  background-color: #fff;
  border-radius: 0.625rem;
  margin-bottom: 0.625rem;
  box-shadow: 0 0 0.25rem 0 rgba(0, 0, 0, 0.1);
}

.color-picker-title {
  color: #434343;
  margin-bottom: 0.625rem;
}

.color-picker-list {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.color-picker-item {
  width: 2.1875rem;
  height: 1.25rem;
  cursor: pointer;
  border: 0.125rem solid transparent;

  &:hover,
  &.active {
    border-color: #f7d7a3;
  }
}
</style>
