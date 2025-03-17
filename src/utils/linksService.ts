'use client';

// 定义Link类型
export interface Link {
    id: string;
    title: string;
    url: string;
    description?: string;
    category: string;
}

// 存储键名
const LINKS_STORAGE_KEY = 'homepage_links';

// 检查是否已认证
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    const token = localStorage.getItem('auth_token');
    return token === process.env.NEXT_PUBLIC_ACCESS_TOKEN;
}

// 获取所有链接
export function getAllLinks(): Link[] {
    if (!isAuthenticated()) {
        return [];
    }

    if (typeof window === 'undefined') {
        return [];
    }

    const linksJson = localStorage.getItem(LINKS_STORAGE_KEY);
    if (!linksJson) {
        return [];
    }

    try {
        return JSON.parse(linksJson);
    } catch (error) {
        console.error('解析links数据错误:', error);
        return [];
    }
}

// 获取所有分类（去重）
export function getAllCategories(): string[] {
    const links = getAllLinks();
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
    if (!isAuthenticated()) {
        throw new Error('未经授权的操作');
    }

    const links = getAllLinks();
    const newId = Date.now().toString() + Math.floor(Math.random() * 1000);
    const newLink: Link = {
        id: newId,
        ...linkData
    };

    const updatedLinks = [...links, newLink];
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));

    return newLink;
}

// 更新现有链接
export async function updateLink(
    id: string,
    linkData: Omit<Link, 'id'>
): Promise<Link | null> {
    if (!isAuthenticated()) {
        throw new Error('未经授权的操作');
    }

    const links = getAllLinks();
    const linkIndex = links.findIndex(link => link.id === id);

    if (linkIndex === -1) {
        return null;
    }

    const updatedLink: Link = {
        id,
        ...linkData
    };

    links[linkIndex] = updatedLink;
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));

    return updatedLink;
}

// 删除链接
export async function deleteLink(id: string): Promise<boolean> {
    if (!isAuthenticated()) {
        throw new Error('未经授权的操作');
    }

    const links = getAllLinks();
    const filteredLinks = links.filter(link => link.id !== id);

    if (filteredLinks.length === links.length) {
        return false;
    }

    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(filteredLinks));
    return true;
}

// 根据ID获取单个链接
export function getLinkById(id: string): Link | null {
    if (!isAuthenticated()) {
        throw new Error('未经授权的操作');
    }

    const links = getAllLinks();
    const link = links.find(link => link.id === id);
    return link || null;
}