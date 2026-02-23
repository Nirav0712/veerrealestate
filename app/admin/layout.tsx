import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    let isValid = false;
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        const { id, sessionId } = decoded;

        // Check if sessionId matches the one in database
        const [rows]: any = await pool.query(
            "SELECT sessionId FROM register WHERE id = ?",
            [id]
        );

        if (rows.length > 0 && rows[0].sessionId === sessionId) {
            isValid = true;
        }
    } catch (error) {
        console.error('Session verification error:', error);
    }

    if (!isValid) {
        redirect('/api/logout');
    }

    return <>{children}</>;
}
