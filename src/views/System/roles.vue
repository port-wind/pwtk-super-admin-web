<template>
  <div id="sys_roles">
    <div class="roles" ref="tableRef">
      <div class="left">
        <div class="search_left">
          <el-input v-model="treedata.name" :placeholder="t('input.QueryContent')" clearable></el-input>
          <el-button type="primary" @click="searchTree">
            {{ t('button.search') }}
          </el-button>
        </div>
      </div>
      <div class="btn">
        <el-button :disabled="per.includes('role:add') ? false : true" type="success" @click="addRoules(ruleFormRef)">
          {{ t('button.addRole') }}
        </el-button>
      </div>
    </div>
    <div class="account-table">
      <el-table :data="tableData" border style="width: 100%" stripe highlight-current-row :height="count(tableRef)">
        <el-table-column prop="name" :label="t('table.roleName')" align="left" />
        <el-table-column prop="remark" :label="t('table.roleIllustrate')" align="left" />
        <el-table-column :label="t('table.controls')" width="300" align="center">
          <template #default="scope">
            <el-button :disabled="per.includes('role:edit') ? false : true" type="primary" @click="editt(scope.row)">
              {{ t('button.edit') }}
            </el-button>
            <el-popconfirm
              :confirm-button-text="t('button.confirm')"
              :cancel-button-text="t('button.cancel')"
              icon-color="#f5c357"
              :title="t('button.isdeleteUser')"
              @confirm="confirmEvent(scope.row)"
              @cancel="cancelEvent"
              width="250"
            >
              <template #reference>
                <el-button :disabled="per.includes('role:delete') ? false : true" type="danger">
                  {{ t('button.delete') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增账号弹出框 -->
    <el-dialog v-model="dialogFormVisible" class="tabs-dialog">
      <el-tabs class="m_tabs" v-model="activeTab">
        <el-tab-pane
          :label="distinguish ? t('button.edit') : t('button.add')"
          name="editorRole_tab"
          class="m_tabs_pane"
        >
          <el-scrollbar class="dialog-scrollbar">
            <el-form :model="rolesForm" ref="ruleFormRef" status-icon :rules="rules" class="dialog-form single-form">
              <el-form-item :label="t('table.roleName') + ' :'" prop="name">
                <el-input v-model="rolesForm.name" />
              </el-form-item>
              <el-form-item :label="t('table.roleIllustrate') + ' :'" prop="remark">
                <el-input v-model="rolesForm.remark" />
              </el-form-item>
              <el-form-item :label="t('pop.accessPermissions') + ' :'" prop="types">
                <div class="custom-tree-container">
                  <el-tree
                    :data="dataSource"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    ref="treeRef"
                    :default-checked-keys="defaTree"
                    :check-strictly="false"
                    :expand-on-click-node="false"
                    @check="check"
                  >
                    <template #default="{ data }">
                      <span class="custom-tree-node">
                        <span>{{ data.name }}</span>
                        <span>
                          <a v-if="data.children">
                            &nbsp;&nbsp;
                            <el-icon>
                              <Notebook />
                            </el-icon>
                          </a>
                          <a v-else>
                            &nbsp;&nbsp;
                            <el-icon>
                              <Mouse />
                            </el-icon>
                          </a>
                        </span>
                      </span>
                    </template>
                  </el-tree>
                </div>
              </el-form-item>
            </el-form>
          </el-scrollbar>

          <div class="button-row">
            <el-button @click="cancellation">{{ t('button.cancel') }}</el-button>
            <el-button type="primary" @click="confirm(ruleFormRef)">
              {{ t('button.confirm') }}
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
import { setPermissionsStore } from '@/stores/index'
import type { FormInstance, FormRules } from 'element-plus'
import { reqRolesList, reqRolesAdd, reqRoleDelete, reqRolesEdit, reqRoleMenu } from '@/api/system/roles'
import { menupage } from '@/api/system'
// 计算表格高度
import count from '@/utils/tableHeight'
import showErrorMessage from '@/utils/showErrorMessage'

const tableRef = ref(null)

const permissionStore = setPermissionsStore()
const per = computed(() => permissionStore.menupermissions)
const searchTree = async () => {
  getRolesList()
}
interface Tree {
  id: number
  name: string
  children?: Tree[]
}
const activeTab = ref('editorRole_tab') //tab切换第一条

//树状图展示数据
const dataSource = ref()
//树状图默认展示数据
const defaTree = ref([])
//获取tree组件实例
const treeRef: Ref = ref()

const currentPage = ref(1)
const pageSize = ref(15)
const handleSizeChange = (val) => {
  treedata.size = val
  getRolesList()
}
const handleCurrentChange = (val) => {
  treedata.page = val
  getRolesList()
}
const total = ref(0)
//区分点击的是新增字典还是编辑字典
const distinguish = ref(false)
//控制弹出框是否展示
const dialogFormVisible = ref(false)
//弹出框中 表单的头部宽度
const formLabelWidth = '220px'
//表单校验
const ruleFormRef = ref<FormInstance>()
//弹出框中 表单的信息
const rolesForm = reactive({
  name: '',
  remark: ''
})
//校验规则
const validateName = (rule: any, value: any, callback: any) => {
  if (value == '') {
    return callback(new Error('input.Cannotempty'))
  } else {
    callback()
  }
}
const validateremark = (rule: any, value: any, callback: any) => {
  if (value == '') {
    return callback(new Error(t('input.Cannotempty')))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  name: [{ validator: validateName, required: true, trigger: 'blur' }],
  remark: [{ validator: validateremark, required: true, trigger: 'blur' }]
})
//弹出框表单 取消按钮
const cancellation = () => {
  dialogFormVisible.value = false
}
//弹出框表单 确认按钮
const confirm = async (formEl: FormInstance | undefined) => {
  if (distinguish.value) {
    //点击的编辑按钮
    let treeKeys = treeRef.value.getHalfCheckedKeys()
    let treeKeys1 = treeRef.value.getCheckedKeys()
    let treeK = [...treeKeys, ...treeKeys1]
    let res = await reqRolesEdit({
      id: rolesId.value,
      menuIds: treeK,
      remark: rolesForm.remark
    })
    if (res.success) {
      ElMessage({
        message: t('button.edit') + t('errorCode.0'),
        type: 'success'
      })
      // treedata.page = 1
      getRolesList()
      dialogFormVisible.value = false
    } else {
      showErrorMessage(res)
      dialogFormVisible.value = false
    }
  } else {
    //点击的新增按钮
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          let treeKeys = treeRef.value.getHalfCheckedKeys()
          let treeKeys1 = treeRef.value.getCheckedKeys()
          let treeK = [...treeKeys, ...treeKeys1]
          let res = await reqRolesAdd({
            name: rolesForm.name,
            menuIds: treeK,
            remark: rolesForm.remark
          })
          if (res.success) {
            ElMessage({
              message: t('button.add') + t('errorCode.0'),
              type: 'success'
            })
            treedata.page = 1
            getRolesList()
            dialogFormVisible.value = false
          } else {
            showErrorMessage(res)
            dialogFormVisible.value = false
          }
        } catch (error) {}
      } else {
        return false
      }
    })
  }
}

