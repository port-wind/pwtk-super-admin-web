#!/bin/bash

# Lark 通知测试脚本
# 用于测试 Lark Webhook 是否正常工作
# 参考另一个项目的实现

LARK_WEBHOOK_URL="https://open.larksuite.com/open-apis/bot/v2/hook/7142cabc-603b-423f-8081-315cd3c19365"

echo "=========================================="
echo "Lark Webhook 测试"
echo "=========================================="
echo ""

# 测试 1: 简单文本消息
echo "测试 1: 发送简单文本消息"
response1=$(curl -s -X POST "${LARK_WEBHOOK_URL}" \
  -H 'Content-Type: application/json' \
  -d '{
    "msg_type": "text",
    "content": {
      "text": "这是一条测试消息"
    }
  }')

echo "响应: $response1"
echo ""

# 测试 2: 使用参考项目的格式（绿色成功卡片）
echo "测试 2: 发送成功卡片（参考项目格式）"
response2=$(curl -s -X POST "${LARK_WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "msg_type": "interactive",
    "card": {
        "header": {
            "title": {
                "tag": "plain_text",
                "content": "🚀 pwtk超管端版本发布"
            },
            "template": "blue"
        },
        "elements": [
            {
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": "**版本**: v1.2.14 → v1.2.15\n\n**已解决Bug** (1个):\n• [#2262 测试Bug](https://zentao.pwtk.cc/zentao/bug-view-2262.html)\n"
                }
            }
        ]
    }
  }')

echo "响应: $response2"
echo ""

# 测试 3: Bug解决通知格式
echo "测试 3: 发送Bug解决通知"
response3=$(curl -s -X POST "${LARK_WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "msg_type": "interactive",
    "card": {
        "header": {
            "title": {
                "tag": "plain_text",
                "content": "🐛 pwtk超管端Bug更新"
            },
            "template": "green"
        },
        "elements": [
            {
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": "**Bug #2262**: 测试Bug标题\n**状态变化**: active → resolved ✅\n**相关提交**: 修复人: 张三 [abc1234]"
                }
            },
            {
                "tag": "action",
                "actions": [
                    {
                        "tag": "button",
                        "text": {
                            "tag": "plain_text",
                            "content": "查看详情"
                        },
                        "type": "primary",
                        "url": "https://zentao.pwtk.cc/zentao/bug-view-2262.html"
                    }
                ]
            }
        ]
    }
  }')

echo "响应: $response3"
echo ""

# 测试 4: 发布成功通知（简化版）
echo "测试 4: 发送发布成功通知（简化版）"
response4=$(curl -s -X POST "${LARK_WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "msg_type": "interactive",
    "card": {
        "header": {
            "title": {
                "tag": "plain_text",
                "content": "✅ 发布成功"
            },
            "template": "green"
        },
        "elements": [
            {
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": "**时间:** 2025-10-15 10:48:44\n**项目名称:** pwtk-super-admin-web\n**Tag:** v1.2.15\n**版本:** 1.2.15\n**发布包:** pwtk-super-admin-web-1.2.15.zip\n**文件大小:** 2.0M\n**耗时:** 0分58秒"
                }
            }
        ]
    }
  }')

echo "响应: $response4"
echo ""

# 检查结果
echo "=========================================="
echo "测试完成"
echo "=========================================="
echo ""
echo "检查你的飞书/Lark 是否收到 4 条消息："
echo "1. 简单文本消息"
echo "2. 蓝色卡片（版本发布汇总）"
echo "3. 绿色卡片（Bug解决通知，带按钮）"
echo "4. 绿色卡片（发布成功通知）"
echo ""

# 分析响应
if echo "$response1" | grep -q '"code":0'; then
    echo "✓ 测试 1 成功"
else
    echo "✗ 测试 1 失败: $response1"
fi

if echo "$response2" | grep -q '"code":0'; then
    echo "✓ 测试 2 成功"
else
    echo "✗ 测试 2 失败: $response2"
fi

if echo "$response3" | grep -q '"code":0'; then
    echo "✓ 测试 3 成功"
else
    echo "✗ 测试 3 失败: $response3"
fi

if echo "$response4" | grep -q '"code":0'; then
    echo "✓ 测试 4 成功"
else
    echo "✗ 测试 4 失败: $response4"
fi
