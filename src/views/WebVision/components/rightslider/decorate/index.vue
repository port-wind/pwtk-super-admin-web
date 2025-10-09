<template>
  <div class="decorate">
    <!-- 标题 -->
    <!-- <h2>页面设置</h2> -->

    <!-- 表单 -->
    <el-form ref="ruleFormRef" label-position="top" label-width="80px" :model="datas" :rules="rules">
      <el-form-item
        :label="pageModel === 'templateMode' ? '模块名称' : '站点名称'"
        :hide-required-asterisk="true"
        prop="name"
      >
        <el-input v-model="datas.name" maxlength="25" show-word-limit />
      </el-form-item>

      <el-form-item
        :label="pageModel === 'templateMode' ? '模块描述' : '站点描述'"
        :hide-required-asterisk="true"
        prop="details"
      >
        <el-input v-model="datas.details" placeholder="用户通过微信分享给朋友时，会自动显示页面描述" />
      </el-form-item>

      <!-- 个人中心 -->
      <!-- <el-form-item
        label="个人中心"
        class="lef"
      >
        {{ datas.isPerson ? '显示' : '隐藏' }}
        <el-checkbox
          style="margin-left: 196px"
          v-model="datas.isPerson"
        />
      </el-form-item> -->

      <!-- 返回 -->
      <!-- <el-form-item
        label="返回按钮"
        class="lef"
      >
        {{ datas.isBack ? '显示' : '隐藏' }}
        <el-checkbox
          style="margin-left: 196px"
          v-model="datas.isBack"
        />
      </el-form-item> -->

      <!-- 高度 -->
      <!-- <el-form-item
        label="高度"
        class="lef-height"
      >
        <el-slider
          v-model="datas.titleHeight"
          :max="100"
          :min="35"
          input-size="small"
          show-input
        ></el-slider>
      </el-form-item> -->

      <!-- 背景颜色 -->
      <!-- <el-form-item
        label="背景颜色"
        class="lef"
      >
        <el-color-picker
          v-model="datas.bgColor"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </el-form-item> -->

      <!-- <el-form-item label="背景图片">
        <div
          class="shop-head-pic"
          style="text-align: center"
        >
          <img
            class="home-bg"
            :src="datas.bgImg"
            alt=""
            v-if="datas.bgImg"
          />
          <div
            class="shop-head-pic-btn"
            style="text-align: center"
          >
            <el-button
              @click="showUpload('2')"
              class="uploadImg"
              type="primary"
              plain
            >
              更换图片
            </el-button>
            <el-button
              type="primary"
              @click="clear()"
            >
              清空图片
            </el-button>
          </div>
        </div>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">提交</el-button>
      </el-form-item>
    </el-form>

    <!-- 上传图片 -->
    <!-- <uploadimg ref="upload" @uploadInformation="uploadInformation" /> -->
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { sessionCache } from '@/hooks/useSession'
import { PageSetup } from '@/views/WebVision/type'
import { ref, reactive } from 'vue'
import type { PropType } from 'vue'

// 定义 props
const props = defineProps({
  datas: {
    type: Object as PropType<PageSetup>,
    required: true
  },
  pageModel: {
    type: String
  },
  sessionCacheInfo: {
    type: Object as PropType<any>,
    required: true
  }
})

const ruleFormRef = ref<FormInstance>()
// 定义 emits
const emit = defineEmits(['update:datas'])
// const sessionCacheInfo = ref({})
onMounted(() => {
  // console.log('props', props)
  if (props.pageModel === 'componentMode') return

  // sessionCacheInfo.value = props.pageModel.templateId ? templateRowInfo : siteRowInfo
  // console.log('templateRowInfo', templateRowInfo)
  // console.log('siteRowInfo', siteRowInfo)
  // console.log('pageModel', props.pageModel)

  if (props.pageModel && props.pageModel === 'templateMode') {
    props.datas.name = props.sessionCacheInfo.templateName
    props.datas.details = props.sessionCacheInfo.memo
  }
  if (props.pageModel && props.pageModel === 'websiteMode') {
    props.datas.name = props.sessionCacheInfo.websiteInnerName
    props.datas.details = props.sessionCacheInfo.describe
  }
})

// 表单规则
// const rules = reactive({
//   name: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
//   details: [{ required: true, message: '请输入页面描述', trigger: 'blur' }],
//   classification: [{ required: true, message: '请选择页面分类', trigger: 'blur' }]
// })
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
  details: [{ required: true, message: '请输入页面描述', trigger: 'blur' }],
  classification: [{ required: true, message: '请选择页面分类', trigger: 'blur' }]
})

// const pickeShow = ref(false)
// const predefineColors = [
//   '#ff4500',
//   '#ff8c00',
//   '#ffd700',
//   '#90ee90',
//   '#00ced1',
//   '#1e90ff',
//   '#c71585',
//   '#409EFF',
//   '#909399',
//   '#C0C4CC',
//   'rgba(255, 69, 0, 0.68)',
//   'rgb(255, 120, 0)',
//   'hsv(51, 100, 98)',
//   'hsva(120, 40, 94, 0.5)',
//   'hsl(181, 100%, 37%)',
//   'hsla(209, 100%, 56%, 0.73)',
//   '#c7158577'
// ]

// const uploadImgDataType = ref<string | null>(null)

// // 方法
// const showUpload = (type: string) => {
//   uploadImgDataType.value = type
//   // 注意: 这里需要修改,因为 $refs 在 setup 中不可用
//   // 可能需要使用 template ref
// }

// const uploadInformation = (res: string) => {
//   if (uploadImgDataType.value === '2') {
//     emit('update:datas', { ...props.datas, bgImg: res })
//   }
// }

// const clear = () => {
//   emit('update:datas', { ...props.datas, bgImg: '' })
// }

/**
 * 提交方法
 * @param formEl form实例
 */

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('fields', form.value)
      // console.log('fields', fields)
      // console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style scoped lang="less">
/* 页面设置 */
.decorate {
  width: 100%;
  box-sizing: border-box;
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
  /* 选择器添加和刷新 */
  .ification {
    color: #155bd4;
    font-size: 14px;
    padding: 0 15px;
    cursor: pointer;
  }
  /* 颜色选择器 */
  .picke {
    margin-left: 15px;
    vertical-align: top;
  }
  .home-bg {
    width: 100px;
    height: 300px;
  }

  .lef {
    display: flex;
    :deep(.el-form-item__label) {
      text-align: left;
      margin-right: 20px;
    }
  }
  .lef-height {
    :deep(.el-form-item__label) {
      text-align: left;
      width: 80px;
      float: left;
    }
    :deep(.el-form-item__content) {
      margin-left: 80px;
    }
  }

  // 底部logo
  .bottomLogo {
    display: flex;
    flex-direction: column;
    img {
      display: block;
      width: 220px;
      margin: 10px auto;
    }
  }

  // 店铺信息修改
  .shop-info {
    .shop-name {
      display: flex;
      flex-direction: row;
      color: #ababab;
      .el-input {
        flex: 1;
      }
    }
    .shop-head-pic {
      color: #ababab;
      display: flex;
      flex-direction: column;
      img {
        width: 70px;
        height: 70px;
        margin: 10px auto;
      }
      .shop-head-pic-btn {
        display: flex;
        flex-direction: row;
        .el-button {
          flex: 1;
        }
      }
    }
  }
}
</style>
