#!/bin/bash

# 禅道 Bug 追踪模块
# 提供禅道 API 集成功能

# 禅道配置
PRODUCT_ID=1
ZENTAO_API_URL="https://zentao.pwtk.cc/zentao/api.php/v1"
ZENTAO_BUG_BASE_URL="https://zentao.pwtk.cc/zentao/bug-view-"

# 发送飞书 Bug 解决通知（卡片格式）
send_bug_resolved_notification() {
    local bug_id="$1"
    local bug_title="$2"
    local old_status="$3"
    local commit_info="$4"
    local bug_url="$5"

    curl -s -X POST "${LARK_WEBHOOK_URL}" \
        -H "Content-Type: application/json" \
        -d "{
            \"msg_type\": \"interactive\",
            \"card\": {
                \"header\": {
                    \"title\": {
                        \"tag\": \"plain_text\",
                        \"content\": \"🐛 pwtk超管端Bug更新\"
                    },
                    \"template\": \"green\"
                },
                \"elements\": [
                    {
                        \"tag\": \"div\",
                        \"text\": {
                            \"tag\": \"lark_md\",
                            \"content\": \"**Bug #${bug_id}**: ${bug_title}\\n**状态变化**: ${old_status} → resolved ✅\\n**相关提交**: ${commit_info}\"
                        }
                    },
                    {
                        \"tag\": \"action\",
                        \"actions\": [
                            {
                                \"tag\": \"button\",
                                \"text\": {
                                    \"tag\": \"plain_text\",
                                    \"content\": \"查看详情\"
                                },
                                \"type\": \"primary\",
                                \"url\": \"${bug_url}\"
                            }
                        ]
                    }
                ]
            }
        }" > /dev/null
}

# 发送飞书版本发布汇总通知（卡片格式）
send_release_summary_notification() {
    local previous_tag="$1"
    local current_tag="$2"
    local resolved_count="$3"
    local resolved_bugs="$4"

    # 构建已解决 Bug 链接列表
    local resolved_links=""
    if [ -n "$resolved_bugs" ]; then
        while IFS='|' read -r bug_info bug_url; do
            if [ -n "$bug_info" ]; then
                resolved_links="${resolved_links}• [${bug_info}](${bug_url})\\n"
            fi
        done <<< "$resolved_bugs"
    fi

    # 构建完整消息内容
    local content="**版本**: ${previous_tag} → ${current_tag}\\n\\n"

    if [ ${resolved_count} -gt 0 ]; then
        content="${content}**已解决Bug** (${resolved_count}个):\\n${resolved_links}"
    else
        content="${content}**本次发布未解决Bug**"
    fi

    curl -s -X POST "${LARK_WEBHOOK_URL}" \
        -H "Content-Type: application/json" \
        -d "{
            \"msg_type\": \"interactive\",
            \"card\": {
                \"header\": {
                    \"title\": {
                        \"tag\": \"plain_text\",
                        \"content\": \"🚀 pwtk超管端版本发布\"
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
}

