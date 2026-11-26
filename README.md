# TG Studio Mobile PWA 0.1.0

iPhone 优先的手机网页应用（PWA），兼容 Android Chrome。此版本是可运行的本地管理原型，不是已连接 Telegram 的正式客户端。

## 当前可用功能
- 首页概览
- 账号资料登记（仅备注和手机号，不收集密码/验证码/API Hash）
- 联系人授权名单（添加时必须勾选已取得明确同意）
- 消息模板创建、保存和删除
- 任务草稿创建，可选择授权联系人和模板
- 操作日志、JSON 本地备份、清空本机数据
- PWA manifest、Service Worker 离线缓存

## 尚未实现
- Telegram 官方 API 登录、验证码和 2FA 流程
- 服务端账号 Session 安全存储
- 真实消息发送、发送状态回执
- 多设备同步、服务器身份认证、管理员权限
- App Store / Google Play 上架

## iPhone 安装
1. 将本项目部署到支持 HTTPS 的网站或测试服务器。
2. 用 iPhone Safari 打开网站（建议不要用内置浏览器）。
3. 点击 Safari 的“分享”按钮。
4. 选择“添加到主屏幕”，确认添加。
5. 从主屏幕打开 TG Studio。首次访问后可缓存基础页面。

注意：PWA 的安装和离线能力需要 HTTPS（localhost 开发环境除外）。直接从文件管理器打开 index.html 不会启用完整 PWA 能力。

## Android 安装
1. 用 Chrome 打开 HTTPS 部署地址。
2. 使用浏览器菜单中的“安装应用”或“添加到主屏幕”。

## 本地预览
可用任意静态 HTTP 服务，例如：
```bash
python -m http.server 8080
```
然后在同一网络设备上访问 `http://电脑局域网IP:8080`。iPhone 非 localhost 场景下要测试完整安装能力，仍建议 HTTPS。

## 数据位置与限制
演示数据保存在当前浏览器 localStorage。清理网站数据、换浏览器或换设备会导致数据不可用。JSON 导出不包含 Telegram 登录凭据，因为此版本根本不采集凭据。不要将备份文件发给不可信的人。

## 下一阶段技术方案
- 前端：继续使用 PWA，完善响应式交互和表单校验。
- 后端：建议 FastAPI + PostgreSQL，所有 Telegram API 调用在服务端完成。
- 授权：用户自己的 Telegram API 凭据由服务端加密管理；登录挑战、验证码、2FA 只走 Telegram 正规流程。
- Session：加密静态存储，密钥放环境变量或 KMS；绝不写入浏览器 localStorage、前端日志或导出包。
- 发送控制：只允许用户自有/管理的频道群组，或明确同意接收消息的联系人；加入频率限制、退订/拉黑、审计日志和人工确认。
- 部署：HTTPS、身份认证、CSRF 防护、速率限制、备份和安全监控。

## 安全边界
本项目不提供绕过 Telegram 反垃圾系统、规避限流、批量骚扰陌生用户、窃取/导入来源不明 Session 或绕过验证码的功能。
