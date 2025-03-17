import fs from 'fs';
import path from 'path';
import { Link } from './linksService';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'links.json');

// 确保数据目录存在
function ensureDataDirectory() {
    const dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

// 读取链接数据
export function readLinksFromFile(): Link[] {
    try {
        ensureDataDirectory();
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, '[]', 'utf8');
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading links file:', error);
        return [];
    }
}

// 写入链接数据
export function writeLinksToFile(links: Link[]): void {
    try {
        ensureDataDirectory();
        fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing links file:', error);
        throw new Error('Failed to save links');
    }
}

// 添加新链接
export function addLinkToFile(link: Link): void {
    const links = readLinksFromFile();
    links.push(link);
    writeLinksToFile(links);
}

// 更新链接
export function updateLinkInFile(id: string, updatedLink: Link): void {
    const links = readLinksFromFile();
    const index = links.findIndex(link => link.id === id);
    if (index !== -1) {
        links[index] = updatedLink;
        writeLinksToFile(links);
    }
}

// 删除链接
export function deleteLinkFromFile(id: string): void {
    const links = readLinksFromFile();
    const filteredLinks = links.filter(link => link.id !== id);
    writeLinksToFile(filteredLinks);
}

// 导入链接数据
export function importLinksToFile(links: Link[]): void {
    writeLinksToFile(links);
}

// 获取单个链接
export function getLinkFromFile(id: string): Link | null {
    const links = readLinksFromFile();
    return links.find(link => link.id === id) || null;
}