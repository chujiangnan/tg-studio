# 服务端联调说明（尚未实现）

当前 PWA 不会直接连接 Telegram，也没有把 API Hash 或 Session 放在浏览器端。

建议下一阶段 API：
- `POST /api/auth/telegram/start`：开始官方登录挑战
- `POST /api/auth/telegram/verify`：提交验证码
- `POST /api/auth/telegram/2fa`：按官方流程提交二步验证
- `GET /api/accounts`：读取当前用户账号元数据
- `GET/POST /api/contacts`：管理用户明确授权的联系人
- `GET/POST /api/templates`：管理消息模板
- `GET/POST /api/tasks`：保存和审阅任务草稿
- `POST /api/tasks/{id}/approve`：人工确认合规任务
- `GET /api/tasks/{id}/status`：读取任务状态

生产实现必须先完成用户身份认证、权限隔离、CSRF 防护、审计日志、Session 加密存储、速率限制和异常处理。禁止把 Telegram Session、验证码或 2FA 密码返回前端。
