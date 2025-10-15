<template>
  <el-tab-pane label="草图信息" :name="firstTabName" class="m_tabs_pane">
    <el-scrollbar>
      <el-row justify="center">
        <el-col :span="20">
          <el-form :model="queryForm" ref="formRef" :rules="rulesAddFrom" class="single-form">
            <el-form-item label="草图代码:" align="left" prop="sketchCode">
              <el-input
                v-model.trim="queryForm.sketchCode"
                :disabled="disableBtn"
                placeholder="请输入8位长度代码"
                maxlength="8"
                autocomplete="off"
              />
              <!-- <span v-else>
                <span>
                  {{ queryForm.sketchCode }}
                </span>
                <copy :content="queryForm.sketchCode"></copy>
              </span> -->
            </el-form-item>
            <el-form-item label="草图名称:" align="left" prop="sketchName">
              <el-input
                v-model.trim="queryForm.sketchName"
                placeholder="请输入草图名称"
                maxlength="32"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="草图类型:" align="left" prop="sketchType">
              <el-radio-group v-model="queryForm.sketchType">
                <el-radio v-for="item in optionsSketch" :key="item.value" :label="item.label" :value="item.value" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="草图状态:" align="left" prop="sketchStatus">
              <el-radio-group v-model="queryForm.sketchStatus">
                <el-radio value="y">启用</el-radio>
                <el-radio value="n">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="语言列表:" align="left" prop="langCodes">
              <el-select v-model="queryForm.langCodes" multiple placeholder="请选择语言">
                <el-option v-for="item in optionsLang" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="地区列表:" align="left" prop="areaCodes">
              <el-select v-model="queryForm.areaCodes" multiple placeholder="请选择地区">
                <el-option v-for="item in optionsArea" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <!-- <el-form-item
              v-if=""
              label="创建时间:"
              align="left"
              prop="createTime"
            >
              <span>
                {{ unitFormatDate(queryForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}
              </span>
            </el-form-item> -->
            <el-form-item label="备注:" align="left" prop="memo">
              <el-input
                type="textarea"
                show-word-limit
                placeholder="请输入备注"
                maxlength="255"
                :rows="2"
                v-model="queryForm.memo"
                autocomplete="off"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-scrollbar>
    <div class="button-row">
      <el-button @click.stop="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitInfo(formRef)">提交</el-button>
    </div>
  </el-tab-pane>
</template>
<script setup lang="ts">
import i18n from '@/i18n'
import { reactive } from 'vue'
const { t } = i18n.global as any
import { unitFormatDate } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
import _Options from '@/const/options.json'
import { reqSketchEdit, reqSketchCreate, reqExistSketchName, reqExistSketchCode } from '@/api/site/index'
import { optionsLang, optionsArea, optionsSketch } from '@/const/options'
import { firstTabName } from '@/views/Site/sketchManagement/components/data'
import { useManageSiteStore } from '@/stores/manageSiteStore'
import { filteredQuery } from '@/utils/dataFormat'
import { ISketchCreateQueryParams, ISketchData } from '@/api/site/types'
const emit = defineEmits<{
  (e: 'closeButton'): void
  (e: 'cancel'): void
}>()
interface IDefineProps {
  currentRowData: ISketchData
}
const props = defineProps<IDefineProps>()

const initAddForm = (): ISketchCreateQueryParams => ({
  manageSiteId: '',
  sketchCode: '',
  sketchName: '',
  sketchStatus: 'y',
  sketchType: 'nav',
  areaCodes: [],
  langCodes: [],
  memo: ''
})

const queryForm = reactive<ISketchCreateQueryParams>(initAddForm())
const manageSite = useManageSiteStore()

onMounted(async () => {
  // const res = await reqSketchInfoBySketchCode({
  //   sketchCode: props.currentRowData.sketchCode,
  //   manageSitId: manageSite.manageSiteId
  // })
})
const disableBtn = ref<boolean>()
const formRef: any = ref()

const checkExitSketchCode = async (rule: any, value: any, callback: any) => {
  if (disableBtn.value) {
    callback()
  } else {
    let sketchCode = queryForm.sketchCode
    let res = await reqExistSketchCode(
      filteredQuery({
        sketchCode,
        manageSiteId: manageSite.manageSiteId
      })
    )
    if (res.data) {
      callback(new Error('草图编码已经存在'))
    } else {
      callback()
    }
  }
}

const checkSketchNameExit = async (rule: any, value: any, callback: any) => {
  let sketchCode = ''
  let sketchName = ''
  if (disableBtn.value) {
    sketchCode = queryForm.sketchCode
    sketchName = queryForm.sketchName
  } else {
    sketchCode = ''
    sketchName = queryForm.sketchName
  }
  let res = await reqExistSketchName(
    filteredQuery({
      sketchCode,
      sketchName,
      manageSiteId: manageSite.manageSiteId
    })
  )
  if (res?.data?.length != 0) {
    callback(new Error('草图名称已经存在'))
  } else {
    callback()
  }
}

const validatePass = (rule: any, value: any, callback: any) => {
  let pwdRegex = /^[A-Za-z0-9-_]+$/
  if (!pwdRegex.test(value)) {
    callback(new Error('请输入英文,数字,符号-,符号_组成值'))
  } else {
    callback()
  }
}

const rulesAddFrom = ref({
  sketchCode: [
    { required: true, message: '请输入草图编码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur', message: '请输入英文,数字,符号-,符号_组成值' },
    { validator: checkExitSketchCode, trigger: 'blur', message: '草图代码已经存在' }
  ],
  sketchName: [
    { required: true, message: '请输入草图名称', trigger: 'blur' },
    { validator: checkSketchNameExit, trigger: 'blur', message: '草图名称已经存在' }
  ]
})
const submitInfo = (formRefval) => {
  if (disableBtn.value) {
    updateFormInfo(formRefval)
  } else {
    createFormInfo(formRefval)
  }
}

/**
 * 新增
 * @param formRefVal
 */
const createFormInfo = (formRefVal) => {
  formRefVal.validate(async (valid) => {
    if (valid) {
      try {
        isLoading.value = true
        const query: ISketchCreateQueryParams = {
          ...queryForm,
          manageSiteId: manageSite.manageSiteId
        }
        let res = await reqSketchCreate(filteredQuery<ISketchCreateQueryParams>(query))
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          closeHand()
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.error(err)
      } finally {
        isLoading.value = false
      }
    } else {
      console.log('表单验证失败!')
      return false
    }
  })
}

/**
 * 更新
 * @param formRefVal
 */
const updateFormInfo = (formRefVal) => {
  formRefVal.validate(async (valid) => {
    if (valid) {
      try {
        isLoading.value = true
        let res = await reqSketchEdit(filteredQuery({ ...queryForm, manageSiteId: manageSite.manageSiteId }))
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          closeHand()
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading.value = false
      }
    } else {
      console.log('表单验证失败!')
      return false
    }
  })
}
watch(
  () => props.currentRowData,
  (newVal, oldVal) => {
    Object.assign(queryForm, newVal)
    if (newVal.sketchCode) {
      disableBtn.value = true
    } else {
      disableBtn.value = false
    }
  },
  { immediate: true }
)

const closeDialog = () => {
  Object.assign(queryForm, initAddForm())
  formRef.value.clearValidate()
  emit('cancel')
}

const closeHand = () => {
  emit('closeButton')
}
const isLoading = ref(false)
</script>
<style scoped>
.m-level-table-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.m-level-table-inside {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cc-table {
  flex: 1;
}
</style>
