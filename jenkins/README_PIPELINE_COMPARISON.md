# Jenkins Pipeline 对比文档

Dev Pipeline vs Release Pipeline 完整对比说明

---

## 📊 整体流程对比

| 阶段 | Dev Pipeline (Jenkinsfile.dev) | Release Pipeline (Jenkinsfile.release) | 主要区别 |
| --- | --- | --- | --- |
| **触发方式** | 自动触发（代码推送） | 手动触发（创建 tag） | Dev 自动，Release 手动 |
| **触发条件** | 推送到 dev/master 分支 | 当前提交包含 Git tag | Dev 监听分支，Release 检查 tag |
| **版本管理** | 不修改版本号 | 更新 package.json 和 webConfigApi.js | Release 会更新版本 |
| **Git 操作** | 无 | 提交版本更新，移动 tag | Release 会推送更改 |

---

## 🔄 详细 Stage 对比

| Stage 名称 | Dev Pipeline | Release Pipeline | 说明 |
| --- | --- | --- | --- |
| **初始化和检查 Tag** | ❌ 无此阶段 | ✅ 检查当前提交是否有 tag<br>✅ 检查 tag 是否已发布<br>✅ 创建发布记录目录 | Release 必须有 tag 才能发布 |
| **获取提交信息** | ❌ 无此阶段 | ✅ 获取 tag 的提交信息<br>✅ 发送发布开始通知 | Release 记录详细的 tag 信息 |
| **提取修复信息** | ❌ 无此阶段 | ✅ 提取上一个 tag 到当前 tag 的 fix 提交<br>✅ 格式化修复列表 | Release 生成修复内容汇总 |
| **禅道 Bug 追踪** | ✅ **更新禅道状态**<br>• 扫描提交中的 `fix:xxx`<br>• 调用禅道 API 更新为 resolved<br>• 发送单个 Bug 通知（绿色卡片）<br>• 发送版本汇总通知（蓝色卡片） | ✅ **仅汇总不更新**<br>• 扫描提交中的 `fix:xxx`<br>• 查询禅道获取 Bug 信息<br>• **不更新禅道状态**<br>• 仅发送版本汇总通知 | **关键区别**：<br>Dev 解决 Bug，<br>Release 只汇总 |
| **检查版本文件** | ❌ 无此阶段 | ✅ 检查 package.json 版本<br>✅ 检查 webConfigApi.js 版本<br>✅ 判断是否需要更新 | Release 验证版本一致性 |
| **更新版本文件** | ❌ 无此阶段 | ✅ 更新 package.json<br>✅ 更新 webConfigApi.js<br>✅ 更新 index.html 时间戳<br>✅ Git commit 并 push<br>✅ 移动 tag 到新提交 | Release 自动化版本管理 |
| **安装依赖** | ✅ `npm install` | ✅ `npm install --force --legacy-peer-deps` | 基本相同，Release 更严格 |
| **构建** | ✅ `npm run build` | ✅ `npm run build` | 相同 |
| **打包发布产物** | ❌ 无此阶段 | ✅ 打包为 zip 文件<br>✅ 记录文件大小<br>✅ 命名格式：`项目名-版本.zip` | Release 创建发布包 |
| **归档产物** | ❌ 无此阶段 | ✅ 归档 zip 文件到 Jenkins<br>✅ 生成下载链接 | Release 保留发布包 |
| **部署** | ✅ 可能部署到 dev 环境 | ❌ 不自动部署 | Dev 自动部署，Release 手动 |

---

## 🐛 禅道 Bug 追踪功能对比

| 功能                  | Dev Pipeline                     | Release Pipeline             |
| --------------------- | -------------------------------- | ---------------------------- |
| **扫描提交**          | ✅ 扫描最近 tag 到当前提交       | ✅ 扫描上一个 tag 到当前 tag |
| **解析 Bug ID**       | ✅ 支持 `fix:xxx` 格式           | ✅ 支持 `fix:xxx` 格式       |
| **查询禅道**          | ✅ 获取 Bug 状态和信息           | ✅ 获取 Bug 状态和信息       |
| **更新禅道状态**      | ✅ **更新为 resolved**           | ❌ **不更新状态**            |
| **添加评论**          | ✅ 记录修复提交信息              | ❌ 不添加评论                |
| **飞书 Bug 解决通知** | ✅ 每个 Bug 单独发送（绿色卡片） | ❌ 不发送                    |
| **飞书版本汇总通知**  | ✅ 发送（蓝色卡片）              | ✅ 发送（蓝色卡片）          |
| **Telegram 通知**     | ✅ 发送 Bug 修复汇总             | ✅ 发送 Bug 修复汇总         |
| **统计信息**          | ✅ 已解决数量 + 失败数量         | ✅ Bug 数量（不更新状态）    |