# 禅道 Bug 追踪主流程
# 参数:
#   $1: start_ref - 起始引用
#   $2: end_ref - 结束引用
#   $3: version_info - 版本信息
#   $4: update_status - 是否更新禅道状态 (true/false)，默认为 false
process_zentao_bugs() {
    local start_ref="$1"
    local end_ref="$2"
    local version_info="$3"
    local update_status="${4:-false}"  # 默认为 false，只汇总不更新

    if type -t log_message > /dev/null 2>&1; then
        log_message "=============== 禅道 Bug 追踪开始 ==============="
        log_message "分析范围: ${start_ref}..${end_ref}"
        log_message "版本信息: ${version_info}"
        log_message "更新禅道状态: ${update_status}"
    fi

    # 初始化 bug 列表数组
    declare -A BUG_MAP  # 关联数组：bug_id => "commit_hash|author|message"

    # 获取所有符合格式的 commits
    while IFS='|' read -r commit_hash author commit_message; do
        # 使用正则提取 bug ID（支持 fix:2262, fix-2262, fix: 2262 2265）
        if echo "$commit_message" | grep -qE "fix[:-]\s*[0-9]"; then
            # 提取所有数字（bug ID）
            bug_ids=$(echo "$commit_message" | grep -oE "fix[:-]\s*([0-9]+(\s+[0-9]+)*)" | sed -E 's/fix[:-]\s*//')

            if [ -n "$bug_ids" ]; then
                if type -t log_message > /dev/null 2>&1; then
                    log_message "发现 Bug 修复: [$commit_hash] $author - $commit_message"
                fi

                # 分割多个 bug ID
                for bug_id in $bug_ids; do
                    if [ -n "$bug_id" ]; then
                        # 存储到关联数组（如果已存在则追加）
                        if [ -n "${BUG_MAP[$bug_id]}" ]; then
                            BUG_MAP[$bug_id]="${BUG_MAP[$bug_id]}
${commit_hash}|${author}|${commit_message}"
                        else
                            BUG_MAP[$bug_id]="${commit_hash}|${author}|${commit_message}"
                        fi
                    fi
                done
            fi
        fi
    done < <(git log "${start_ref}..${end_ref}" --pretty=format:"%h|%an|%s")

    # 统计发现的 bug 数量
    BUG_COUNT=${#BUG_MAP[@]}

    if type -t log_message > /dev/null 2>&1; then
        log_message "共发现 ${BUG_COUNT} 个 Bug"
    fi

    if [ $BUG_COUNT -eq 0 ]; then
        if type -t log_message > /dev/null 2>&1; then
            log_message "本次构建未发现符合格式的 Bug 修复"
            log_message "=============== 禅道 Bug 追踪结束 ==============="
        fi
        return 0
    fi

    # 获取禅道 Token
    if type -t log_message > /dev/null 2>&1; then
        log_message "正在获取禅道 API Token..."
    fi

    ZENTAO_TOKEN_RESPONSE=$(curl -s -X POST "${ZENTAO_API_URL}/tokens" \
        -H "Content-Type: application/json" \
        -d "{\"account\":\"${ZENTAO_USERNAME}\",\"password\":\"${ZENTAO_PASSWORD}\"}")

    ZENTAO_TOKEN=$(echo "$ZENTAO_TOKEN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

    if [ -z "$ZENTAO_TOKEN" ]; then
        if type -t log_message > /dev/null 2>&1; then
            log_message "警告: 无法获取禅道 Token，仅生成链接列表"
            log_message "响应: ${ZENTAO_TOKEN_RESPONSE}"
        fi

        # 不更新状态，只生成链接列表
        BUG_LINKS=""
        for bug_id in $(echo "${!BUG_MAP[@]}" | tr ' ' '\n' | sort -n); do
            COMMIT_INFO=""
            while IFS= read -r commit_line; do
                commit_hash=$(echo "$commit_line" | cut -d'|' -f1)
                author=$(echo "$commit_line" | cut -d'|' -f2)
                COMMIT_INFO="${COMMIT_INFO}  修复人: ${author} [${commit_hash}]
"
            done <<< "${BUG_MAP[$bug_id]}"

            BUG_LINKS="${BUG_LINKS}#${bug_id}
${COMMIT_INFO}  ${ZENTAO_BUG_BASE_URL}${bug_id}.html

"
        done

        if type -t send_telegram_message > /dev/null 2>&1; then
            send_telegram_message "🐛 Bug 修复汇总
版本: ${version_info}

${BUG_LINKS}
📊 总计: ${BUG_COUNT} 个 Bug 已修复
⚠️ 禅道状态未更新（Token获取失败）"
        fi
        return 1
    fi

    if type -t log_message > /dev/null 2>&1; then
        log_message "成功获取禅道 Token"
    fi

    # 初始化汇总信息
    BUG_LINKS=""
    RESOLVED_COUNT=0
    ERROR_COUNT=0
    RESOLVED_BUGS_LIST=""

    # 处理每个 bug（按 bug ID 排序）
    for bug_id in $(echo "${!BUG_MAP[@]}" | tr ' ' '\n' | sort -n); do
        if type -t log_message > /dev/null 2>&1; then
            log_message "----------------------------------------"
            log_message "处理 Bug #${bug_id}"
        fi

        # 查询 bug 状态
        BUG_INFO=$(curl -s -X GET "${ZENTAO_API_URL}/bugs/${bug_id}" \
            -H "Token: ${ZENTAO_TOKEN}")

        # 使用 Python 解析 JSON，正确处理中文
        BUG_STATUS=$(echo "$BUG_INFO" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('status', ''))" 2>/dev/null)
        BUG_TITLE=$(echo "$BUG_INFO" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('title', ''))" 2>/dev/null)
        BUG_OPENED_BY=$(echo "$BUG_INFO" | python3 -c "import sys, json; data=json.load(sys.stdin); openedBy=data.get('openedBy', {}); print(openedBy.get('account', '') if isinstance(openedBy, dict) else '')" 2>/dev/null)

        if [ -z "$BUG_STATUS" ]; then
            if type -t log_message > /dev/null 2>&1; then
                log_message "警告: 无法获取 Bug #${bug_id} 的状态信息"
            fi
            ERROR_COUNT=$((ERROR_COUNT + 1))

            # 添加到列表，标记为错误
            COMMIT_INFO=""
            while IFS= read -r commit_line; do
                commit_hash=$(echo "$commit_line" | cut -d'|' -f1)
                author=$(echo "$commit_line" | cut -d'|' -f2)
                COMMIT_INFO="${COMMIT_INFO}  修复人: ${author} [${commit_hash}]
"
            done <<< "${BUG_MAP[$bug_id]}"

            BUG_LINKS="${BUG_LINKS}❌ #${bug_id} (查询失败)
${COMMIT_INFO}  ${ZENTAO_BUG_BASE_URL}${bug_id}.html

"
            continue
        fi

        if type -t log_message > /dev/null 2>&1; then
            log_message "Bug #${bug_id} 状态: ${BUG_STATUS}"
            log_message "Bug #${bug_id} 标题: ${BUG_TITLE}"
            log_message "Bug #${bug_id} 创建者: ${BUG_OPENED_BY}"
        fi

        # 获取提交信息（所有情况都需要）
        COMMIT_INFO=""
        while IFS= read -r commit_line; do
            commit_hash=$(echo "$commit_line" | cut -d'|' -f1)
            author=$(echo "$commit_line" | cut -d'|' -f2)
            COMMIT_INFO="${COMMIT_INFO}  修复人: ${author} [${commit_hash}]
"
        done <<< "${BUG_MAP[$bug_id]}"

        # 检查是否为未解决状态（active 或 wait 状态）
        if [ "$BUG_STATUS" = "active" ] || [ "$BUG_STATUS" = "wait" ]; then
            # 根据 update_status 参数决定是否更新禅道状态
            if [ "$update_status" = "true" ]; then
                if type -t log_message > /dev/null 2>&1; then
                    log_message "Bug #${bug_id} 状态为未解决，准备更新为已解决..."
                fi

                # 准备 comment（包含所有相关 commit 信息）
                COMMENT="已修复该问题

相关提交："
                while IFS= read -r commit_info; do
                    commit_hash=$(echo "$commit_info" | cut -d'|' -f1)
                    author=$(echo "$commit_info" | cut -d'|' -f2)
                    message=$(echo "$commit_info" | cut -d'|' -f3)
                    COMMENT="${COMMENT}
- [${commit_hash}] ${author}: ${message}"
                done <<< "${BUG_MAP[$bug_id]}"

                COMMENT="${COMMENT}

详情链接: ${ZENTAO_BUG_BASE_URL}${bug_id}.html"

                # 生成解决 bug 的 JSON payload
                RESOLVE_JSON_FILE="/tmp/zentao_resolve_${bug_id}_$$.json"

                # 确定指派对象：优先使用创建者，如果获取失败则使用当前用户
                ASSIGNEE="${BUG_OPENED_BY}"
                if [ -z "$ASSIGNEE" ]; then
                    if type -t log_message > /dev/null 2>&1; then
                        log_message "警告: 无法获取 Bug #${bug_id} 创建者，将指派给当前用户 ${ZENTAO_USERNAME}"
                    fi
                    ASSIGNEE="${ZENTAO_USERNAME}"
                fi

                python3 -c "import json; print(json.dumps({
    'resolution': 'fixed',
    'resolvedBuild': 'trunk',
    'resolvedDate': '$(date "+%Y-%m-%d %H:%M:%S")',
    'assignedTo': '${ASSIGNEE}',
    'comment': '''${COMMENT}'''
}, ensure_ascii=False, indent=2))" > "$RESOLVE_JSON_FILE"

                # 调用 API 解决 bug
                RESOLVE_RESPONSE=$(curl -s -X POST "${ZENTAO_API_URL}/bugs/${bug_id}/resolve" \
                    -H "Token: ${ZENTAO_TOKEN}" \
                    -H "Content-Type: application/json" \
                    -d @"$RESOLVE_JSON_FILE")

                # 清理临时文件
                rm -f "$RESOLVE_JSON_FILE"

                # 检查是否成功
                if echo "$RESOLVE_RESPONSE" | grep -q '"id"'; then
                    if type -t log_message > /dev/null 2>&1; then
                        log_message "✅ 成功解决 Bug #${bug_id}"
                    fi
                    RESOLVED_COUNT=$((RESOLVED_COUNT + 1))
                    BUG_LINKS="${BUG_LINKS}✅ #${bug_id} - ${BUG_TITLE}
