import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const response = await axiosClient.get('/api/admin/ledger/audit', {
            headers: { Authorization: `Bearer ${token}` }
        });

        return NextResponse.json(response.data);

    } catch (error: any) {
        return NextResponse.json({ message: "Audit Failed" }, { status: 500 });
    }
}