// 权限集
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const setPermissionsStore = defineStore('permissions', () => {
  const menupermissions = ref<Array<string>>([])
  function setPermissions(arr: Array<string>) {
    menupermissions.value = arr
  }
  return { menupermissions, setPermissions }
})
