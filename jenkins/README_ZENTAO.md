# 禅道 Bug 追踪集成

本项目集成了禅道 API，用于自动追踪和解决提交中的 Bug 修复。

## 功能概述

### 两种工作模式

1. **Dev 模式（更新状态）** - `Jenkinsfile.dev`

   - 扫描提交中的 `fix:xxx` 格式
   - 调用禅道 API 将 Bug 状态更新为 `resolved`
   - 发送飞书通知（单个 Bug 解决通知 + 版本汇总通知）
   - 发送 Telegram 汇总通知

2. **Release 模式（仅汇总）** - `Jenkinsfile.release`
   - 扫描提交中的 `fix:xxx` 格式
   - **不**更新禅道状态，只生成汇总报告
   - 发送飞书版本汇总通知
   - 发送 Telegram 汇总通知

## 提交格式要求

在提交消息中使用以下格式来关联禅道 Bug：

```bash
# 单个 Bug
fix:2262 修复登录问题
fix-2262 修复登录问题
fix: 2262 修复登录问题

# 多个 Bug
fix:2262 2265 修复登录和权限问题
fix: 2262 2265 修复登录和权限问题
```

支持的格式：

- `fix:2262`
- `fix-2262`
- `fix: 2262`
- `fix: 2262 2265`（多个 Bug）

## 配置说明

### 1. Jenkins 凭据配置

需要在 Jenkins 中配置禅道凭据：

- **Credential ID**: `zentao-credentials`
- **Type**: Username with password
- **Username**: 禅道账号
- **Password**: 禅道密码

### 2. 项目配置

在 `jenkins/lib/zentao.sh` 中配置：

```bash
# 禅道配置
PRODUCT_ID=1  # 产品 ID
ZENTAO_API_URL="https://zentao.pwtk.cc/zentao/api.php/v1"
ZENTAO_BUG_BASE_URL="https://zentao.pwtk.cc/zentao/bug-view-"
```

### 3. 飞书 Webhook 配置

在 `jenkins/lib/lark.sh` 中配置：

```bash
LARK_WEBHOOK_URL="https://open.larksuite.com/open-apis/bot/v2/hook/7142cabc-603b-423f-8081-315cd3c19365"
```

## 工作流程

### Release Pipeline 流程

1. **提取修复信息** stage

   - 从上一个 tag 到当前 tag 提取所有包含 `fix:` 的提交

2. **禅道 Bug 追踪** stage
   - 解析提交中的 Bug ID
   - 查询禅道获取 Bug 状态和标题
   - 生成汇总报告（**不更新禅道状态**）
   - 发送飞书版本汇总通知
   - 发送 Telegram 汇总通知

### Dev Pipeline 流程（未来实现）

1. 解析提交中的 Bug ID
2. 查询禅道获取 Bug 状态
3. 如果 Bug 状态为 `active` 或 `wait`：
   - 调用禅道 API 更新为 `resolved`
   - 添加评论记录修复信息
   - 发送单个 Bug 解决通知（飞书）
4. 生成版本汇总通知

## 飞书通知示例

### Bug 解决通知（绿色卡片）

```
🐛 pwtk超管端Bug更新
Bug #2262: 测试Bug标题
状态变化: active → resolved ✅
相关提交: 修复人: 张三 [abc1234]
[查看详情按钮]
```

### 版本发布汇总通知（蓝色卡片）

```
🚀 pwtk超管端版本发布
版本: v1.2.14 → v1.2.15

已解决Bug (2个):
• #2262 测试Bug标题
• #2265 权限问题修复
```

## API 调用说明

### 在 Jenkinsfile 中使用

```groovy
stage('禅道Bug追踪') {
    steps {
        script {
            withCredentials([
                usernamePassword(credentialsId: 'zentao-credentials',
                                usernameVariable: 'ZENTAO_USERNAME',
                                passwordVariable: 'ZENTAO_PASSWORD')
            ]) {
                sh '''
                    source ${WORKSPACE}/jenkins/lib/zentao.sh

                    # release 模式：只汇总不更新
                    process_zentao_bugs "${START_REF}" "${END_REF}" "${VERSION_INFO}" "false"

                    # dev 模式：更新禅道状态
                    # process_zentao_bugs "${START_REF}" "${END_REF}" "${VERSION_INFO}" "true"
                '''
            }
        }
    }
}
```

### 函数签名

```bash
process_zentao_bugs <start_ref> <end_ref> <version_info> <update_status>

参数:
  start_ref      - Git 起始引用（tag/commit）
  end_ref        - Git 结束引用（tag/commit）
  version_info   - 版本信息描述（用于通知）
  update_status  - 是否更新禅道状态 (true/false)
```

## Bug 状态处理规则

| Bug 状态 | Dev 模式           | Release 模式 | 说明             |
| -------- | ------------------ | ------------ | ---------------- |
| active   | 更新为 resolved ✅ | 汇总显示 📋  | 未解决的激活 Bug |
| wait     | 更新为 resolved ✅ | 汇总显示 📋  | 等待处理的 Bug   |
| resolved | 跳过               | 跳过         | 已解决，不显示   |
| closed   | 跳过               | 跳过         | 已关闭，不显示   |

## 故障排查

### 1. Token 获取失败

**症状**: 日志显示 "无法获取禅道 Token"

**解决方案**:

- 检查 Jenkins 凭据配置是否正确
- 确认禅道账号密码正确
- 检查禅道 API URL 是否可访问

### 2. Bug 查询失败

**症状**: 显示 "无法获取 Bug #xxx 的状态信息"

**解决方案**:

- 确认 Bug ID 存在于禅道中
- 检查产品 ID 配置是否正确
- 确认账号有查看该 Bug 的权限

### 3. 飞书通知未收到

**症状**: Pipeline 成功但未收到飞书通知

**解决方案**:

- 检查 LARK_WEBHOOK_URL 配置是否正确
- 在飞书群中确认机器人是否正常
- 查看 Jenkins 日志中的 Lark API 响应

### 4. 提交未被识别

**症状**: 明明包含 fix: 但未被识别

**解决方案**:

- 检查提交消息格式是否正确
- 确认 Bug ID 后面有空格或数字
- 查看 Jenkins 日志中的 "发现 Bug 修复" 消息

## 测试

### 本地测试飞书通知

运行测试脚本：

```bash
./test-lark.sh
```

这会发送 4 条测试消息到飞书，验证 Webhook 是否正常工作。

### 测试 Bug 追踪逻辑

1. 创建包含 `fix:xxx` 的提交
2. 触发 Jenkins 构建
3. 查看 Jenkins 日志中的禅道处理过程
4. 检查飞书是否收到通知

## 参考

- 禅道 API 文档: https://zentao.pwtk.cc/zentao/doc/
- 飞书机器人文档: https://open.larksuite.com/document/client-docs/bot-v3/add-custom-bot
- Jenkins Pipeline 语法: https://www.jenkins.io/doc/book/pipeline/syntax/
