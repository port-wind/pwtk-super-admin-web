#!/bin/bash

# 设置语言环境为UTF-8
export LANG=zh_CN.UTF-8
export LC_ALL=zh_CN.UTF-8
export LANGUAGE=zh_CN.UTF-8

export VITE_NODE_ENV=development

# 打印所有JENkins 默认的环境变量
GIT_BRANCH=${GIT_BRANCH}
GIT_REPO_URL=${GIT_REPO_URL}
GIT_USERNAME=${GIT_USERNAME}
GIT_PASSWORD=${GIT_PASSWORD}
NPM_PATH=${NPM_PATH}
BUILD_LOG_FILE=${BUILD_LOG_FILE}
BUILD_START_TIME=${BUILD_START_TIME}
BUILD_START_TIMESTAMP=${BUILD_START_TIMESTAMP}
BUILD_END_TIME=${BUILD_END_TIME}
BUILD_END_TIMESTAMP=${BUILD_END_TIMESTAMP}
BUILD_DURATION=${BUILD_DURATION}
MINUTES=${MINUTES}
SECONDS=${SECONDS}
WARNING_COUNT=${WARNING_COUNT}
ERROR_COUNT=${ERROR_COUNT}
LAST_COMMIT_DATE=${LAST_COMMIT_DATE}
LAST_COMMIT_MESSAGE=${LAST_COMMIT_MESSAGE}
LAST_COMMIT_HASH=${LAST_COMMIT_HASH}
PROJECT_NAME=${PROJECT_NAME}
BRANCH_NAME=${BRANCH_NAME}
VITE_NODE_ENV=${VITE_NODE_ENV}

# 清理旧日志文件，只保留最近5个
cleanup_old_logs() {
    local log_dir="/tmp"
    local log_prefix="build_"
    # 列出所有构建日志文件（按时间从旧到新排序），删除旧的文件，只保留最新的5个
    find "$log_dir" -name "${log_prefix}*.log" -type f -printf '%T+ %p\n' | \
    sort | \
    head -n -5 | \
    awk '{print $2}' | \
    xargs -r rm -f
}

# 获取网络时间的函数
get_network_time() {
    # 使用超时控制的curl请求
    local time_data
    # 尝试 WorldTimeAPI，超时10秒
    time_data=$(curl -s -m 10 "http://worldtimeapi.org/api/timezone/Asia/Tokyo")
    if [ $? -eq 0 ] && [ ! -z "$time_data" ]; then
        network_time=$(echo "$time_data" | grep -o '"datetime":"[^"]*"' | cut -d'"' -f4 | cut -d'.' -f1)
        if [ ! -z "$network_time" ]; then
            echo "$network_time"
            return
        fi
    fi

    # 如果第一个API失败，尝试备用API，超时10秒
    time_data=$(curl -s -m 10 "http://worldclockapi.com/api/json/utc/now")
    if [ $? -eq 0 ] && [ ! -z "$time_data" ]; then
        utc_time=$(echo "$time_data" | grep -o '"currentDateTime":"[^"]*"' | cut -d'"' -f4 | cut -d'.' -f1)
        if [ ! -z "$utc_time" ]; then
            date -d "$utc_time UTC + 9 hours" "+%Y-%m-%d %H:%M:%S"
            return
        fi
    fi

    # 如果所有API都失败或超时，使用系统时间
    log_message "警告: 网络时间API超时或失败，使用系统时间"
    date '+%Y-%m-%d %H:%M:%S'
}

# 清理旧日志
cleanup_old_logs

# 创建日志文件
BUILD_LOG_FILE="/tmp/build_$(date '+%Y%m%d_%H%M%S').log"
echo -ne '\xEF\xBB\xBF' > "$BUILD_LOG_FILE"

# 日志记录函数
log_message() {
    local message="$1"
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $message" | tee -a "$BUILD_LOG_FILE"
}

# Telegram Bot 配置
TELEGRAM_BOT_TOKEN="8132916684:AAEd1oObTMPxxcLV6LICKIDTPf1vBSn2rGk"
TELEGRAM_CHAT_ID="7061322031"

