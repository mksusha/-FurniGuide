import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secret';

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

        const response = NextResponse.json({ message: 'Logged in' });
        response.headers.set('Set-Cookie', serialize('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60,
        }));

        return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