### 支持的提交格式

```bash
# 单个 Bug
fix:2262 修复登录问题
fix-2262 修复登录问题
fix: 2262 修复登录问题

# 多个 Bug
fix:2262 2265 修复登录和权限问题
fix: 2262 2265 修复登录和权限问题
```

### Bug 状态处理规则

| Bug 状态   | Dev 模式             | Release 模式   | 说明               |
| ---------- | -------------------- | -------------- | ------------------ |
| `active`   | 更新为 `resolved` ✅ | 汇总显示 📋    | 未解决的激活 Bug   |
| `wait`     | 更新为 `resolved` ✅ | 汇总显示 📋    | 等待处理的 Bug     |
| `resolved` | 跳过（不显示）       | 跳过（不显示） | 已解决，不重复处理 |
| `closed`   | 跳过（不显示）       | 跳过（不显示） | 已关闭，不重复处理 |

### 调用函数的区别

```bash
# Dev Pipeline - 更新禅道状态
process_zentao_bugs "${START_REF}" "${END_REF}" "${VERSION_INFO}" "true"
#                                                                   ^^^^^^
#                                                                   更新状态

# Release Pipeline - 只汇总不更新
process_zentao_bugs "${START_REF}" "${END_REF}" "${VERSION_INFO}" "false"
#                                                                   ^^^^^^^
#                                                                   不更新状态
```

---

## 📢 通知内容对比

| 通知类型 | Dev Pipeline | Release Pipeline |
| --- | --- | --- |
| **构建开始** | ❌ 不发送 | ✅ Telegram 通知<br>• 项目名称<br>• Tag 和版本<br>• 提交信息和日期 |
| **Bug 单独解决通知** | ✅ 飞书绿色卡片<br>`🐛 pwtk超管端Bug更新`<br>`Bug #2262: 测试Bug标题`<br>`状态变化: active → resolved ✅`<br>`相关提交: 修复人 [commit]`<br>`[查看详情按钮]` | ❌ 不发送单个通知 |
| **版本 Bug 汇总** | ✅ 飞书蓝色卡片<br>`🚀 pwtk超管端版本发布`<br>`版本: v1.2.14 → v1.2.15`<br>`已解决Bug (2个):`<br>`• #2262 测试Bug标题`<br>`• #2265 权限问题修复` | ✅ 飞书蓝色卡片<br>（相同格式）<br>**注意**: Bug 未实际解决，<br>只是汇总展示 |
| **Telegram Bug 汇总** | ✅ 文本消息<br>• 版本范围<br>• Bug 列表（带链接）<br>• 统计：已解决 N 个 | ✅ 文本消息<br>• 版本范围<br>• Bug 列表（带链接）<br>• 统计：发现 N 个 |
| **构建成功** | ✅ 简单通知<br>• 构建成功<br>• 基本信息 | ✅ **详细通知**<br>• 时间、项目名称<br>• Tag 和版本<br>• **发布包名称**<br>• **文件大小**<br>• **下载地址** ⭐<br>• 提交信息和日期<br>• commit hash<br>• 耗时<br>• 修复内容列表 |
| **构建失败** | ✅ 错误通知 | ✅ 详细失败通知<br>• 错误信息<br>• 完整日志文件 |

---

## 📦 文件产物对比

| 产物 | Dev Pipeline | Release Pipeline |
| --- | --- | --- |
| **构建目录** | `dist/` | `dist/` 或 `dist/` |
| **压缩包** | ❌ 不创建 | ✅ `pwtk-super-admin-web-1.2.15.zip` |
| **Jenkins 归档** | ❌ 不归档 | ✅ 归档到 Jenkins artifacts |
| **下载链接** | ❌ 无 | ✅ `http://jenkins-pw-admin.pwtk.cc:6061/view/pwtk/job/pwtk-super-admin-web-release/12/artifact/pwtk-super-admin-web-1.2.15.zip` |
| **发布记录** | ❌ 无 | ✅ 文件系统记录<br>`/home/www/jenkins-release-records/pwtk-super-admin-web/v1.2.15.release` |
| **构建日志** | ✅ 临时日志 | ✅ 归档到 Jenkins<br>`release_*.log` |

---

## ⚙️ 配置参数对比

