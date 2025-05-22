import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function ProtectedPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/admin/login');
    }

    try {
        jwt.verify(token, JWT_SECRET);
    } catch (e) {
        redirect('/admin/login');
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold mb-4">Защищённая страница админки</h1>
            <p>Это защищённые данные, доступные только после входа.</p>
        </div>
    );
}
