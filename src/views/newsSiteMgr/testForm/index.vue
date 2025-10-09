<template>
  <div id="system_account">
    <m-form
      ref="form"
      :options="options"
      :commonSpan="12"
      :uploadData="uploadData"
      @on-change="handleChange"
      @on-preview="handlePreview"
      @on-remove="handleRemove"
      @before-remove="beforeRemove"
      @on-success="handleSuccess"
      @on-exceed="handleExceed"
    >
      <template #uploadArea>
        <el-button size="small" type="primary">Click to upload</el-button>

        <!-- <el-icon><Plus /></el-icon> -->
      </template>
      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <el-icon><zoom-in /></el-icon>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
              <el-icon><Download /></el-icon>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
      <!-- <template #uploadTip>
        <span style="color: #ccc; font-size: 12px">jpg/png 图片文件小于30MB</span>
      </template> -->
      <template #testSlot="scope, form">
        {{ console.log(form) }}
        <mAutoSelect
          max-length="255"
          keyword="userId"
          :httpFunc="reqUserList"
          isPage
          isList
          :displayFields="['loginId', 'userId']"
          :trigger-on-focus="true"
          placeholder="请输入新闻站点名称"
        ></mAutoSelect>
      </template>
      <template #action="scope">
        <section class="button-row dialog-footer-submit">
          <el-button type="primary" @click="submitForm(scope)">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </section>
      </template>
    </m-form>

    <section>
      <p>mMForm 组件测试</p>
      <el-button type="primary" @click="open">open</el-button>
      <m-modal-form
        isScroll
        :options="optionsModal"
        title="编辑用户"
        width="50%"
        v-model:visible="visible"
        :on-change="handleChange"
        :on-success="handleSuccess"
      >
        <template #footer="scope">
          <el-button @click="cancel(scope.form)">取消</el-button>
          <el-button type="primary" @click="confirm(scope.form)">确认</el-button>
        </template>
        <template #uploadArea>
          <el-button size="small" type="primary">Click to upload</el-button>
        </template>
        <template #uploadTip>
          <div style="color: #ccc; font-size: 12px">jpg/png files with a size less than 500kb</div>
        </template>
      </m-modal-form>
    </section>
    <section>
      <div style="display: none; border: 1px solid #ccc">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height: 500px; overflow-y: hidden"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
      </div>
      <el-button type="primary" @click="getHtmlFunc">获取</el-button>
    </section>
    <section>
      <m-upload :uploadOption="uploadData">
        <template #uploadArea>
          <el-button type="primary">上传</el-button>
        </template>
      </m-upload>
    </section>
  </div>
  <div>
    <button @click="openModal2">打开其他Pinia弹窗</button>
    <modalPhotoSeries />
  </div>
  <div>
    <button @click="openModal1">打开Pinia弹窗</button>
    <el-dialog
      v-if="modalsStore.siteDetailModal.isVisible"
      :visible="modalsStore.siteDetailModal.isVisible"
      v-model="modalsStore.siteDetailModal.isVisible"
      @close="closeModal1"
    >
      <el-tabs v-model="modalsStore.siteDetailModal.activeTab">
        <el-tab-pane label="Tab 1" name="tab1">
          {{ modalsStore.siteDetailModal?.modalData?.name }}
        </el-tab-pane>
        <el-tab-pane label="Tab 2" name="tab2">
          {{ modalsStore.siteDetailModal?.modalData?.age }}
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- ========= -->
    <el-dialog v-model="centerDialogVisible" :show-close="true" center>
      <div class="dialog-self">
        <el-tabs>
          <template #add-icon></template>
          <el-tab-pane label="自定义弹窗1" name="first">
            <div>自定义弹窗</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <button @click="openModal3">打开自定义弹窗</button>
    <!-- ========= -->
  </div>
  <section>
    <el-dialog v-model="tableDialogVisible" :show-close="true" @open="openDialogTable" center>
      <template #default>
        <!--      @selection-change="handleSelectionChange" -->
        <el-table
          :data="paginatedData"
          style="width: 100%"
          @select="handleSelectionChange"
          @select-all="handleSelectAll($event)"
          ref="tableRef"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column label="Date" width="120">
            <template #default="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column property="name" label="Name" width="120" />
          <el-table-column property="address" label="use show-overflow-tooltip" width="240" show-overflow-tooltip />
          <el-table-column property="address" label="address" />
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.totalItems"
          layout="total, prev, pager, next, jumper"
        />
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tableDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="tableSubmit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <button @click="openModal4">table弹窗选择器</button>
  </section>
</template>

