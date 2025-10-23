#!/bin/bash

# Telegram 通知模块
# 提供 Telegram Bot 消息发送和文件上传功能

# Telegram Bot 配置（从环境变量读取，如果没有则使用默认值）
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-8132916684:AAEd1oObTMPxxcLV6LICKIDTPf1vBSn2rGk}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-7061322031}"

# 发送 Telegram 消息的函数
send_telegram_message() {
    local message="$1"

    if [ "$(type -t log_message)" = "function" ]; then
        log_message "Telegram通知: $message"
    fi

    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -H "Content-Type: application/json; charset=utf-8" \
        -d "$(echo -n "{\"chat_id\":\"${TELEGRAM_CHAT_ID}\",\"text\":\"${message}\",\"parse_mode\":\"HTML\"}" | iconv -f UTF-8 -t UTF-8)"
}

# 发送文件到 Telegram 的函数
send_telegram_file() {
    local file="$1"
    local caption="$2"

    if [ "$(type -t log_message)" = "function" ]; then
        log_message "发送日志文件到Telegram: $caption"
    fi

    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument" \
        -H "Content-Type: multipart/form-data; charset=utf-8" \
        -F "chat_id=${TELEGRAM_CHAT_ID}" \
        -F "document=@$file" \
        -F "caption=$caption"
}

# 更新进度条的函数
update_progress() {
    local percent=$1
    local step_name="$2"
    local progress_bar=""
    local filled=$((percent / 10))
    local empty=$((10 - filled))

    # 构建进度条
    for ((i=0; i<filled; i++)); do
        progress_bar="${progress_bar}🟩"
    done
    for ((i=0; i<empty; i++)); do
        progress_bar="${progress_bar}⬜"
    done

    # 如果达到100%，添加成功标记
    if [ $percent -eq 100 ]; then
        progress_bar="${progress_bar}　${percent}% ✅"
    else
        progress_bar="${progress_bar}　${percent}%"
    fi

    # 发送进度更新
    send_telegram_message "构建进度: ${step_name}
${progress_bar}"
}

# 发送构建开始通知
send_build_start_notification() {
    local project_name="$1"
    local build_time="$2"
    local commit_date="$3"
    local commit_message="$4"
    local branch_name="$5"
    local env="$6"

    send_telegram_message "🚀 构建开始
时间: ${build_time}
项目名称: ${project_name}
提交代码日期: ${commit_date}
提交信息: ${commit_message}
分支: ${branch_name}
环境: ${env}"
}

# 发送构建成功通知
send_build_success_notification() {
    local project_name="$1"
    local build_time="$2"
    local commit_date="$3"
    local commit_message="$4"
    local commit_hash="$5"
    local branch_name="$6"
    local env="$7"
    local minutes="$8"
    local seconds="$9"

    send_telegram_message "✅ 构建成功
时间: ${build_time}
项目名称: ${project_name}
提交代码日期: ${commit_date}
提交信息: ${commit_message}
commit hash: ${commit_hash}
分支: ${branch_name}
环境: ${env}
耗时: ${minutes}分${seconds}秒"
}

# 发送构建失败通知
send_build_failure_notification() {
    local project_name="$1"
    local fail_time="$2"
    local commit_date="$3"
    local commit_message="$4"
    local commit_hash="$5"
    local branch_name="$6"
    local env="$7"
    local fail_stage="$8"
    local error_message="$9"
    local minutes="${10}"
    local seconds="${11}"

    send_telegram_message "❌ 构建失败
时间: ${fail_time}
项目名称: ${project_name}
提交代码日期: ${commit_date}
提交信息: ${commit_message}
commit hash: ${commit_hash}
分支: ${branch_name}
环境: ${env}
失败阶段: ${fail_stage}
错误: ${error_message}
耗时: ${minutes}分${seconds}秒"
}