${COMMIT_INFO}  ${ZENTAO_BUG_BASE_URL}${bug_id}.html

"
                    # 添加到已解决Bug列表
                    RESOLVED_BUGS_LIST="${RESOLVED_BUGS_LIST}#${bug_id} ${BUG_TITLE}|${ZENTAO_BUG_BASE_URL}${bug_id}.html
"

                    # 发送飞书通知
                    BUG_URL="${ZENTAO_BUG_BASE_URL}${bug_id}.html"
                    COMMIT_SUMMARY=$(echo "${BUG_MAP[$bug_id]}" | head -1 | awk -F'|' '{print "[" $1 "] " $3}')
                    send_bug_resolved_notification "${bug_id}" "${BUG_TITLE}" "${BUG_STATUS}" "${COMMIT_SUMMARY}" "${BUG_URL}"

                    if type -t log_message > /dev/null 2>&1; then
                        log_message "飞书通知已发送 (Bug #${bug_id})"
                    fi
                else
                    if type -t log_message > /dev/null 2>&1; then
                        log_message "❌ 解决 Bug #${bug_id} 失败: ${RESOLVE_RESPONSE}"
                    fi
                    ERROR_COUNT=$((ERROR_COUNT + 1))
                    BUG_LINKS="${BUG_LINKS}❌ #${bug_id} - ${BUG_TITLE} (更新失败)