<script lang="ts" setup>
import type { FormInstance, FormOptions } from '@/components/mForm/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { UploadFile } from 'element-plus'
import mAutoSelect from '@/components/mAutoSelect/index.vue'
import { reqUserList } from '@/api/user'
import { changeJsonToArr } from '@/utils/dataFormat'
import mUpload from '@/components/mUpload/index.vue'
import modalPhotoSeries from '@/components/modalCommon/photoSeriesModal/index.vue'
import type { ElTable } from 'element-plus'
import { useModalsStore } from '@/stores/modalStore'

// import { reqInputHttp } from '@/api/newsSiteMgr/newsSiteList'
// import mComment from '@/components/mComment/index.vue'

interface Scope {
  form: FormInstance
  model: any
}

let options: FormOptions[] = [
  {
    type: 'input',
    value: '',
    label: '用户名',
    prop: 'username',
    placeholder: '请输入用户名',
    isCopy: true,
    rules: [
      {
        required: true,
        message: '用户名不能为空',
        trigger: 'blur'
      },
      {
        min: 2,
        max: 6,
        message: '用户名在2-6位之间',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },

  {
    type: 'input',
    value: '',
    label: '密码',
    prop: 'password',
    placeholder: '请输入密码',
    rules: [
      {
        required: true,
        message: '密码不能为空',
        trigger: 'blur'
      },
      {
        min: 6,
        max: 15,
        message: '密码在6-15位之间',
        trigger: 'blur'
      }
    ],
    attrs: {
      showPassword: true,
      clearable: true
    }
  },
  {
    type: 'mAutoComplete',
    value: '',
    label: '自动引入',
    prop: 'userId',
    autoData: {
      httpReq: reqUserList,
      keyword: 'searchId',
      inputValue: 'userId',
      displayFields: ['loginId', 'userId'],
      placeholder: '请输入',
      isList: true,
      isPage: true
    }
  },
  {
    type: 'select',
    value: '',
    placeholder: '请选择职位',
    prop: 'role',
    label: '职位',
    attrs: {
      multiple: true,
      style: {
        width: '100%'
      }
    },
    rules: [
      {
        required: true,
        message: '职位不能为空',
        trigger: 'change'
      }
    ],
    children: [
      {
        type: 'option',
        label: '经理',
        value: '1'
      },
      {
        type: 'option',
        label: '主管',
        value: '2'
      },
      {
        type: 'option',
        label: '员工',
        value: '3'
      }
    ]
  },
  {
    type: 'checkbox-group',
    value: [],
    prop: 'like',
    label: '爱好',
    rules: [
      {
        required: true,
        message: '爱好不能为空',
        trigger: 'change'
      }
    ],
    children: [
      {
        type: 'checkbox',
        label: '足球',
        value: '1'
      },
      {
        type: 'checkbox',
        label: '篮球',
        value: '2'
      },
      {
        type: 'checkbox',
        label: '排球',
        value: '3'
      }
    ]
  },
  {
    type: 'radio-group',
    value: '',
    prop: 'gender',
    label: '性别',
    rules: [
      {
        required: true,
        message: '性别不能为空',
        trigger: 'change'
      }
    ],
    children: [
      {
        type: 'radio',
        label: '男',
        value: 'male'
      },
      {
        type: 'radio',
        label: '女',
        value: 'female'
      },
      {
        type: 'radio',
        label: '保密',
        value: 'not'
      }
    ]
  },
  {
    type: 'slot',
    prop: 'testSlot'
  },
  {
    type: 'upload',
    label: '上传',
    prop: 'pic',
    uploadAttrs: {
      listType: 'text',
      autoUpload: true,
      multiple: false
      // action: 'https://jsonplaceholder.typicode.com/posts/',
      // multiple: true,
      // limit: 3
    }
    // rules: [
    //   {
    //     required: true,
    //     message: '图片不能为空',
    //     trigger: 'blur'
    //   }
    // ]
  },
  {
    type: 'editor',
    value: '123',
    prop: 'desc',
    label: '描述',
    placeholder: '请输入描述',
    attrs: {
      style: {
        zIndex: 10
      }
    },
    rules: [
      {
        required: true,
        message: '描述不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'image',
    prop: 'imgData',
    label: '图片',
    attrs: {
      style: {
        width: '1rem',
        height: '1rem'
      },
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
    },
    rules: [
      {
        required: true,
        message: '描述不能为空',
        trigger: 'blur'
      }
    ]
  }
]

let optionsModal: FormOptions[] = [
  {
    type: 'input',
    value: '',
    label: '用户名',
    prop: 'username',
    placeholder: '请输入用户名',
    rules: [
      {
        required: true,
        message: '用户名不能为空',
        trigger: 'blur'
      },
      {
        min: 2,
        max: 6,
        message: '用户名在2-6位之间',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'input',
    value: '',
    label: '密码',
    prop: 'password',
    placeholder: '请输入密码',
    rules: [
      {
        required: true,
        message: '密码不能为空',
        trigger: 'blur'
      },
      {
        min: 6,
        max: 15,
        message: '密码在6-15位之间',
        trigger: 'blur'
      }
    ],
    attrs: {
      showPassword: true,
      clearable: true
    }
  },
  {
    type: 'mAutoComplete',
    value: '',
    label: '自动引入',
    prop: 'userId',
    autoData: {
      httpReq: reqUserList,
      keyword: 'searchId',
      inputValue: 'userId',
      displayFields: ['loginId', 'userId'],
      placeholder: '请输入',
      isList: true,
      isPage: true
    }
  },
  {
    type: 'select',
    value: '',
    placeholder: '请选择职位',
    prop: 'role',
    label: '职位',
    attrs: {
      style: {
        width: '100%'
      }
    },
    // rules: [
    //   {
    //     required: true,
    //     message: '职位不能为空',
    //     trigger: 'change'
    //   }
    // ],
    children: [
      {
        type: 'option',
        label: '经理',
        value: '1'
      },
      {
        type: 'option',
        label: '主管',
        value: '2'
      },
      {
        type: 'option',
        label: '员工',
        value: '3'
      }
    ]
  },
  {
    type: 'checkbox-group',
    value: [],
    prop: 'like',
    label: '爱好',
    // rules: [
    //   {
    //     required: true,
    //     message: '爱好不能为空',
    //     trigger: 'change'
    //   }
    // ],
    children: [
      {
        type: 'checkbox',
        label: '足球',
        value: '1'
      },
      {
        type: 'checkbox',
        label: '篮球',
        value: '2'
      },
      {
        type: 'checkbox',
        label: '排球',
        value: '3'
      }
    ]
  },
  {
    type: 'radio-group',
    value: ['hk'],
    prop: 'gender',
    label: '性别',
    // rules: [
    //   {
    //     required: true,
    //     message: '性别不能为空',
    //     trigger: 'change'
    //   }
    // ],
    children: changeJsonToArr('landingPage', 'radio') as FormOptions[]
  },
  {
    type: 'upload',
    label: '上传',
    prop: 'pic',
    uploadAttrs: {
      multiple: false
    }
    // rules: [
    //   {
    //     required: true,
    //     message: '图片不能为空',
    //     trigger: 'blur'
    //   }
    // ]
  }
]
let form = ref()
const centerDialogVisible = ref(false) //

const uploadData: fileUploadOption = {
  fileType: 'ico', // 提供一个默认值
  uploadFrom: 'bbs/icon',
  storageStyle: 6
}
// ================================== table弹窗部分 ================================================
interface User {
  id: number
  date: string
  name: string
  address: string
}
const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland'
  },
  {
    id: 2,
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois'
  },
  {
    id: 3,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 4,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 5,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 6,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 7,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 8,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 9,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 10,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 11,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    id: 12,
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho'
  }
]

// const tableData = ref<any[]>([])
const tableDialogVisible = ref(false)
// const isLoading = ref(false)

// 分页数据和选中数据
// const paginatedData = ref(tableData)

// 保存跨页选中的数据
const selectedItems = ref<any[]>([])
// const total = ref<number>(0)

// const addDialogVisible = ref(false)
const openModal4 = () => {
  tableDialogVisible.value = true
}

const openDialogTable = async () => {
  await getPaginatedData(1)
}

const tableRef = ref<InstanceType<typeof ElTable>>()
// 表格引用

// 分页状态
const pagination = reactive({
  currentPage: 1,
  pageSize: 5,
  totalItems: tableData.length // 假设数据从API获取
})

const paginatedData = ref<any[]>([])
// const selectable = (row: User) => ![1, 2].includes(row.id)
// const selectable = (row) => ![1, 2].includes(row.id)

// 将新选择的项目合并到选中的项目列表中

// 在翻页时恢复选中的行
// 用于存储每页选中项目的 Map
const pageSelectionMap = ref(new Map())

// 获取分页数据
const getPaginatedData = (page) => {
  paginatedData.value = tableData.slice((page - 1) * pagination.pageSize, page * pagination.pageSize)
  // console.log('getPaginatedData', paginatedData.value)
  // 恢复选中的行
}
// const saveCurrentPageSelection = () => {
//   pageSelectionMap.value.set(pagination.currentPage, selectedItems.value)
// }

const handleSelectAll = (val) => {
  // console.log('handleSelectAll', val)
  if (val.length > 0) {
    // 全选所有页面的数据
    selectedItems.value = tableData
    // 更新每页的选中状态
    for (let i = 1; i <= Math.ceil(tableData.length / pagination.pageSize); i++) {
      const pageData = tableData.slice((i - 1) * pagination.pageSize, i * pagination.pageSize)
      pageSelectionMap.value.set(i, pageData)
    }
  } else {
    // 取消全选
    selectedItems.value = []
    pageSelectionMap.value.clear()
  }
  // console.log('pageSelectionMap', pageSelectionMap.value)
}
// 处理分页切换
const handleCurrentChange = async (page) => {
  // 保存当前页的选中数据
  await pageSelectionMap.value.set(pagination.currentPage, selectedItems.value)

  // 获取新的分页数据
  await getPaginatedData(page)

  const savedSelection = pageSelectionMap.value.get(page)
  selectedItems.value = savedSelection
  await nextTick(() => {})
  if (tableRef.value) {
    if (savedSelection && savedSelection.length > 0) {
      savedSelection.forEach((item) => {
        tableRef.value!.toggleRowSelection(item, true)
      })
    }
  }
  pagination.currentPage = page
}

// const multipleSelection = ref<User[]>([])
const handleSelectionChange = (val: User[]) => {
  // console.log(val)
  selectedItems.value = [...val] // 存储选中的数据
}
const tableSubmit = () => {
  const selectedIds: number[] = []
  pageSelectionMap.value.forEach((value) => {
    value.forEach((item) => {
      if (item.id) {
        selectedIds.push(item.id)
      }
    })
  })

  console.log('提交的ID数组:', selectedIds)
  // 这里可以添加实际的提交逻辑，例如调用API
  // submitSelectedIds(selectedIds);
}

// ================================== table弹窗部分 ================================================

//mMForm 组件需要
let visible = ref<boolean>(false)
let open = () => {
  visible.value = true
}

// ==============================打开Pinia弹窗=======================================================
const modalsStore = useModalsStore()
const openModal1 = () => {
  modalsStore.showModal('siteDetailModal')
  modalsStore.setActiveTab('siteDetailModal', 'tab2')
  modalsStore.setModalData('siteDetailModal', {
    name: '张三',
    age: 18
  })
}
const openModal2 = () => {
  console.log('openModal2')
  console.log(modalsStore.photoSeriesModal)
  modalsStore.showModal('photoSeriesModal')
  modalsStore.setActiveTab('photoSeriesModal', 'tab2')
  modalsStore.setModalData('photoSeriesModal', {
    name: '李四',
    age: 100
  })
}
const closeModal1 = () => {
  modalsStore.hideModal('siteDetailModal')
}
// const modal1State = modalsStore.$state.siteDetailModal
// ==============================打开Pinia弹窗=======================================================

//=========================================富文本配置==================================================
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { fileUploadOption, FileUploadRequest } from '@/api/system/upload/types'

// const editorRef = ref(null)
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref('<p>hello</p>')
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

// 模式的选择，可以是 'default' 或 'simple'
const mode = ref<'default' | 'simple'>('default')

const getHtmlFunc = () => {
  console.log(editorRef.value.getHtml())
  console.log(editorRef.value.getText())
}

//-------------------------------------------富文本配置--------------------------------------------

let submitForm = (scope: Scope) => {
  scope.form.validate((valid) => {
    if (valid) {
      console.log('mode', scope.model)
      ElMessage.success('提交成功')
    } else {
      ElMessage.error('表单填写有误,请检查')
    }
  })
}
// 重置表单
let resetForm = () => {
  form.value.resetFields()
}
const openModal3 = () => {
  centerDialogVisible.value = true
}

let handlePreview = (file: any) => {
  console.log('handlePreview')
  console.log(file)
}
let beforeRemove = (val: any) => {
  console.log('beforeRemove')
  return ElMessageBox.confirm(`Cancel the transfert of ${val.file.name} ?`)
}
let handleExceed = (val: any) => {
  console.log('handleExceed', val)
  ElMessage.warning(
    `The limit is 3, you selected ${val.files.length} files this time, add up to ${
      val.files.length + val.fileList.length
    } totally`
  )
}
// const imgUrl = ref()
let handleSuccess = (val: any) => {
  console.log('success')
  console.log(val)
}
let handleChange = (val: any) => {
  console.log('change')
  console.log(val)
}

//mMForm 组件需要
let cancel = (form: any) => {}
let confirm = (form: any) => {
  let validate = form.validate()
  validate((valid: boolean) => {
    if (valid) {
      // console.log(form.getFormData)
      ElMessage.success('验证成功')
    } else {
      ElMessage.error('表单填写有误,请检查')
    }
  })
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  console.log('handleRemove')
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}
</script>

<style lang="scss" scoped></style>
