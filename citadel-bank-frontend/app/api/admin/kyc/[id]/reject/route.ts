import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient';
import { cookies } from 'next/headers';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const id = params.id;

        const response = await axiosClient.post(`/api/admin/kyc/${id}/reject`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ message: "Rejection Failed" }, { status: error.response?.status || 500 });
    }
}