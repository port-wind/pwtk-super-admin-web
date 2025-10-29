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

# 发送版本发布通知（带 Bug 链接）
send_release_notification_with_bugs() {
    local previous_tag="$1"
    local current_tag="$2"
    local bug_count="$3"
    local bug_list="$4"          # 格式: bug_id|bug_title|zentao_url (每行一个)
    local code_changes="$5"       # 格式: type|commit_message (每行一个)

    # 构建已解决 Bug 链接列表
    local bug_section=""
    if [ ${bug_count} -gt 0 ] && [ -n "$bug_list" ]; then
        bug_section="\\n\\n**已解决Bug** (${bug_count}个):\\n"
        while IFS='|' read -r bug_id bug_title bug_url; do
            if [ -n "$bug_id" ] && [ -n "$bug_url" ]; then
                # 使用 Markdown 链接格式
                bug_section="${bug_section}• [#${bug_id} ${bug_title}](${bug_url})\\n"
            fi
        done <<< "$bug_list"
    fi

    # 构建代码更改列表
    local changes_section=""
    if [ -n "$code_changes" ]; then
        changes_section="\\n\\n**代码更改:**\\n"
        while IFS='|' read -r change_type change_message; do
            if [ -n "$change_type" ] && [ -n "$change_message" ]; then
                changes_section="${changes_section}• ${change_type}: ${change_message}\\n"
            fi
        done <<< "$code_changes"
    fi

    # 构建完整消息内容
    local content="**版本:** ${previous_tag} → ${current_tag}${bug_section}${changes_section}"

    # 发送飞书卡片通知
    curl -s -X POST "${LARK_WEBHOOK_URL}" \
        -H "Content-Type: application/json" \
        -d "{
            \"msg_type\": \"interactive\",
            \"card\": {
                \"header\": {
                    \"title\": {
                        \"tag\": \"plain_text\",
                        \"content\": \"🚀 pwtk super admin 版本发布 ${current_tag}\"
                    },
                    \"template\": \"blue\"
                },
                \"elements\": [
                    {
                        \"tag\": \"div\",
                        \"text\": {
                            \"tag\": \"lark_md\",
                            \"content\": \"${content}\"
                        }
                    }
                ]
            }
        }" > /dev/null

    if type -t log_message > /dev/null 2>&1; then
        log_message "✓ 版本发布通知已发送 (Bug: ${bug_count})"
    fi
}
