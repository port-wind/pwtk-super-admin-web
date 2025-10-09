import { ElMessage, ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import showErrorMessage from '../showErrorMessage'
import { getGameTypePlatformList } from '@/api/global'
import type { Ref } from 'vue'
const { t } = i18n.global as any

// 把驼峰转换成横杠连接
export const toLine = (value: string) => {
  return value.replace(/(A-Z)g/, '-$1').toLocaleLowerCase()
}
interface StatusRow {
  [key: string]: any
}

export const updateStatus = async (
  row: any,
  statusField: string,
  editHttpFunc: (params: any) => Promise<{ success: boolean; message?: string }>,
  afterChange: (row: any) => void,
  options = { activeValue: 'y', inactiveValue: 'n' }
): Promise<any> => {
  const params = { ...row }
  params[statusField] = params[statusField] === options.activeValue ? options.inactiveValue : options.activeValue

  try {
    const response = await editHttpFunc(params)
    if (response.success) {
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
      afterChange(params)
      return params
    } else {
      showErrorMessage(response)
      throw new Error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('Error saving data:', error)
    ElMessage({
      showClose: true,
      message: '保存数据时出错',
      type: 'error'
    })
    throw error
  }
}

export const statusChanged = <T extends StatusRow>(
  row: T,
  editHttpFunc: (params: T) => Promise<{ success: boolean; message?: string }>,
  afterChange: (row: any) => void,
  statusField: keyof T & string = 'status' as keyof T & string,
  options = { activeValue: 'y', inactiveValue: 'n' },
  updateFunc: typeof updateStatus = updateStatus,
  confirmMessage: string = t('fyComfirm.switchComfirm'),
  confirmTitle: string = t('pop.warn')
): Promise<T> => {
  return ElMessageBox.confirm(confirmMessage, confirmTitle, {
    confirmButtonText: t('button.determine'),
    cancelButtonText: t('button.cancel'),
    type: 'warning'
  })
    .then(() => updateFunc(row, statusField, editHttpFunc, afterChange, options))
    .catch(() => {
      throw new Error('用户取消操作')
    })
}

export const fetchGameTypes = async (
  isLoading: Ref<boolean>,
  manageSiteId?: string
): Promise<{ label: string; value: string | number }[]> => {
  try {
    isLoading.value = true // This will update the ref in the calling component
    const response = await getGameTypePlatformList({ page: 1, size: 999, manageSiteId })
    if (response.success) {
      return (
        response.data?.list?.map((item: any) => ({
          label: item.gameTypeName,
          value: item.gameType
        })) || []
      )
    } else {
      showErrorMessage(response)
      return []
    }
  } catch (error) {
    console.error('Failed to fetch game types:', error)
    return []
  } finally {
    isLoading.value = false // This will also update the ref in the calling component
  }
}
