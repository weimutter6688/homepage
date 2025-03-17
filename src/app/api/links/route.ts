import { NextRequest, NextResponse } from 'next/server';
import {
    readLinksFromFile,
    addLinkToFile,
    deleteLinkFromFile,
    updateLinkInFile,
    importLinksToFile
} from '@/utils/serverStorage';
import { Link } from '@/utils/linksService';

// GET 请求不需要认证
const publicRoutes = ['GET'];

// 验证访问权限
function validateAccess(request: NextRequest) {
    // GET 请求直接允许访问
    if (publicRoutes.includes(request.method)) {
        return true;
    }

    // 检查令牌
    const token = request.cookies.get('auth_token');
    return token?.value === process.env.NEXT_PUBLIC_ACCESS_TOKEN;
}

// GET /api/links - 获取所有链接
export async function GET(request: NextRequest) {
    if (!validateAccess(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const links = readLinksFromFile();
        return NextResponse.json(links);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
    }
}

// POST /api/links - 创建新链接或导入链接
export async function POST(request: NextRequest) {
    if (!validateAccess(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();

        // 处理导入操作
        if (data.action === 'import' && Array.isArray(data.data)) {
            importLinksToFile(data.data);
            return NextResponse.json({ message: 'Links imported successfully' });
        }

        // 处理添加单个链接
        const newId = Date.now().toString() + Math.floor(Math.random() * 1000);
        const newLink: Link = {
            id: newId,
            ...data
        };

        addLinkToFile(newLink);
        return NextResponse.json(newLink, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

// PUT /api/links - 更新链接
export async function PUT(request: NextRequest) {
    if (!validateAccess(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const { id, ...updateData } = data;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updatedLink: Link = {
            id,
            ...updateData
        };

        updateLinkInFile(id, updatedLink);
        return NextResponse.json(updatedLink);
    } catch {
        return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
    }
}

// DELETE /api/links?id=xxx - 删除链接
export async function DELETE(request: NextRequest) {
    if (!validateAccess(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        deleteLinkFromFile(id);
        return new NextResponse(null, { status: 204 });
    } catch {
        return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
    }
}