# 发送 Telegram 消息的函数
send_telegram_message() {
    local message="$1"
    log_message "Telegram通知: $message"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -H "Content-Type: application/json; charset=utf-8" \
        -d "$(echo -n "{\"chat_id\":\"${TELEGRAM_CHAT_ID}\",\"text\":\"${message}\",\"parse_mode\":\"HTML\"}" | iconv -f UTF-8 -t UTF-8)"
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

# 发送文件到 Telegram 的函数
send_telegram_file() {
    local file="$1"
    local caption="$2"
    log_message "发送日志文件到Telegram: $caption"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument" \
        -H "Content-Type: multipart/form-data; charset=utf-8" \
        -F "chat_id=${TELEGRAM_CHAT_ID}" \
        -F "document=@$file" \
        -F "caption=$caption"
}

# 记录构建开始时间（使用网络时间）
BUILD_START_TIME=$(get_network_time)
BUILD_START_TIMESTAMP=$(date -d "$BUILD_START_TIME" +%s)
log_message "=============== 构建开始 ==============="

log_message "切换到项目目录"
cd /home/www/websites/frontend/pwtk-super-admin-web || { 
    log_message "错误: 无法切换到目标目录"
    exit 1
}
log_message "当前目录: $(pwd)"

log_message "清理本地未提交的更改"
git reset --hard 2>&1 | tee -a "$BUILD_LOG_FILE"
git clean -fd 2>&1 | tee -a "$BUILD_LOG_FILE"

log_message "切换到dev分支"
git checkout dev || git checkout -b dev 2>&1 | tee -a "$BUILD_LOG_FILE"

log_message "拉取最新代码"
git fetch origin 2>&1 | tee -a "$BUILD_LOG_FILE"
git reset --hard origin/dev 2>&1 | tee -a "$BUILD_LOG_FILE"

git remote set-url origin https://$GIT_USERNAME:$GIT_PASSWORD@zr-svn8300.cccqx.com/pwtk/pwtk-super-admin-web.git
git pull origin dev 2>&1 | tee -a "$BUILD_LOG_FILE"

# 获取最新提交信息
LAST_COMMIT_DATE=$(git log -1 --format=%cd --date=format:'%Y-%m-%d %H:%M:%S')
LAST_COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
PROJECT_NAME="pwtk-super-admin-web"

# 发送构建开始通知
send_telegram_message "🚀 构建开始
时间: ${BUILD_START_TIME}
项目名称: ${PROJECT_NAME}
提交代码日期: ${LAST_COMMIT_DATE}
提交信息: ${LAST_COMMIT_MESSAGE}
分支: ${BRANCH_NAME}
环境: ${VITE_NODE_ENV}"

# 初始进度
update_progress 0 "初始化"

# ===== Submodule 拉取部分 =====
log_message "初始化和更新子模块"
rm -rf src/views/WebVision/components/componentsbiz 2>&1 | tee -a "$BUILD_LOG_FILE"
git submodule init 2>&1 | tee -a "$BUILD_LOG_FILE"
git submodule update 2>&1 | tee -a "$BUILD_LOG_FILE"
ls -a src/views/WebVision/components/componentsbiz 2>&1 | tee -a "$BUILD_LOG_FILE"
log_message "子模块更新完成"

# 20% - 子模块更新完成
update_progress 20 "子模块更新完成"

log_message "处理 package-lock.json"
rm -f package-lock.jsonBAK
mv package-lock.json package-lock.jsonBAK 2>/dev/null || true
rm -f package-lock.json

log_message "开始安装依赖"
if ! /root/.nvm/versions/node/v16.20.2/bin/npm install --force --legacy-peer-deps --registry=https://registry.npmjs.org 2>&1 | tee -a "$BUILD_LOG_FILE"; then
    log_message "错误: npm install 失败"
    # 获取失败时的信息
    cd /home/www/websites/frontend/pwtk-super-admin-web
    LAST_COMMIT_DATE=$(git log -1 --format=%cd --date=format:'%Y-%m-%d %H:%M:%S')
    LAST_COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
    LAST_COMMIT_HASH=$(git log -1 --pretty=format:"%H" | cut -c1-8)
    PROJECT_NAME="pwtk-super-admin-web"
    WARNING_COUNT=$(grep -i "warning" "$BUILD_LOG_FILE" | wc -l)
    ERROR_COUNT=$(grep -i "error" "$BUILD_LOG_FILE" | wc -l)
    FAIL_TIME=$(get_network_time)
    FAIL_TIMESTAMP=$(date -d "$FAIL_TIME" +%s)
    FAIL_DURATION=$((FAIL_TIMESTAMP - BUILD_START_TIMESTAMP))
    FAIL_MINUTES=$((FAIL_DURATION / 60))
    FAIL_SECONDS=$((FAIL_DURATION % 60))
    
    send_telegram_message "❌ 构建失败
时间: ${FAIL_TIME}
项目名称: ${PROJECT_NAME}
提交代码日期: ${LAST_COMMIT_DATE}
提交信息: ${LAST_COMMIT_MESSAGE}
commit hash: ${LAST_COMMIT_HASH}
分支: ${BRANCH_NAME}
环境: ${VITE_NODE_ENV}
失败阶段: npm install
错误: 依赖安装失败
耗时: ${FAIL_MINUTES}分${FAIL_SECONDS}秒"
    send_telegram_file "$BUILD_LOG_FILE" "❌ 构建失败 - 完整日志"
    exit 1
fi

# 50% - 依赖安装完成
update_progress 50 "依赖安装完成"

log_message "开始执行构建"
if ! /root/.nvm/versions/node/v16.20.2/bin/npm run build 2>&1 | tee -a "$BUILD_LOG_FILE"; then
    log_message "错误: build 失败"
    # 获取失败时的信息
    cd /home/www/websites/frontend/pwtk-super-admin-web
    LAST_COMMIT_DATE=$(git log -1 --format=%cd --date=format:'%Y-%m-%d %H:%M:%S')
    LAST_COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
    LAST_COMMIT_HASH=$(git log -1 --pretty=format:"%H" | cut -c1-8)
    PROJECT_NAME="pwtk-super-admin-web"
    WARNING_COUNT=$(grep -i "warning" "$BUILD_LOG_FILE" | wc -l)
    ERROR_COUNT=$(grep -i "error" "$BUILD_LOG_FILE" | wc -l)
    FAIL_TIME=$(get_network_time)
    FAIL_TIMESTAMP=$(date -d "$FAIL_TIME" +%s)
    FAIL_DURATION=$((FAIL_TIMESTAMP - BUILD_START_TIMESTAMP))
    FAIL_MINUTES=$((FAIL_DURATION / 60))
    FAIL_SECONDS=$((FAIL_DURATION % 60))
    
    send_telegram_message "❌ 构建失败
时间: ${FAIL_TIME}
项目名称: ${PROJECT_NAME}
提交代码日期: ${LAST_COMMIT_DATE}
提交信息: ${LAST_COMMIT_MESSAGE}
commit hash: ${LAST_COMMIT_HASH}
分支: ${BRANCH_NAME}
环境: ${VITE_NODE_ENV}
失败阶段: build
错误: 构建命令执行失败
耗时: ${FAIL_MINUTES}分${FAIL_SECONDS}秒"
    send_telegram_file "$BUILD_LOG_FILE" "❌ 构建失败 - 完整日志"
    exit 1
fi

# 80% - 构建完成
update_progress 80 "构建完成"

log_message "切换到构建产物目录"
cd /home/www/websites/frontend/pwtk-super-admin-web/dist-dev || { 
    log_message "错误: 无法切换到dist目录"
    # 获取失败时的信息
    cd /home/www/websites/frontend/pwtk-super-admin-web
    LAST_COMMIT_DATE=$(git log -1 --format=%cd --date=format:'%Y-%m-%d %H:%M:%S')
    LAST_COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
    LAST_COMMIT_HASH=$(git log -1 --pretty=format:"%H" | cut -c1-8)
    PROJECT_NAME="pwtk-super-admin-web"
    WARNING_COUNT=$(grep -i "warning" "$BUILD_LOG_FILE" | wc -l)
    ERROR_COUNT=$(grep -i "error" "$BUILD_LOG_FILE" | wc -l)
    FAIL_TIME=$(get_network_time)
    FAIL_TIMESTAMP=$(date -d "$FAIL_TIME" +%s)
    FAIL_DURATION=$((FAIL_TIMESTAMP - BUILD_START_TIMESTAMP))
    FAIL_MINUTES=$((FAIL_DURATION / 60))
    FAIL_SECONDS=$((FAIL_DURATION % 60))
    
    send_telegram_message "❌ 构建失败
时间: ${FAIL_TIME}
项目名称: ${PROJECT_NAME}
提交代码日期: ${LAST_COMMIT_DATE}
提交信息: ${LAST_COMMIT_MESSAGE}
commit hash: ${LAST_COMMIT_HASH}
分支: ${BRANCH_NAME}
环境: ${VITE_NODE_ENV}
失败阶段: 切换到构建产物目录
错误: 无法切换到dist目录
耗时: ${FAIL_MINUTES}分${FAIL_SECONDS}秒"
    send_telegram_file "$BUILD_LOG_FILE" "❌ 构建失败 - 完整日志"
    exit 1
}

log_message "等待10秒检查服务状态"
sleep 10

log_message "检查服务端口"
if lsof -i :8000 > /dev/null; then
    log_message "服务已在端口8000上运行"
else
    log_message "错误: 服务未在端口8000上运行"
    # 获取失败时的信息
    cd /home/www/websites/frontend/pwtk-super-admin-web
    LAST_COMMIT_DATE=$(git log -1 --format=%cd --date=format:'%Y-%m-%d %H:%M:%S')
    LAST_COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
    LAST_COMMIT_HASH=$(git log -1 --pretty=format:"%H" | cut -c1-8)
    PROJECT_NAME="pwtk-super-admin-web"
    WARNING_COUNT=$(grep -i "warning" "$BUILD_LOG_FILE" | wc -l)
    ERROR_COUNT=$(grep -i "error" "$BUILD_LOG_FILE" | wc -l)
    FAIL_TIME=$(get_network_time)
    FAIL_TIMESTAMP=$(date -d "$FAIL_TIME" +%s)
    FAIL_DURATION=$((FAIL_TIMESTAMP - BUILD_START_TIMESTAMP))
    FAIL_MINUTES=$((FAIL_DURATION / 60))
    FAIL_SECONDS=$((FAIL_DURATION % 60))
    
    send_telegram_message "❌ 构建失败
时间: ${FAIL_TIME}
项目名称: ${PROJECT_NAME}
提交代码日期: ${LAST_COMMIT_DATE}
提交信息: ${LAST_COMMIT_MESSAGE}
commit hash: ${LAST_COMMIT_HASH}
分支: ${BRANCH_NAME}
环境: ${VITE_NODE_ENV}
失败阶段: 服务启动
错误: 服务未在端口8000上运行
耗时: ${FAIL_MINUTES}分${FAIL_SECONDS}秒"
    send_telegram_file "$BUILD_LOG_FILE" "❌ 构建失败 - 完整日志"
    exit 1
fi

log_message "服务启动成功"

# 90% - 服务启动成功
update_progress 90 "服务启动成功"

# 获取最后提交信息
log_message "获取Git提交信息"
cd /home/www/websites/frontend/pwtk-super-admin-web
LAST_COMMIT_DATE=$(git log -1 --format=%cd --date=format:'%Y-%m-%d %H:%M:%S')
LAST_COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
LAST_COMMIT_HASH=$(git log -1 --pretty=format:"%H" | cut -c1-8)
PROJECT_NAME="pwtk-super-admin-web"

# 统计构建日志中的警告和错误数量
log_message "统计构建日志"
WARNING_COUNT=$(grep -i "warning" "$BUILD_LOG_FILE" | wc -l)
ERROR_COUNT=$(grep -i "error" "$BUILD_LOG_FILE" | wc -l)

# 计算构建耗时（使用网络时间）
BUILD_END_TIME=$(get_network_time)
BUILD_END_TIMESTAMP=$(date -d "$BUILD_END_TIME" +%s)
BUILD_DURATION=$((BUILD_END_TIMESTAMP - BUILD_START_TIMESTAMP))
MINUTES=$((BUILD_DURATION / 60))
SECONDS=$((BUILD_DURATION % 60))

log_message "=============== 构建完成 ==============="
log_message "总耗时: ${MINUTES}分${SECONDS}秒"
log_message "Warning数量: ${WARNING_COUNT}"
log_message "Error数量: ${ERROR_COUNT}"

# 100% - 完成
update_progress 100 "构建完成"

# 发送构建成功通知和日志
send_telegram_message "✅ 构建成功
时间: ${BUILD_END_TIME}
项目名称: ${PROJECT_NAME}
提交代码日期: ${LAST_COMMIT_DATE}
提交信息: ${LAST_COMMIT_MESSAGE}
commit hash: ${LAST_COMMIT_HASH}
分支: ${BRANCH_NAME}
环境: ${VITE_NODE_ENV}
耗时: ${MINUTES}分${SECONDS}秒"

send_telegram_file "$BUILD_LOG_FILE" "✅ 构建成功 - 完整日志"

# 保留日志文件供后续查看
log_message "日志文件保存在: $BUILD_LOG_FILE"
