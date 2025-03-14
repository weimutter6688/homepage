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

// 获取所有链接
export function getAllLinks(): Link[] {
    if (typeof window === 'undefined') {
        return []; // 服务器端返回空数组
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
    const links = getAllLinks();

    // 生成新ID (简单实现，使用时间戳+随机数)
    const newId = Date.now().toString() + Math.floor(Math.random() * 1000);

    const newLink: Link = {
        id: newId,
        ...linkData
    };

    // 添加到链接列表
    const updatedLinks = [...links, newLink];

    // 保存到localStorage
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));

    return newLink;
}

// 更新现有链接
export async function updateLink(
    id: string,
    linkData: Omit<Link, 'id'>
): Promise<Link | null> {
    const links = getAllLinks();
    const linkIndex = links.findIndex(link => link.id === id);

    if (linkIndex === -1) {
        return null;
    }

    // 更新链接
    const updatedLink: Link = {
        id,
        ...linkData
    };

    links[linkIndex] = updatedLink;

    // 保存到localStorage
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));

    return updatedLink;
}

// 删除链接
export async function deleteLink(id: string): Promise<boolean> {
    const links = getAllLinks();
    const filteredLinks = links.filter(link => link.id !== id);

    // 如果长度相同，说明没有找到要删除的链接
    if (filteredLinks.length === links.length) {
        return false;
    }

    // 保存到localStorage
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(filteredLinks));

    return true;
}

// 根据ID获取单个链接
export function getLinkById(id: string): Link | null {
    const links = getAllLinks();
    const link = links.find(link => link.id === id);

    return link || null;
}