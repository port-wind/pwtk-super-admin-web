// PermissionDirective.ts
import { type Directive, type App, computed } from 'vue'
import { setPermissionsStore } from '@/stores/index'
// const permissionStore = setPermissionsStore()
// const per:any = computed(() => permissionStore.menupermissions)
const permissionDirective: Directive = {
  mounted(el, binding) {
    // 获取权限标识
    const permission = binding.value
    // 假设有一个权限检查函数
    const hasPermission = checkPermission(permission)

    // 根据权限控制按钮的显示或禁用
    if (!hasPermission) {
      el.style.disabled = true // 或者 el.disabled = true;   el.style.display = 'none'
    }
  }
}

// 假设有一个全局的用户权限对象
const userPermissions: any = []

// 权限检查函数
function checkPermission(permission: String) {
  return userPermissions.includes(permission)
}

export const installPermissionDirective = (app: App) => {
  app.directive('permission', permissionDirective)
}