${COMMIT_INFO}  ${ZENTAO_BUG_BASE_URL}${bug_id}.html

"
                fi
            else
                # 只汇总，不更新禅道状态
                if type -t log_message > /dev/null 2>&1; then
                    log_message "Bug #${bug_id} 状态为未解决，但只汇总不更新禅道状态"
                fi
                RESOLVED_COUNT=$((RESOLVED_COUNT + 1))
                BUG_LINKS="${BUG_LINKS}📋 #${bug_id} - ${BUG_TITLE}
${COMMIT_INFO}  ${ZENTAO_BUG_BASE_URL}${bug_id}.html

"
                # 添加到已解决Bug列表
                RESOLVED_BUGS_LIST="${RESOLVED_BUGS_LIST}#${bug_id} ${BUG_TITLE}|${ZENTAO_BUG_BASE_URL}${bug_id}.html
"
            fi
        elif [ "$BUG_STATUS" = "resolved" ] || [ "$BUG_STATUS" = "closed" ]; then
            if type -t log_message > /dev/null 2>&1; then
                log_message "Bug #${bug_id} 已经是 ${BUG_STATUS} 状态，跳过更新（不显示在通知中）"
            fi
            # 不添加到BUG_LINKS，不计数，不发通知
        else
            if type -t log_message > /dev/null 2>&1; then
                log_message "Bug #${bug_id} 状态为 ${BUG_STATUS}，跳过更新（不显示在通知中）"
            fi
            # 不添加到BUG_LINKS，不计数，不发通知
        fi
    done

    if type -t log_message > /dev/null 2>&1; then
        log_message "=============== 禅道 Bug 追踪完成 ==============="
        log_message "总计: ${BUG_COUNT} 个 Bug"
        log_message "已解决: ${RESOLVED_COUNT} 个"
        log_message "失败: ${ERROR_COUNT} 个"
    fi

    # 发送 Telegram 通知
    if type -t send_telegram_message > /dev/null 2>&1; then
        send_telegram_message "🐛 Bug 修复汇总
版本: ${version_info}

${BUG_LINKS}
📊 统计:
- 已解决: ${RESOLVED_COUNT} 个
- 失败: ${ERROR_COUNT} 个"
    fi

    # 发送飞书版本发布汇总通知（仅在有解决Bug时发送）
    if [ ${RESOLVED_COUNT} -gt 0 ] || [ ${ERROR_COUNT} -gt 0 ]; then
        if type -t log_message > /dev/null 2>&1; then
            log_message "发送飞书版本发布汇总通知..."
        fi
        send_release_summary_notification "${start_ref}" "${end_ref}" "${RESOLVED_COUNT}" "${RESOLVED_BUGS_LIST}"
        if type -t log_message > /dev/null 2>&1; then
            log_message "飞书版本发布通知已发送"
        fi
    else
        if type -t log_message > /dev/null 2>&1; then
            log_message "本次构建无Bug状态变更，跳过飞书版本汇总通知"
        fi
    fi

    if type -t log_message > /dev/null 2>&1; then
        log_message "=============== 禅道 Bug 追踪结束 ==============="
    fi
}