//新增角色
const addRoules = async (ruleFormRef) => {
  await getMenu()

  defaTree.value = []
  rolesForm.name = ''
  rolesForm.remark = ''
  distinguish.value = false
  dialogFormVisible.value = true
  if (ruleFormRef && ruleFormRef.value) {
    ruleFormRef.value.clearValidate()
  }
}
//表格展示的数据
const tableData = ref()
//删除按钮
const confirmEvent = async (row) => {
  let res = await reqRoleDelete({
    id: row.id
  })
  if (res.success) {
    ElMessage({
      message: t('button.delete') + t('errorCode.0'),
      type: 'success'
    })
    getRolesList()
  } else {
    showErrorMessage(res)
  }
}
const cancelEvent = () => {}
//角色id
const rolesId = ref()
//递归遍历返回来的树状图
const arr = ref([])
const fun = (array) => {
  array.forEach((item) => {
    if (item.selected) {
      arr.value.push(item.id)
    }
    if (item.children) {
      fun(item.children)
    }
  })
}
const check = (a, b) => {
  // console.log(dataSource.value,'22222222222')
  let checkedKeys = treeRef.value.getCheckedKeys()
  dataSource.value.forEach((val) => {
    val.children.forEach((v) => {
      if (v.children) {
        v.children.forEach((lv, lk, la) => {
          for (let x in la) {
            if (x == '0') {
              for (let c in la) {
                if (c != '0') {
                  la[c].disabled = true
                }
              }
            }
            for (let i in checkedKeys) {
              if (la[x].id === checkedKeys[i]) {
                if (x == '0') {
                  la.forEach((xv) => {
                    xv.disabled = false
                  })
                } else {
                  for (let c in la) {
                    if (c == '0') {
                      la[c].disabled = true
                    }
                  }
                }
              }
            }
          }
        })
      }
    })
  })
  dataSource.value = dataSource.value
}
//编辑按钮
const editt = async (row) => {
  arr.value = []
  defaTree.value = []
  // await getMenu()
  let res = await reqRoleMenu(row.id)
  fun(res.data)
  rolesId.value = row.id
  rolesForm.name = row.name
  rolesForm.remark = row.remark
  distinguish.value = true
  dialogFormVisible.value = true
  defaTree.value = arr.value
  dataSource.value = res.data
  // 如果查看页面选中，同级自动disabled = false
  dataSource.value.forEach((val) => {
    val.children.forEach((v) => {
      if (v.children) {
        v.children.forEach((lv, lk, la) => {
          for (let x in la) {
            if (x == '0' && la[x].selected == false) {
              for (let c in la) {
                if (c != '0') {
                  la[c].disabled = true
                }
              }
            }
            if (x != '0' && la[x].selected == true) {
              la[0].disabled = true
            }
          }
        })
      }
    })
  })
  dataSource.value = dataSource.value
}
onMounted(() => {
  getRolesList()
})
const getMenu = async () => {
  defaTree.value = []
  let res = await menupage()
  if (res.success) {
    // 操作数据 禁用按钮打勾
    res?.data.list.forEach((val, key) => {
      if (val?.children) {
        val.children.forEach((v, k) => {
          if (v.hasChildren) {
            v.children.forEach((lv, lk, la) => {
              for (let x in la) {
                if (x != '0') {
                  la[x].disabled = true
                }
              }
            })
          }
        })
      }
    })

    dataSource.value = res.data.list
  }
}
const treedata = reactive({
  page: currentPage.value,
  size: pageSize.value,
  name: ''
})
const getRolesList = async () => {
  let res = await reqRolesList(treedata)
  tableData.value = res?.data?.list
  total.value = parseInt(res?.data?.total)
}
</script>

<style scoped lang="less">
#sys_roles {
  .roles {
    display: flex;
    margin-bottom: 2px;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;

    .left {
      display: flex;
      align-items: baseline;

      .search_left {
        .el-input {
          width: 7.5rem;
          margin-right: 0.625rem;
        }
      }
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: baseline;
    font-size: 14px;
    padding-right: 8px;
  }

  .el-input {
    width: 300px;
  }
}
</style>
