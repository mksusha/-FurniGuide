import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export const config = {
    api: {
        bodyParser: false,
    },
};

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = file.name || `upload_${Date.now()}`;

        const result = await imagekit.upload({
            file: buffer,
            fileName,
        });

        return NextResponse.json({ url: result.url });
    } catch (error: any) {
        console.error('Ошибка загрузки:', error);
        return NextResponse.json({ error: 'Ошибка загрузки изображения' }, { status: 500 });
    }
}
