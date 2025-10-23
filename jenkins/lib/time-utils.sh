#!/bin/bash

# 时间工具模块
# 提供网络时间获取和时间计算功能

# 获取网络时间的函数
get_network_time() {
    # 使用超时控制的curl请求
    local time_data
    local network_time

    # 尝试 WorldTimeAPI，超时5秒，忽略错误输出
    time_data=$(curl -s -m 5 "http://worldtimeapi.org/api/timezone/Asia/Tokyo" 2>/dev/null || true)
    if [ ! -z "$time_data" ]; then
        network_time=$(echo "$time_data" | grep -o '"datetime":"[^"]*"' | cut -d'"' -f4 | cut -d'.' -f1 2>/dev/null || true)
        if [ ! -z "$network_time" ]; then
            echo "$network_time"
            return 0
        fi
    fi

    # 如果第一个API失败，尝试备用API，超时5秒
    time_data=$(curl -s -m 5 "http://worldclockapi.com/api/json/utc/now" 2>/dev/null || true)
    if [ ! -z "$time_data" ]; then
        local utc_time=$(echo "$time_data" | grep -o '"currentDateTime":"[^"]*"' | cut -d'"' -f4 | cut -d'.' -f1 2>/dev/null || true)
        if [ ! -z "$utc_time" ]; then
            date -d "$utc_time UTC + 9 hours" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date '+%Y-%m-%d %H:%M:%S'
            return 0
        fi
    fi

    # 如果所有API都失败或超时，使用系统时间
    echo "[WARNING] Network time API failed, using system time" >&2
    date '+%Y-%m-%d %H:%M:%S'
    return 0
}

# 计算两个时间戳之间的时长（返回分钟和秒）
calculate_duration() {
    local start_timestamp=$1
    local end_timestamp=$2
    local duration=$((end_timestamp - start_timestamp))
    local minutes=$((duration / 60))
    local seconds=$((duration % 60))

    echo "MINUTES=${minutes}"
    echo "SECONDS=${seconds}"
}

# 获取当前时间戳
get_timestamp() {
    local time_str="${1:-$(date '+%Y-%m-%d %H:%M:%S')}"
    date -d "$time_str" +%s
}
