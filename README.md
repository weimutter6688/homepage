# Homepage

个人主页链接管理系统

## 功能特点

- 链接分类管理
- 支持排序
- 令牌验证访问控制
- 响应式设计

## 开发环境设置

1. 克隆仓库：
```bash
git clone <repository-url>
cd homepage
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
# 复制环境变量示例文件
cp .env.example .env

# 生成访问令牌（使用 OpenSSL）
# 此命令会生成一个 32 位的随机令牌
openssl rand -base64 32 | tr -d '/+=' | cut -c1-32
```

将生成的令牌添加到 `.env` 文件中：
```env
NEXT_PUBLIC_ACCESS_TOKEN=your-generated-token
```

4. 启动开发服务器：
```bash
npm run dev
```

现在你可以访问 http://localhost:3000 来查看应用。

## Vercel 一键部署

1. 点击下方按钮一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/homepage)

2. 部署过程中需要配置环境变量：
   - 在 Vercel 项目设置中找到 "Environment Variables" 部分
   - 添加环境变量 `NEXT_PUBLIC_ACCESS_TOKEN`
   - 使用以下命令生成一个安全的令牌：
     ```bash
     openssl rand -base64 32 | tr -d '/+=' | cut -c1-32
     ```
   - 将生成的令牌值填入环境变量

3. Vercel 会自动处理构建和部署过程。部署完成后，你可以：
   - 通过分配的域名访问应用
   - 配置自定义域名（如需要）
   - 在 Vercel 仪表板监控应用状态

## 使用说明

1. 首次访问时需要输入访问令牌进行验证
2. 验证通过后可以查看、添加、编辑和删除链接
3. 支持按分类组织链接
4. 可以按字母顺序或添加时间排序

## 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务
npm start
```

## 安全说明

- 请妥善保管访问令牌
- 建议定期更换令牌
- 不要在公共场合泄露令牌
- 在生产环境中使用足够长度和复杂度的令牌

## 技术栈

- Next.js 14
- React
- TypeScript
- Tailwind CSS
