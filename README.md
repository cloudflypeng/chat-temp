# Chat Template

一个基于 OpenRouter API 的聊天应用模板。

## 开始使用

### 1. 获取 OpenRouter API Key

1. 访问 [OpenRouter](https://openrouter.ai/)
2. 点击右上角 "Sign Up" 注册账号
3. 登录后点击右上角头像，选择 "API Keys"
4. 点击 "Create API Key" 创建新的 API key
5. 复制生成的 API key

### 2. 配置环境变量

1. 在项目根目录创建 `.env` 或者 `.env.local` 文件
2. 添加以下配置：

```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_OPENROUTER_MODEL=your_openrouter_model
```

### 3. 安装依赖并且运行

```
npm install
npm run dev
```
