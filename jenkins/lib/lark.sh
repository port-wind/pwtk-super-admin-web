#!/bin/bash

# Lark (飞书) 通知模块
# 提供 Lark Webhook 通知功能

# Lark Webhook 配置
LARK_WEBHOOK_URL="${LARK_WEBHOOK_URL:-https://open.larksuite.com/open-apis/bot/v2/hook/7142cabc-603b-423f-8081-315cd3c19365}"

# 发送 Lark 消息的函数
send_lark_message() {
    local title="$1"
    local content="$2"

    # 根据标题判断颜色（成功=绿色，失败=红色，其他=蓝色）
    local color="blue"
    if echo "$title" | grep -q "✅\|成功"; then
        color="green"
    elif echo "$title" | grep -q "❌\|失败"; then
        color="red"
    fi

    # 转义 JSON 特殊字符（简化版，只处理必要的转义）
    local escaped_title=$(echo "$title" | sed 's/"/\\"/g')
    local escaped_content=$(echo "$content" | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')

    # 构建 JSON payload（使用测试脚本中验证过的格式）
    local payload="{
    \"msg_type\": \"interactive\",
    \"card\": {
        \"header\": {
            \"title\": {
                \"tag\": \"plain_text\",
                \"content\": \"${escaped_title}\"
            },
            \"template\": \"${color}\"
        },
        \"elements\": [
            {
                \"tag\": \"div\",
                \"text\": {
                    \"tag\": \"lark_md\",
                    \"content\": \"${escaped_content}\"
                }
            }
        ]
    }
}"

    # 发送到 Lark（记录响应）
    local response=$(curl -s -X POST "${LARK_WEBHOOK_URL}" \
        -H "Content-Type: application/json" \
        -d "$payload")

    # 检查是否成功
    if echo "$response" | grep -q '"code":0'; then
        if type -t log_message > /dev/null 2>&1; then
            log_message "✓ Lark 通知发送成功"
        fi
    else
        if type -t log_message > /dev/null 2>&1; then
            log_message "✗ Lark 通知发送失败: $response"
        fi
    fi
}

# 发送修复通知到 Lark 的函数
send_lark_fix_notification() {
    local project_name="$1"
    local build_time="$2"
    local commit_hash="$3"
    local fix_count="$4"
    local fix_list="$5"
    local branch="$6"
    local env="$7"

    local title="🔧 ${project_name} - 发现 ${fix_count} 个修复"

    # 转义 Markdown 特殊字符
    local escaped_fixes=$(echo "$fix_list" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')

    local content="**构建时间:** ${build_time}
**分支:** ${branch}
**环境:** ${env}
**提交:** ${commit_hash}
**修复数量:** ${fix_count}

---

**修复内容:**
${escaped_fixes}

---
✅ 构建成功并已部署"

    log_message "发送 Lark 通知: ${title}"
    send_lark_message "$title" "$content"
}
