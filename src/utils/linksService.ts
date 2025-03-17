'use client';

// 定义Link类型
export interface Link {
    id: string;
    title: string;
    url: string;
    description?: string;
    category: string;
}

// 获取 cookie
function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
}

// 检查是否已认证
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    const token = getCookie('auth_token');
    return token === process.env.NEXT_PUBLIC_ACCESS_TOKEN;
}

// 获取所有链接
export async function getAllLinks(): Promise<Link[]> {
    try {
        const response = await fetch('/api/links');
        if (!response.ok) {
            throw new Error('Failed to fetch links');
        }
        return response.json();
    } catch (error) {
        console.error('获取链接失败:', error);
        return [];
    }
}

// 获取所有分类（去重）
export async function getAllCategories(): Promise<string[]> {
    const links = await getAllLinks();
    const categoriesSet = new Set<string>();

    links.forEach(link => {
        if (link.category) {
            categoriesSet.add(link.category);
        }
    });

    return Array.from(categoriesSet);
}

// 添加新链接
export async function addLink(linkData: Omit<Link, 'id'>): Promise<Link> {
    const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
    });

    if (!response.ok) {
        throw new Error('Failed to add link');
    }

    return response.json();
}

// 更新现有链接
export async function updateLink(
    id: string,
    linkData: Omit<Link, 'id'>
): Promise<Link | null> {
    const response = await fetch('/api/links', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...linkData }),
    });

    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new Error('Failed to update link');
    }

    return response.json();
}

// 删除链接
export async function deleteLink(id: string): Promise<boolean> {
    const response = await fetch(`/api/links?id=${id}`, {
        method: 'DELETE',
    });

    if (!response.ok && response.status !== 404) {
        throw new Error('Failed to delete link');
    }

    return response.status === 204;
}

// 根据ID获取单个链接
export async function getLinkById(id: string): Promise<Link | null> {
    const links = await getAllLinks();
    return links.find(link => link.id === id) || null;
}