| 配置项              | Dev Pipeline               | Release Pipeline                       |
| ------------------- | -------------------------- | -------------------------------------- |
| **项目名称**        | `pwtk-super-admin-web-dev` | `pwtk-super-admin-web`                 |
| **Node 版本**       | v16.20.2                   | v16.20.2                               |
| **构建保留数量**    | 可能更少（5-10 次）        | 保留最近 10 次                         |
| **并发构建**        | 可能允许                   | ✅ 禁止（`disableConcurrentBuilds()`） |
| **超时时间**        | 15-20 分钟                 | 30 分钟                                |
| **SCM 轮询**        | ✅ 启用（自动触发）        | ❌ 禁用（手动触发）                    |
| **禅道 PRODUCT_ID** | `13`（管端）               | `1`（超管端）                          |
| **Lark Webhook**    | `...5f5b7b4b...`（管端群） | `...7142cabc...`（超管端群）           |
| **Git 凭据**        | 可能不同                   | `bf04844e-d069-43d6-9333-d20cd2caa5b9` |

---

## 🎯 使用场景对比

| 场景           | Dev Pipeline            | Release Pipeline        |
| -------------- | ----------------------- | ----------------------- |
| **日常开发**   | ✅ 推送代码自动构建     | ❌ 不适用               |
| **测试验证**   | ✅ 快速验证功能         | ❌ 不适用               |
| **Bug 修复**   | ✅ **自动解决禅道 Bug** | ❌ 只记录不解决         |
| **版本发布**   | ❌ 不适用               | ✅ 创建正式版本         |
| **生成发布包** | ❌ 不生成               | ✅ 打包并归档           |
| **版本管理**   | ❌ 不修改版本号         | ✅ 自动更新版本号和 tag |
| **发布通知**   | ✅ 简单通知             | ✅ 详细通知 + 下载链接  |
| **CI/CD 集成** | ✅ 持续集成             | ✅ 持续交付             |

---

## 🔑 关键区别总结

| 维度           | Dev Pipeline                           | Release Pipeline                      |
| -------------- | -------------------------------------- | ------------------------------------- |
| **核心目的**   | 🔧 **持续集成（CI）**<br>验证代码质量  | 📦 **版本发布（CD）**<br>创建正式版本 |
| **运行频率**   | 🔄 频繁<br>每次推送代码                | 🎯 较少<br>版本发布时                 |
| **禅道集成**   | 🐛 **解决 Bug**<br>更新状态为 resolved | 📋 **汇总 Bug**<br>只记录不更新       |
| **版本控制**   | ➖ 不修改版本                          | ✅ 自动更新版本号                     |
| **产物管理**   | 🗑️ 临时构建                            | 💾 永久归档 + 下载链接                |
| **通知详细度** | 📝 简单                                | 📊 详细（包含下载地址）               |
| **Git 操作**   | ➖ 无                                  | ✅ 提交版本更新、移动 tag             |
| **适用环境**   | 开发/测试环境                          | 生产环境                              |

---

## 🔄 工作流程示意图

### Dev Pipeline 工作流程

```
┌─────────────────────────────────────────────────────────────────┐
│                      Dev Pipeline 工作流程                        │
└─────────────────────────────────────────────────────────────────┘

代码推送到 dev/master 分支
        ↓
    自动触发构建
        ↓
    安装依赖 (npm install)
        ↓
    构建项目 (npm run build)
        ↓
┌───────────────────────────┐
│  禅道 Bug 追踪 (Dev 模式)  │
│  • 扫描 fix:xxx 提交       │
│  • 查询禅道 Bug 状态       │
│  • ✅ 更新为 resolved      │
│  • 添加修复评论            │
│  • 发送单个 Bug 通知 🟢    │
│  • 发送版本汇总通知 🔵     │
└───────────────────────────┘
        ↓
    部署到开发环境
        ↓
    发送构建通知
```

### Release Pipeline 工作流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Release Pipeline 工作流程                      │
└─────────────────────────────────────────────────────────────────┘

创建 Git Tag (v1.2.15)
        ↓
    手动触发构建
        ↓
    检查 Tag 是否存在
        ↓
    检查是否已发布过
        ↓
    获取 Tag 提交信息
        ↓
    提取修复信息列表
        ↓
