import { ElMessage } from 'element-plus' // 确保已正确安装并导入 Element Plus

/**
 * 显示错误消息
 * @param {Object} res - 响应对象，包含 errMessage 和 errCode
 */
function showErrorMessage(res: any) {
  if (res) {
    ElMessage({
      message: `${res.errMessage} ----- [${res.errCode}]`,
      type: 'error'
    })
  } else {
    console.error('Invalid response object')
  }
}

export default showErrorMessage
