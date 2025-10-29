#!/bin/bash

# 日志记录模块
# 提供日志记录和日志文件管理功能

# 全局变量
BUILD_LOG_FILE="${BUILD_LOG_FILE:-/tmp/build_$(date '+%Y%m%d_%H%M%S').log}"

# 初始化日志文件（带 UTF-8 BOM）
init_log_file() {
    echo -ne '\xEF\xBB\xBF' > "$BUILD_LOG_FILE"
}

# 日志记录函数
log_message() {
    local message="$1"
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $message" | tee -a "$BUILD_LOG_FILE"
}

# 清理旧日志文件，只保留最近5个
cleanup_old_logs() {
    local log_dir="${1:-/tmp}"
    local log_prefix="${2:-build_}"

    # 列出所有构建日志文件（按时间从旧到新排序），删除旧的文件，只保留最新的5个
    find "$log_dir" -name "${log_prefix}*.log" -type f -printf '%T+ %p\n' | \
    sort | \
    head -n -5 | \
    awk '{print $2}' | \
    xargs -r rm -f

    log_message "已清理旧日志文件"
}

# 统计日志中的警告和错误数量
get_log_stats() {
    local warning_count=$(grep -i "warning" "$BUILD_LOG_FILE" | wc -l)
    local error_count=$(grep -i "error" "$BUILD_LOG_FILE" | wc -l)

    echo "WARNING_COUNT=${warning_count}"
    echo "ERROR_COUNT=${error_count}"
}
