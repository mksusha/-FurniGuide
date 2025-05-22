// pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'secret') {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

        res.setHeader('Set-Cookie', serialize('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60, // 1 час
        }));

        return res.status(200).json({ message: 'Logged in' });
    }

    res.status(401).json({ error: 'Invalid credentials' });
}
