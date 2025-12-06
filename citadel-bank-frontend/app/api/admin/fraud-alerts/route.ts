import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';

        const response = await axiosClient.get(`/api/admin/fraud-alerts?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching alerts" }, { status: error.response?.status || 500 });
    }
}