#!/bin/bash

# 测试修复提取和 Lark 通知功能

set -e

echo "======================================"
echo "测试修复提取和通知功能"
echo "======================================"
echo ""

# 设置测试环境
WORKSPACE=$(pwd)
export WORKSPACE

# 加载库文件
echo "1. 加载库文件..."
source jenkins/lib/logger.sh
source jenkins/lib/lark.sh

echo "✓ 库文件加载成功"
echo ""

# 创建临时日志文件
BUILD_LOG_FILE="/tmp/test_build.log"
export BUILD_LOG_FILE
echo -ne '\xEF\xBB\xBF' > "$BUILD_LOG_FILE"

# 测试 1: 提取修复提交
echo "2. 测试提取修复提交..."
echo ""

# 模拟获取上次成功构建的 hash
LAST_SUCCESS_HASH=$(git log -20 --oneline | tail -1 | awk '{print $1}')
echo "模拟上次成功构建: ${LAST_SUCCESS_HASH}"
echo ""

# 提取修复提交（兼容 Git 1.8）
FIX_COMMITS=$(git log ${LAST_SUCCESS_HASH}..HEAD --oneline | grep -E "^[a-f0-9]+ fix[:(]" || true)

if [ -z "${FIX_COMMITS}" ]; then
    echo "⚠ 没有找到包含 fix: 的提交"
    echo ""
    echo "提示: 在最近的提交中没有 fix: 或 fix( 开头的提交"
    echo "你可以创建一个测试提交："
    echo "  git commit --allow-empty -m 'fix: test commit for notification #123'"
    echo ""
    FIX_COUNT=0
    FIX_LIST="无修复记录"
else
    FIX_COUNT=$(echo "$FIX_COMMITS" | wc -l)
    echo "✓ 找到 ${FIX_COUNT} 个修复:"
    echo ""
    echo "$FIX_COMMITS" | while IFS= read -r line; do
        echo "  - $line"
    done
    echo ""

    # 格式化修复列表
    FIX_LIST=$(echo "$FIX_COMMITS" | awk '{
        hash = $1
        $1 = ""
        msg = $0
        gsub(/^[ \t]+/, "", msg)
        # 提取 issue 编号（如果有）
        if (match(msg, /#[0-9]+/)) {
            issue = substr(msg, RSTART, RLENGTH)
            printf "• %s %s\\n", issue, msg
        } else {
            printf "• %s\\n", msg
        }
    }')

    echo "格式化后的修复列表:"
    echo -e "${FIX_LIST}"
    echo ""
fi

# 测试 2: 测试 Lark 通知格式
echo "3. 测试 Lark 通知格式..."
echo ""

if [ ${FIX_COUNT} -gt 0 ]; then
    PROJECT_NAME="pwtk-super-admin-web"
    BUILD_TIME=$(date '+%Y-%m-%d %H:%M:%S')
    COMMIT_HASH=$(git log -1 --pretty=format:"%H" | cut -c1-8)
    BRANCH="dev"
    VITE_NODE_ENV="development"

    echo "通知参数:"
    echo "  项目名称: ${PROJECT_NAME}"
    echo "  构建时间: ${BUILD_TIME}"
    echo "  提交哈希: ${COMMIT_HASH}"
    echo "  修复数量: ${FIX_COUNT}"
    echo "  分支: ${BRANCH}"
    echo "  环境: ${VITE_NODE_ENV}"
    echo ""

    # 构建消息内容
    FORMATTED_FIXES=$(echo -e "${FIX_LIST}")

    echo "生成的 Lark 消息内容:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "标题: 🔧 ${PROJECT_NAME} - 发现 ${FIX_COUNT} 个修复"
    echo ""
    echo "**构建时间:** ${BUILD_TIME}"
    echo "**分支:** ${BRANCH}"
    echo "**环境:** ${VITE_NODE_ENV}"
    echo "**提交:** ${COMMIT_HASH}"
    echo "**修复数量:** ${FIX_COUNT}"
    echo ""
    echo "---"
    echo ""
    echo "**修复内容:**"
    echo "${FORMATTED_FIXES}"
    echo ""
    echo "---"
    echo "✅ 构建成功并已部署"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
else
    echo "⚠ 无修复记录，不会发送 Lark 通知"
    echo ""
fi

# 测试 3: 检查 Lark Webhook 配置
echo "4. 检查 Lark Webhook 配置..."
echo ""

if [ "${LARK_WEBHOOK_URL}" = "https://open.feishu.cn/open-apis/bot/v2/hook/YOUR_WEBHOOK_KEY" ] || [ -z "${LARK_WEBHOOK_URL}" ]; then
    echo "⚠ Lark Webhook URL 未配置"
    echo ""
    echo "请在以下位置之一配置 Webhook URL:"
    echo "  1. jenkins/lib/lark.sh 文件中的 LARK_WEBHOOK_URL 变量"
    echo "  2. 设置环境变量: export LARK_WEBHOOK_URL='your_webhook_url'"
    echo ""
    echo "获取 Lark Webhook URL 的步骤:"
    echo "  1. 在飞书群聊中添加自定义机器人"
    echo "  2. 复制 Webhook 地址"
    echo "  3. 配置到上述位置"
    echo ""
    SEND_REAL_NOTIFICATION=false
else
    echo "✓ Lark Webhook URL 已配置"
    echo "  URL: ${LARK_WEBHOOK_URL:0:50}..."
    echo ""
    SEND_REAL_NOTIFICATION=true
fi

# 测试 4: 发送测试通知（可选）
if [ ${FIX_COUNT} -gt 0 ] && [ "$SEND_REAL_NOTIFICATION" = true ]; then
    echo "5. 发送真实的 Lark 通知..."
    echo ""
    read -p "是否发送真实的 Lark 通知? (y/n): " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "正在发送..."
        send_lark_fix_notification \
            "${PROJECT_NAME}" \
            "${BUILD_TIME}" \
            "${COMMIT_HASH}" \
            "${FIX_COUNT}" \
            "${FORMATTED_FIXES}" \
            "${BRANCH}" \
            "${VITE_NODE_ENV}"

        echo "✓ 通知已发送，请检查飞书群聊"
    else
        echo "已取消发送"
    fi
    echo ""
else
    echo "5. 跳过发送真实通知（无修复记录或 Webhook 未配置）"
    echo ""
fi

# 测试总结
echo "======================================"
echo "测试完成！"
echo "======================================"
echo ""
echo "测试结果总结:"
echo "  • 修复提取: $([ ${FIX_COUNT} -gt 0 ] && echo '✓ 成功' || echo '⚠ 无数据')"
echo "  • 消息格式化: ✓ 成功"
echo "  • Webhook 配置: $([ "$SEND_REAL_NOTIFICATION" = true ] && echo '✓ 已配置' || echo '⚠ 未配置')"
echo ""

if [ ${FIX_COUNT} -eq 0 ]; then
    echo "建议:"
    echo "  创建一个测试提交来验证完整流程:"
    echo "  $ git commit --allow-empty -m 'fix: test notification feature #123'"
    echo "  $ bash jenkins/test-fix-extraction.sh"
    echo ""
fi

echo "日志文件: ${BUILD_LOG_FILE}"
echo ""
