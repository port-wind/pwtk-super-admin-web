<template>
  <div class="wangeditor-text-editor-border">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
    <Editor
      :class="editorClass"
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      @onChange="handleChange"
      @onDestroyed="handleDestroyed"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, ref, onBeforeUnmount } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IToolbarConfig } from '@wangeditor/editor'
import { defaultToolbarKeys, simpleToolbarKeys } from './constant'

interface IProps {
  modelValue: string
  placeholder: string
  mode?: string
}

const props = withDefaults(defineProps<IProps>(), {
  mode: 'default'
})

const emits = defineEmits(['update:modelValue', 'update:text'])
const editorRef = shallowRef<any>(null)

const valueHtml = computed(() => {
  const reg = /^<span\b[^>]*>.*<\/span>$/
  // https://github.com/wangeditor-team/wangEditor/issues/5635
  // wangeditor 工具issue 处理
  if (reg.test(props.modelValue)) {
    return '<p>' + props.modelValue + '</p>'
  } else {
    return props.modelValue
  }
})

const isEdit = ref(false)
const editorClass = computed(() => ({
  'editor-area': true, // 固定类名
  'show-place-holder': isEdit.value // 当 valueHtml 不为空时，添加 isEdit 类
}))

watch(
  () => props.modelValue,
  (newVal) => {
    valueHtml.value = newVal
  }
)

// default tools
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: defaultToolbarKeys
}

if (props.mode == 'simple') {
  toolbarConfig.toolbarKeys = simpleToolbarKeys
} else if (props.mode == 'default') {
  toolbarConfig.toolbarKeys = defaultToolbarKeys
}

const editorConfig: Record<string, any> = { placeholder: props.placeholder || '请输入正文' }

// 销毁时销毁编辑器实例
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    editor.destroy()
  }
})

// 回调函数
const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例
}

// const toolbar = DomEditor.getToolbar(editor) 查看toolbar 内容
const handleChange = (editor: any) => {
  isEdit.value = editor.getText() === '' ? true : false
  emits('update:modelValue', editor.getHtml())
  emits('update:text', editor.getText())
}

const handleDestroyed = (editor: any) => {
  // console.log('destroyed', editor)
}
</script>

<style lang="less">
.wangeditor-text-editor-border.w-e-full-screen-container {
  z-index: 10;
  border: none;
  position: fixed;
}

.wangeditor-text-editor-border {
  border: 1px solid #c9d8db;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 240px;
  position: relative;
}

.w-e-text-container {
}
.w-e-text-container .w-e-scroll {
  position: relative;
}

.show-place-holder .w-e-scroll::before {
  content: '请输入正文...';
  position: absolute;
  left: 10px;
  top: 11px;
  color: var(--w-e-textarea-slight-color);
  pointer-events: none;
  user-select: none;
  font-style: italic;
}

.wangeditor-text-editor-border .editor-area {
  flex: 1;
  overflow: auto;
}
// 去掉默认的
.w-e-text-placeholder {
  display: none !important;
}
</style>