┌──────────────────────────────┐
│  禅道 Bug 追踪 (Release 模式) │
│  • 扫描 fix:xxx 提交          │
│  • 查询禅道 Bug 状态          │
│  • ❌ 不更新状态（只汇总）     │
│  • 不添加评论                 │
│  • 不发送单个 Bug 通知        │
│  • 发送版本汇总通知 🔵        │
└──────────────────────────────┘
        ↓
    检查版本文件
        ↓
    更新 package.json 版本
        ↓
    更新 webConfigApi.js 版本
        ↓
    提交版本更新并推送
        ↓
    移动 Tag 到新提交
        ↓
    安装依赖
        ↓
    构建项目
        ↓
    打包为 ZIP 文件
        ↓
    归档到 Jenkins
        ↓
    生成下载链接
        ↓
    创建发布记录文件
        ↓
    发送详细发布通知
    (包含下载地址)
```

---

## 📝 示例对比

### Dev Pipeline 示例输出

**场景**: 开发人员提交了修复 Bug #2262 的代码

```bash
# 提交消息
git commit -m "fix:2262 修复登录超时问题"
git push origin dev
```

**Pipeline 执行**:

1. 自动触发构建
2. 扫描到 `fix:2262`
3. 查询禅道获取 Bug 信息
4. 调用 API 更新 Bug 状态为 `resolved`
5. 添加评论记录修复信息

**飞书通知** (绿色卡片):

```
🐛 pwtk超管端Bug更新

Bug #2262: 登录超时问题
状态变化: active → resolved ✅
相关提交: 修复人: 张三 [abc1234]

[查看详情] (按钮)
```

**飞书汇总** (蓝色卡片):

```
🚀 pwtk超管端版本发布

版本: v1.2.14 → HEAD

已解决Bug (1个):
• #2262 登录超时问题
```

---

### Release Pipeline 示例输出

**场景**: 创建正式版本 v1.2.15

```bash
# 创建 Tag
git tag -a v1.2.15 -m "Release v1.2.15"
git push origin v1.2.15
```

**Pipeline 执行**:

1. 检测到 Tag v1.2.15
2. 扫描从 v1.2.14 到 v1.2.15 的提交
3. 发现 `fix:2262` 和 `fix:2265`
4. 查询禅道获取 Bug 信息
5. **不更新** Bug 状态（只汇总）
6. 更新版本文件
7. 打包并归档

**飞书通知** (蓝色卡片):

```
🚀 pwtk超管端版本发布

版本: v1.2.14 → v1.2.15

已解决Bug (2个):
• #2262 登录超时问题
• #2265 权限验证错误
```

**Telegram 详细通知**:

```
✅ 发布成功

时间: 2025-10-15 14:30:25
项目名称: pwtk-super-admin-web
Tag: v1.2.15
版本: 1.2.15
发布包: pwtk-super-admin-web-1.2.15.zip
文件大小: 2.3M
下载地址: http://jenkins-pw-admin.pwtk.cc:6061/.../pwtk-super-admin-web-1.2.15.zip
提交信息: Release v1.2.15
提交日期: 2025-10-15 14:28:10
commit hash: abc12345
耗时: 3分45秒

📋 本次修复内容:
• fix:2262 修复登录超时问题
• fix:2265 修复权限验证错误

版本范围: v1.2.14 → v1.2.15
```

---

## ⚡ 快速决策指南

### 什么时候用 Dev Pipeline？

- ✅ 日常开发提交代码
- ✅ 需要快速验证功能
- ✅ 修复的 Bug 需要立即在禅道中标记为已解决
- ✅ 部署到开发/测试环境

### 什么时候用 Release Pipeline？

- ✅ 准备发布新版本
- ✅ 需要生成发布包供下载
- ✅ 需要完整的版本管理（自动更新版本号）
- ✅ 需要详细的发布记录和通知
- ✅ 部署到生产环境前

---

## 📚 相关文档

- [禅道集成文档](./README_ZENTAO.md)
- [Jenkins 主配置文档](./README.md)
- [Lark 通知文档](./README_LARK.md)

---

## 🔧 配置清单

### Dev Pipeline 需要配置

- ✅ Jenkins 禅道凭据: `zentao-credentials`
- ✅ 禅道 PRODUCT_ID: `13`
- ✅ Lark Webhook (管端)
- ✅ Telegram Bot Token
- ✅ SCM 轮询配置

### Release Pipeline 需要配置

- ✅ Jenkins 禅道凭据: `zentao-credentials`
- ✅ Jenkins Git 凭据: `bf04844e-d069-43d6-9333-d20cd2caa5b9`
- ✅ 禅道 PRODUCT_ID: `1`
- ✅ Lark Webhook (超管端)
- ✅ Telegram Bot Token
- ✅ 发布记录目录: `/home/www/jenkins-release-records/pwtk-super-admin-web`

---

**最后更新**: 2025-10-15

**维护者**: DevOps Team
