// ===== 配置区域 =====
const VERSION = '1.0.4'

const CONFIG = {
  ZENTAO_URL: 'https://zentao.pwtk.cc/zentao',
  ZENTAO_USERNAME: (env) => 'pw.robot',
  ZENTAO_PASSWORD: (env) => 'Portwind@20252025',
  ZENTAO_PRODUCT_ID: (env) => '1' //pwtk super admin超管端
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url)
      const method = request.method

      console.log(`[${new Date().toISOString()}] ${method} ${url.pathname}`)

      // ===== 处理飞书事件回调 =====
      if (method === 'POST' && url.pathname === '/webhook') {
        const body = await request.text()
        console.log('Received body:', body)

        // 先尝试解析JSON
        let data
        try {
          data = JSON.parse(body)
        } catch (e) {
          console.error('JSON parse error:', e)
          return new Response(JSON.stringify({ code: 1, msg: 'Invalid JSON' }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
        }

        // URL验证（配置事件订阅时飞书会发送）
        if (data.type === 'url_verification') {
          console.log('URL verification, challenge:', data.challenge)
          return new Response(JSON.stringify({ challenge: data.challenge }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
        }

        try {
          // 处理消息事件
          if (data.header && data.header.event_type === 'im.message.receive_v1') {
            const event = data.event
            const messageType = event.message.message_type

            // 只处理文本消息
            if (messageType === 'text') {
              const content = JSON.parse(event.message.content)
              const text = content.text || ''

              // ===== 新增功能：支持回复原消息 + @机器人的场景 =====
              // 场景：用户回复包含 "#2167 内容" 的消息，只@机器人而不重复输入 #2167
              // 检查是否@了机器人
              const mentions = event.message.mentions || []

              // ===== 添加调试日志 =====
              console.log('[DEBUG] ========== Mentions Debug Info ==========')
              console.log('[DEBUG] Total mentions count:', mentions.length)
              console.log('[DEBUG] Full mentions array:', JSON.stringify(mentions, null, 2))
              console.log('[DEBUG] env.LARK_APP_ID:', env.LARK_APP_ID)
              console.log(
                '[DEBUG] env.ZENTAO_USERNAME:',
                typeof CONFIG.ZENTAO_USERNAME === 'function' ? CONFIG.ZENTAO_USERNAME(env) : CONFIG.ZENTAO_USERNAME
              )

              // 逐个输出每个 mention 的详细信息
              mentions.forEach((mention, index) => {
                console.log(`[DEBUG] Mention[${index}]:`, {
                  key: mention.key,
                  name: mention.name,
                  app_id: mention.id?.app_id,
                  user_id: mention.id?.user_id,
                  open_id: mention.id?.open_id,
                  full_id_object: mention.id
                })
              })

              console.log('[DEBUG] ==========================================')

              const botMentioned = mentions.some((m) => m.name === 'Issue Hub')

              console.log('[INFO] Bot mentioned:', botMentioned)
              console.log('[INFO] Message text:', text)

              // 1. 检查当前消息是否@了机器人且没有 #数字 格式
              let processedParentMessage = false
              if (botMentioned && !text.match(/#(\d+)/)) {
                console.log('[INFO] Bot mentioned but no #ID in current message, checking parent message...')

                // 2. 检查是否为回复消息（通过 parent_id 或 root_id 判断）
                const parentMessageId = event.message.parent_id || event.message.root_id

                if (parentMessageId) {
                  console.log('[INFO] Found parent message ID:', parentMessageId)

                  // 3. 获取被回复的原始消息内容
                  const parentMessage = await getParentMessage(env, parentMessageId)

                  if (parentMessage && parentMessage.content) {
                    console.log('[INFO] Parent message content:', parentMessage.content)

                    // 4. 检查原消息是否包含 #数字 格式（如 #2167 内容）
                    const parentUpdateRequest = await parseUpdateRequest(parentMessage.content, event, env)

                    if (parentUpdateRequest) {
                      console.log(
                        '[INFO] Detected update request from parent message for Bug #' + parentUpdateRequest.bugId
                      )

                      try {
                        // 5. 使用原消息中的 Bug ID 执行更新
                        const updateResult = await updateBugSteps(
                          env,
                          parentUpdateRequest.bugId,
                          parentUpdateRequest.newContent,
                          parentUpdateRequest.pureContent
                        )

                        // 检查是否为重复内容
                        if (updateResult.duplicate) {
                          console.log('[INFO] Bug content is duplicate, update skipped silently')
                        } else {
                          console.log('[SUCCESS] Bug updated from parent message:', updateResult.id)
                          console.log('[SUCCESS] New content added:', parentUpdateRequest.newContent)
                          // TODO: 后续可以添加飞书回复
                        }

                        processedParentMessage = true // 标记已处理，跳过后续逻辑
                      } catch (e) {
                        console.error('[ERROR] Update bug from parent message failed:', e)
                        // TODO: 后续可以添加错误回复（例如：#2167 已解决，需要重新开启才能添加）
                      }
                    } else {
                      console.log('[INFO] Parent message does not contain #ID pattern')
                    }
                  } else {
                    console.log('[INFO] Parent message not found or empty')
                  }
                } else {
                  console.log('[INFO] No parent message ID found (not a reply)')
                }
              }

              // 如果已经处理过父消息，跳过后续逻辑
              if (!processedParentMessage) {
                // 原有逻辑：优先检查是否是更新Bug请求（格式: #2262 这个问题是后端API...）
                const updateRequest = await parseUpdateRequest(text, event, env)
                if (updateRequest) {
                  console.log('Detected update request for Bug #' + updateRequest.bugId)

                  try {
                    const updateResult = await updateBugSteps(
                      env,
                      updateRequest.bugId,
                      updateRequest.newContent,
                      updateRequest.pureContent
                    )

                    // 检查是否为重复内容
                    if (updateResult.duplicate) {
                      console.log('[INFO] Bug content is duplicate, update skipped silently')
                    } else {
                      console.log('Bug updated successfully:', updateResult.id)
                      console.log('New content added:', updateRequest.newContent)
                      // TODO: 后续可以添加飞书回复
                    }
                  } catch (e) {
                    console.error('Update bug failed:', e)
                    // TODO: 后续可以添加错误回复（例如：#2167 已解决，需要重新开启才能添加）
                  }
                }
                // 检查是否是Bug报告（可以自定义触发关键词）
                else if (text.includes('【Bug】') || text.includes('[Bug]') || text.includes('bug:')) {
                  const bugInfo = parseBugInfo(text, event)

                  // 提交到禅道
                  try {
                    const zentaoResult = await submitToZentao(env, bugInfo)

                    // 回复飞书消息
                    await replyLarkMessage(env, event.message.message_id, {
                      success: true,
                      zentaoId: zentaoResult.id,
                      productId: zentaoResult.productId,
                      zentaoUrl: `${CONFIG.ZENTAO_URL}/bug-view-${zentaoResult.id}.html`
                    })
                  } catch (e) {
                    console.error('Submit to Zentao failed:', e)
                    await replyLarkMessage(env, event.message.message_id, {
                      success: false,
                      error: e.message
                    })
                  }
                }
              }
            }
          }
        } catch (e) {
          console.error('Error processing event:', e)
        }

        // 返回成功响应
        return new Response(JSON.stringify({ code: 0 }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
      }

      // ===== 处理飞书卡片交互 =====
      if (method === 'POST' && url.pathname === '/card/action') {
        const body = await request.text()
        console.log('Card action body:', body)

        let data
        try {
          data = JSON.parse(body)
        } catch (e) {
          console.error('JSON parse error:', e)
          return new Response(JSON.stringify({ code: 1, msg: 'Invalid JSON' }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
        }

        // URL验证
        if (data.type === 'url_verification') {
          console.log('Card URL verification, challenge:', data.challenge)
          return new Response(JSON.stringify({ challenge: data.challenge }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
        }

        try {
          // 处理按钮点击
          if (data.action) {
            const { value } = data.action

            if (value.action_type === 'view_zentao') {
              // 返回提示卡片
              return new Response(
                JSON.stringify({
                  toast: {
                    type: 'success',
                    content: '正在跳转到禅道...'
                  }
                }),
                {
                  status: 200,
                  headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                  }
                }
              )
            }
          }
        } catch (e) {
          console.error('Error processing card action:', e)
        }

        return new Response(JSON.stringify({ code: 0 }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
      }

      // ===== 手动提交Bug的API接口 =====
      if (method === 'POST' && url.pathname === '/api/bug') {
        const bugData = await request.json()

        if (!bugData.title || !bugData.description) {
          return new Response(JSON.stringify({ success: false, error: '缺少必要字段' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
        }

        try {
          const zentaoResult = await submitToZentao(env, bugData)

          return new Response(
            JSON.stringify({
              success: true,
              zentaoId: zentaoResult.id,
              zentaoUrl: `${CONFIG.ZENTAO_URL}/bug-view-${zentaoResult.id}.html`
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }
          )
        } catch (e) {
          return new Response(JSON.stringify({ success: false, error: e.message }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
        }
      }

      // ===== 健康检查 =====
      if (method === 'GET' && url.pathname === '/') {
        return new Response(`Lark Bug Collection Worker v${VERSION} is running!`, {
          headers: { 'Content-Type': 'text/plain' }
        })
      }

      // ===== 查询禅道产品列表 =====
      if (method === 'GET' && url.pathname === '/test/products') {
        try {
          const token = await loginZentao(env)
          const productsUrl = `${CONFIG.ZENTAO_URL}/api.php/v1/products`

          console.error('[REQUEST] Get Products:', productsUrl)

          const resp = await fetch(productsUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Token: token
            }
          })

          console.error('[RESPONSE] Get Products Status:', resp.status)

          const responseText = await resp.text()
          console.error('[RESPONSE] Get Products Raw Text:', responseText.substring(0, 1000))

          if (!resp.ok) {
            throw new Error(`Get products failed: ${resp.status} ${responseText}`)
          }

          const products = JSON.parse(responseText)

          return new Response(JSON.stringify({ success: true, products: products }, null, 2), {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
        } catch (e) {
          console.error('[ERROR] Get products failed:', e)
          return new Response(JSON.stringify({ success: false, error: e.message }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
        }
      }

      // ===== 测试禅道连接 =====
      if (method === 'GET' && url.pathname === '/test/zentao') {
        const username =
          typeof CONFIG.ZENTAO_USERNAME === 'function' ? CONFIG.ZENTAO_USERNAME(env) : CONFIG.ZENTAO_USERNAME
        const password =
          typeof CONFIG.ZENTAO_PASSWORD === 'function' ? CONFIG.ZENTAO_PASSWORD(env) : CONFIG.ZENTAO_PASSWORD

        if (!CONFIG.ZENTAO_URL || !username || !password) {
          return new Response(JSON.stringify({ success: false, error: 'Missing Zentao credentials' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
        }

        try {
          const session = await loginZentao(env)
          return new Response(
            JSON.stringify({ success: true, message: '禅道连接成功', session: session.substring(0, 20) + '...' }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }
          )
        } catch (e) {
          return new Response(JSON.stringify({ success: false, error: e.message }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
        }
      }

      // 其他请求返回404
      return new Response('Not Found', { status: 404 })
    } catch (e) {
      console.error('Worker error:', e)
      return new Response(`Error: ${e.message}`, { status: 500 })
    }
  }
}

// ===== Helper Functions =====

/**
 * 解析更新Bug请求
 * 格式: #2262 这个问题是后端API...
 * 支持: @机器人 #2262 内容
 * 支持多行内容
 */
async function parseUpdateRequest(text, event, env) {
  // 匹配 #数字 格式（允许前面有@提及等内容）
  // 使用 [\s\S] 来匹配包括换行符在内的所有字符
  const match = text.match(/#(\d+)\s+([\s\S]+)/)
  if (!match) {
    return null
  }

  // 提取 Bug ID 后面的所有内容
  const bugId = match[1]
  const content = match[2].trim()

  // 获取说话人信息和消息中的 @提及 信息
  const sender = event.sender.sender_id
  console.log('sender', sender)

  const mentions = event.message.mentions || []
  let senderName = sender.user_id // 默认使用 user_id

  // 如果发送者在 mentions 中被提及，使用其名字
  const senderMention = mentions.find((m) => m.id.user_id === sender.user_id || m.id.open_id === sender.open_id)
  if (senderMention && senderMention.name) {
    senderName = senderMention.name
    console.log('[INFO] Found sender name in mentions:', senderName)
  } else {
    // 如果没有在 mentions 中，尝试调用 API（需要权限）
    console.log('[INFO] Sender not in mentions, trying API...')
    senderName = await getLarkUserName(env, sender.user_id, 'user_id')
  }
  const mentionMap = {}
  mentions.forEach((mention) => {
    const key = mention.key // @_user_1, @_user_2 等
    const name = mention.name || mention.id.user_id || mention.id.open_id
    mentionMap[key] = name
  })

  // 替换内容中的 @_user_x 为真实姓名
  let formattedContent = content
  Object.keys(mentionMap).forEach((key) => {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    formattedContent = formattedContent.replace(regex, `@${mentionMap[key]}`)
  })

  // 格式化时间（东八区）
  const now = new Date()
  const chinaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  const timestamp = chinaTime.toISOString().replace('T', ' ').substring(0, 19)

  // 构建表格格式，类似对话记录
  const formattedMessage = `
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <tr style="background-color: #f5f5f5;">
    <td style="width: 150px; vertical-align: top;"><strong>${senderName}</strong></td>
    <td style="vertical-align: top;">
      <div style="color: #999; font-size: 12px; margin-bottom: 5px;">${timestamp}</div>
      <div>${formattedContent}</div>
    </td>
  </tr>
</table>`

  return {
    bugId: bugId,
    newContent: formattedMessage,
    pureContent: formattedContent
  }
}

/**
 * 解析Bug信息
 */
function parseBugInfo(text, event) {
  // 简单解析，你可以根据实际格式调整
  const lines = text.split('\n')
  let title = ''
  let description = text
  let severity = '3' // 默认一般
  let priority = '3' // 默认普通

  // 尝试提取标题（第一行或包含Bug关键词的行）
  for (const line of lines) {
    if (line.includes('【Bug】') || line.includes('[Bug]') || line.includes('bug:')) {
      title = line.replace(/【Bug】|[Bug]|bug:/gi, '').trim()
      // 移除标题中的票号（如果有）
      title = title.replace(/#\d+/g, '').trim()
      break
    }
  }

  if (!title) {
    title = lines[0].substring(0, 100)
    // 移除标题中的票号（如果有）
    title = title.replace(/#\d+/g, '').trim()
  }

  // 提取严重程度
  if (text.includes('严重') || text.includes('紧急') || text.includes('critical')) {
    severity = '1'
    priority = '1'
  } else if (text.includes('重要') || text.includes('high')) {
    severity = '2'
    priority = '2'
  }

  return {
    title: title,
    description: description,
    severity: severity,
    priority: priority,
    reporter: event.sender.sender_id.open_id,
    reporterName: event.sender.sender_id.user_id || '飞书用户'
  }
}

/**
 * 登录禅道获取Session
 */
async function loginZentao(env) {
  console.log('loginZentao envenvenv', env)
  console.error('[CHECKPOINT] Starting Zentao login...')
  const loginUrl = `${CONFIG.ZENTAO_URL}/api.php/v1/tokens`
  const username = typeof CONFIG.ZENTAO_USERNAME === 'function' ? CONFIG.ZENTAO_USERNAME(env) : CONFIG.ZENTAO_USERNAME
  const password = typeof CONFIG.ZENTAO_PASSWORD === 'function' ? CONFIG.ZENTAO_PASSWORD(env) : CONFIG.ZENTAO_PASSWORD

  console.error('[REQUEST] Zentao Login:', {
    url: loginUrl,
    method: 'POST',
    account: username
  })

  const resp = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      account: username,
      password: password
    })
  })

  console.error('[RESPONSE] Zentao Login Status:', resp.status)

  const responseText = await resp.text().catch(() => '')
  console.error('[RESPONSE] Zentao Login Raw Text:', responseText.substring(0, 500))

  if (!resp.ok) {
    console.error('[ERROR] Zentao login failed:', { status: resp.status, body: responseText })
    throw new Error(`Zentao login failed: ${resp.status} ${responseText}`)
  }

  if (!responseText) {
    console.error('[ERROR] Zentao login returned empty response')
    throw new Error('Zentao login returned empty response')
  }

  let result
  try {
    result = JSON.parse(responseText)
    console.error('[METADATA] Zentao Login Response:', JSON.stringify(result, null, 2))
  } catch (e) {
    console.error('[ERROR] Failed to parse Zentao login response as JSON:', e.message)
    throw new Error(`Zentao login response is not valid JSON: ${responseText}`)
  }

  if (!result.token) {
    console.error('[ERROR] No token in Zentao response:', result)
    throw new Error(`Zentao login failed: ${JSON.stringify(result)}`)
  }

  console.error('[CHECKPOINT] Zentao login successful, token:', result.token.substring(0, 20) + '...')
  return result.token
}

/**
 * 更新Bug的steps字段（追加内容）
 */
async function updateBugSteps(env, bugId, newContent, pureContent) {
  console.error('[CHECKPOINT] ========== Starting updateBugSteps ==========')
  console.error('[CHECKPOINT] Bug ID:', bugId)
  console.error('[CHECKPOINT] New Content:', newContent)

  // 先登录获取token
  const token = await loginZentao(env)

  console.log(`[CHECKPOINT] Updating Bug #${bugId} with new content...`)

  // ===== 步骤1: 获取当前Bug信息 =====
  const getBugUrl = `${CONFIG.ZENTAO_URL}/api.php/v1/bugs/${bugId}`
  console.log('[REQUEST] Get Bug:', {
    url: getBugUrl,
    method: 'GET',
    headers: { Token: token.substring(0, 20) + '...' }
  })

  const getBugResp = await fetch(getBugUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Token: token
    }
  })

  console.log('[RESPONSE] Get Bug Status:', getBugResp.status)
  console.log('[RESPONSE] Get Bug Headers:', JSON.stringify([...getBugResp.headers]))

  const getBugText = await getBugResp.text().catch(() => '')
  console.log('[RESPONSE] Get Bug Raw Text (first 1000 chars):', getBugText.substring(0, 1000))

  if (!getBugResp.ok) {
    console.error('[ERROR] Get bug failed:', { status: getBugResp.status, body: getBugText })
    throw new Error(`Get bug failed: ${getBugResp.status} ${getBugText}`)
  }

  if (!getBugText) {
    console.error('[ERROR] Get bug returned empty response')
    throw new Error('Get bug returned empty response')
  }

  let bugInfo
  try {
    bugInfo = JSON.parse(getBugText)
    console.log('[METADATA] Bug Info Structure:', JSON.stringify(bugInfo, null, 2))
  } catch (e) {
    console.error('[ERROR] Failed to parse bug info as JSON:', e.message)
    console.error('[ERROR] Raw response:', getBugText)
    throw new Error(`Get bug response is not valid JSON: ${e.message}`)
  }

  if (!bugInfo.id) {
    console.error('[ERROR] Bug not found, response:', bugInfo)
    throw new Error(`Bug #${bugId} not found`)
  }

  console.log('[CHECKPOINT] Bug retrieved successfully')
  console.log('[METADATA] Bug Title:', bugInfo.title)
  console.log('[METADATA] Bug Status:', bugInfo.status)
  console.log('[METADATA] Bug Severity:', bugInfo.severity)
  console.log('[METADATA] Bug Priority:', bugInfo.pri)
  console.log('[METADATA] Current Steps Length:', (bugInfo.steps || '').length)

  // ===== 检查1: Bug状态检查 =====
  // 如果 Bug 状态为 resolved（已解决），则不允许更新，需要通知用户
  const status = bugInfo.status || ''
  if (status === 'resolved' || status === 'closed') {
    console.error('[ERROR] Bug status is', status, '- cannot update')
    const errorMsg = `#${bugId} 已解决，需要重新开启才能添加`
    // 抛出错误，错误信息会被上层捕获并通知用户
    throw new Error(errorMsg)
  }

  // ===== 检查2: 重复内容检测 =====
  // 检查当前 Bug 的 steps 字段是否已包含相同的内容
  const currentSteps = bugInfo.steps || ''

  // 检查新内容是否已存在于当前 steps 中
  if (currentSteps.includes(pureContent)) {
    console.log('[INFO] Duplicate content detected, skipping update')
    console.log('[INFO] New content:', pureContent.substring(0, 100))
    // 重复内容直接返回，不抛出错误，也不通知用户（静默跳过）
    return {
      id: bugInfo.id,
      duplicate: true,
      message: 'Content already exists, update skipped'
    }
  }

  // ===== 步骤2: 构建更新数据 =====
  const updatedSteps = `${currentSteps}<p>${newContent}</p>`

  const updateData = {
    title: bugInfo.title,
    severity: bugInfo.severity || 1,
    pri: bugInfo.pri || 1,
    type: bugInfo.type || 'codeerror',
    steps: updatedSteps
  }

  console.log('[CHECKPOINT] Prepared update data:', {
    title: updateData.title,
    severity: updateData.severity,
    pri: updateData.pri,
    type: updateData.type,
    stepsLength: updatedSteps.length,
    addedContent: newContent
  })

  // ===== 步骤3: 更新Bug =====
  const updateBugUrl = `${CONFIG.ZENTAO_URL}/api.php/v1/bugs/${bugId}`
  console.log('[REQUEST] Update Bug:', {
    url: updateBugUrl,
    method: 'PUT',
    headers: { Token: token.substring(0, 20) + '...' },
    bodySize: JSON.stringify(updateData).length
  })

  const updateResp = await fetch(updateBugUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Token: token
    },
    body: JSON.stringify(updateData)
  })

  console.log('[RESPONSE] Update Bug Status:', updateResp.status)
  console.log('[RESPONSE] Update Bug Headers:', JSON.stringify([...updateResp.headers]))

  const updateRespText = await updateResp.text().catch(() => '')
  console.log('[RESPONSE] Update Bug Raw Text (first 1000 chars):', updateRespText.substring(0, 1000))

  if (!updateResp.ok) {
    console.error('[ERROR] Update bug failed:', { status: updateResp.status, body: updateRespText })
    throw new Error(`Update bug failed: ${updateResp.status} ${updateRespText}`)
  }

  if (!updateRespText) {
    console.error('[ERROR] Update bug returned empty response')
    throw new Error('Update bug returned empty response')
  }

  let result
  try {
    result = JSON.parse(updateRespText)
    console.log('[METADATA] Update Bug Response:', JSON.stringify(result, null, 2))
  } catch (e) {
    console.error('[ERROR] Failed to parse update response as JSON:', e.message)
    console.error('[ERROR] Raw response:', updateRespText)
    throw new Error(`Update bug response is not valid JSON: ${e.message}`)
  }

  if (!result.id) {
    console.error('[ERROR] No ID in update response:', result)
    throw new Error(`Update bug failed: ${JSON.stringify(result)}`)
  }

  console.log('[CHECKPOINT] Bug updated successfully, ID:', result.id)
  console.log('[CHECKPOINT] ========== updateBugSteps completed ==========')

  return {
    ...result,
    newContent: newContent
  }
}

/**
 * 提交Bug到禅道
 */
async function submitToZentao(env, bugInfo) {
  console.log('[CHECKPOINT] ========== Starting submitToZentao ==========')
  console.log('[CHECKPOINT] Bug Info:', {
    title: bugInfo.title,
    severity: bugInfo.severity,
    priority: bugInfo.priority
  })

  // 先登录获取token
  const token = await loginZentao(env)

  // 使用配置的产品ID
  const productId =
    typeof CONFIG.ZENTAO_PRODUCT_ID === 'function' ? CONFIG.ZENTAO_PRODUCT_ID(env) : CONFIG.ZENTAO_PRODUCT_ID

  console.log('[CHECKPOINT] Using Zentao Product ID:', productId)

  // 提交Bug
  const bugUrl = `${CONFIG.ZENTAO_URL}/api.php/v1/products/${productId}/bugs`

  const bugData = {
    title: bugInfo.title,
    openedBuild: 'trunk', // 或使用实际的版本
    steps: bugInfo.description,
    severity: bugInfo.severity || '3',
    pri: bugInfo.priority || '3',
    type: 'codeerror',
    os: 'all',
    browser: 'all'
  }

  console.log('[REQUEST] Submit Bug:', {
    url: bugUrl,
    method: 'POST',
    headers: { Token: token.substring(0, 20) + '...' },
    data: bugData
  })

  const resp = await fetch(bugUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Token: token
    },
    body: JSON.stringify(bugData)
  })

  console.log('[RESPONSE] Submit Bug Status:', resp.status)
  console.log('[RESPONSE] Submit Bug Headers:', JSON.stringify([...resp.headers]))

  const responseText = await resp.text().catch(() => '')
  console.log('[RESPONSE] Submit Bug Raw Text (first 1000 chars):', responseText.substring(0, 1000))

  if (!resp.ok) {
    console.error('[ERROR] Submit bug failed:', { status: resp.status, body: responseText })
    throw new Error(`Submit bug failed: ${resp.status} ${responseText}`)
  }

  if (!responseText) {
    console.error('[ERROR] Submit bug returned empty response')
    throw new Error('Submit bug returned empty response')
  }

  let result
  try {
    result = JSON.parse(responseText)
    console.log('[METADATA] Submit Bug Response:', JSON.stringify(result, null, 2))
  } catch (e) {
    console.error('[ERROR] Failed to parse submit response as JSON:', e.message)
    console.error('[ERROR] Raw response:', responseText)
    throw new Error(`Submit bug response is not valid JSON: ${e.message}`)
  }

  if (!result.id) {
    console.error('[ERROR] No ID in submit response:', result)
    throw new Error(`Submit bug failed: ${JSON.stringify(result)}`)
  }

  console.log('[CHECKPOINT] Bug submitted successfully, ID:', result.id)
  console.log('[CHECKPOINT] ========== submitToZentao completed ==========')

  return {
    ...result,
    productId: productId // 返回使用的产品ID
  }
}

/**
 * 获取飞书租户访问令牌
 */
async function getTenantAccessToken(env) {
  const resp = await fetch('https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      app_id: env.LARK_APP_ID,
      app_secret: env.LARK_APP_SECRET
    })
  })

  if (!resp.ok) {
    throw new Error(`Get TAT failed: HTTP ${resp.status}`)
  }

  const result = await resp.json()
  if (!result.tenant_access_token) {
    throw new Error(`Get TAT failed: ${JSON.stringify(result)}`)
  }

  return result.tenant_access_token
}

/**
 * 获取被回复的父消息内容
 * 用途：当用户回复某条消息并@机器人时，获取被回复的原消息内容
 *
 * @param {Object} env - 环境变量对象（包含飞书 APP_ID 和 APP_SECRET）
 * @param {string} messageId - 父消息的 message_id
 * @returns {Object|null} 返回包含消息内容、类型和提及信息的对象，失败时返回 null
 *
 * 返回格式:
 * {
 *   content: string,      // 消息文本内容
 *   message_type: string, // 消息类型（text）
 *   mentions: Array       // @提及列表
 * }
 */
async function getParentMessage(env, messageId) {
  try {
    // 1. 获取飞书访问令牌
    const token = await getTenantAccessToken(env)
    const url = `https://open.feishu.cn/open-apis/im/v1/messages/${messageId}`

    console.error('[REQUEST] Get Parent Message:', { messageId, url })

    // 2. 调用飞书 API 获取消息详情
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const responseText = await resp.text()
    console.error('[RESPONSE] Get Parent Message Status:', resp.status)
    console.error('[RESPONSE] Get Parent Message Body:', responseText.substring(0, 500))

    if (!resp.ok) {
      console.error('[ERROR] Get parent message failed:', resp.status, responseText)
      return null
    }

    // 3. 解析响应数据
    const result = JSON.parse(responseText)
    console.error('[METADATA] Parent Message Info:', JSON.stringify(result, null, 2))

    // 4. 提取消息内容（只处理文本消息）
    if (result.data && result.data.items && result.data.items[0]) {
      const message = result.data.items[0]
      if (message.msg_type === 'text') {
        const content = JSON.parse(message.body.content)
        console.error('[METADATA] Parent Message Content:', content.text)
        return {
          content: content.text || '',
          message_type: message.msg_type,
          mentions: message.mentions || []
        }
      }
    }

    console.error('[INFO] Parent message not found or not text type')
    return null
  } catch (e) {
    console.error('[ERROR] Get parent message failed:', e.message)
    return null // 失败时优雅降级，返回 null
  }
}

/**
 * 获取飞书用户信息（姓名）
 */
async function getLarkUserName(env, userId, userIdType = 'user_id') {
  try {
    const token = await getTenantAccessToken(env)
    const url = `https://open.feishu.cn/open-apis/contact/v3/users/${userId}?user_id_type=${userIdType}`

    console.error('[REQUEST] Get Lark User Info:', { userId, userIdType, url })

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const responseText = await resp.text()
    console.error('[RESPONSE] Get Lark User Info Status:', resp.status)
    console.error('[RESPONSE] Get Lark User Info Body:', responseText)

    if (!resp.ok) {
      console.error('[ERROR] Get user info failed:', resp.status, responseText)
      return userId // 失败时返回原始 ID
    }

    const result = JSON.parse(responseText)
    console.error('[METADATA] Lark User Info:', JSON.stringify(result, null, 2))

    const userInfo = result.data?.user
    // 优先使用中文名，其次英文名，最后用昵称
    const name = userInfo?.name || userInfo?.en_name || userInfo?.nickname || userId

    console.error('[METADATA] User Name:', name)
    return name
  } catch (e) {
    console.error('[ERROR] Get user name failed:', e.message)
    return userId // 失败时返回原始 ID
  }
}

/**
 * 回复飞书消息
 */
async function replyLarkMessage(env, messageId, result) {
  const token = await getTenantAccessToken(env)

  let cardContent

  if (result.success) {
    // 成功卡片
    cardContent = {
      config: { wide_screen_mode: true },
      header: {
        title: { tag: 'plain_text', content: '✅ Bug已提交到禅道' },
        template: 'green'
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**禅道Bug ID**: ${result.zentaoId}\n**产品ID**: #${
              result.productId || 'default'
            }\n**提交时间**: ${new Date().toLocaleString('zh-CN')}`
          }
        },
        {
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: { tag: 'plain_text', content: '查看禅道Bug' },
              type: 'primary',
              url: result.zentaoUrl
            }
          ]
        }
      ]
    }
  } else {
    // 失败卡片
    cardContent = {
      config: { wide_screen_mode: true },
      header: {
        title: { tag: 'plain_text', content: '❌ Bug提交失败' },
        template: 'red'
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**错误信息**: ${result.error}\n**时间**: ${new Date().toLocaleString('zh-CN')}`
          }
        }
      ]
    }
  }

  const resp = await fetch(`https://open.larksuite.com/open-apis/im/v1/messages/${messageId}/reply`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      msg_type: 'interactive',
      content: JSON.stringify(cardContent)
    })
  })

  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    console.error(`Reply message failed: ${resp.status} ${text}`)
  }
}
