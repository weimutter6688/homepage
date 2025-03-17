# Homepage

个人主页链接管理系统

## 功能特点

- 链接分类管理
- 支持排序
- 令牌验证访问控制
- 响应式设计
- 数据备份和恢复

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

## 部署

### Vercel 一键部署

1. 点击下方按钮一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/homepage)

2. 部署过程中需要配置环境变量：
   - 在 Vercel 项目设置中找到 "Environment Variables" 部分
   - 添加环境变量 `NEXT_PUBLIC_ACCESS_TOKEN`
   - 使用安全的令牌值

3. 部署完成后配置：
   - 可以设置自定义域名
   - 配置其他项目选项

## 使用说明

### 基本功能

1. 访问控制
   - 首次访问时需要输入访问令牌
   - 验证通过后可以进行其他操作
   - 支持登出功能

2. 链接管理
   - 添加新链接
   - 编辑现有链接
   - 删除链接
   - 按分类组织

3. 数据管理
   - 导出数据备份
   - 从备份文件恢复
   - 支持 JSON 格式

### 高级功能

1. 排序选项
   - 按字母顺序
   - 按添加时间
   - 自定义排序

2. 分类功能
   - 自定义分类
   - 分类折叠/展开
   - 分类统计

## 技术文档

- [Next.js 类型问题解决方案](./docs/NextJS_TYPE_ISSUES.md)

## 安全说明

- 请妥善保管访问令牌
- 建议定期更换令牌
- 不要在公共场合泄露令牌
- 在生产环境中使用足够长度和复杂度的令牌
- 定期备份数据以防丢失

## 技术栈

- Next.js 14
- React
- TypeScript
- Tailwind CSS

## 开发注意事项

1. 类型安全
   - 遵循 TypeScript 严格模式
   - 参考类型问题文档
   - 运行 `npm run lint` 检查代码

2. 代码规范
   - 使用 ESLint 规则
   - 遵循项目代码风格
   - 保持代码整洁

3. 性能优化
   - 使用适当的缓存策略
   - 优化组件渲染
   - 合理使用客户端/服务器组件

## 许可证

MIT
