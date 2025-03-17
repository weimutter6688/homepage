# Next.js 13+ 类型问题解决方案

## 问题描述

在 Next.js 13+ 的 App Router 中，使用页面组件时遇到以下类型错误：

```typescript
Type error: Type 'Props' does not satisfy the constraint 'PageProps'.
  Types of property 'searchParams' are incompatible.
    Type '{ [key: string]: string | string[] | undefined; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
```

这个错误出现的原因是 Next.js 13+ 中页面组件的参数类型发生了变化，现在 `searchParams` 和 `params` 都是异步的（Promise）。

## 问题原因

1. Next.js 13+ 的改变
   - 页面参数现在是异步加载的
   - 需要等待参数解析完成
   - 类型定义需要反映这种异步特性

2. 错误的类型定义
```typescript
// ❌ 错误的定义
interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}
```

## 解决方案

1. 正确的类型定义：
```typescript
// ✅ 正确的定义
interface PageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
```

2. 在组件中使用 `use` 函数解析参数：
```typescript
export default function Page(props: PageProps) {
  const searchParams = use(props.searchParams);
  const sortOption = typeof searchParams.sort === 'string' ? searchParams.sort : 'default';
  
  return <Component option={sortOption} />;
}
```

3. 使用 Suspense 包装异步组件：
```typescript
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
```

## 最佳实践

1. 参数处理
   - 总是使用 `use` 函数处理异步参数
   - 提供默认值处理未定义的情况
   - 在类型定义中明确参数的异步性质

2. 类型安全
   - 为所有页面组件定义正确的参数类型
   - 使用 TypeScript 的严格模式
   - 明确声明所有可能的参数类型

3. 错误处理
   - 使用 try/catch 处理参数解析错误
   - 提供合适的错误反馈
   - 确保页面在参数无效时也能正常工作

## 常见陷阱

1. 直接访问参数
   ```typescript
   // ❌ 错误：直接访问
   const value = props.searchParams.value;
   
   // ✅ 正确：使用 use 函数
   const searchParams = use(props.searchParams);
   const value = searchParams.value;
   ```

2. 忘记处理异步性
   ```typescript
   // ❌ 错误：没有等待参数解析
   const { sort } = props.searchParams;
   
   // ✅ 正确：等待参数解析
   const searchParams = use(props.searchParams);
   const { sort } = searchParams;
   ```

3. 类型定义不完整
   ```typescript
   // ❌ 错误：缺少 Promise 包装
   interface Props {
     params: { id: string };
   }
   
   // ✅ 正确：包含 Promise
   interface Props {
     params: Promise<{ id: string }>;
   }
   ```

## 相关资源

- [Next.js 文档：路由处理](https://nextjs.org/docs/app/api-reference/file-conventions/page)
- [React use() Hook](https://react.dev/reference/react/use)
- [TypeScript 类型系统](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)