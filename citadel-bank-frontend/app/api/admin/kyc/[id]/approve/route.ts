import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient'; // This points to localhost:8080
import { cookies } from 'next/headers';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const response = await axiosClient.post(
            `/api/admin/kyc/${id}/approve`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Admin Action Failed:", error.response?.data);
        return NextResponse.json(
            { message: "Action Failed" },
            { status: error.response?.status || 500 }
        );
    }
}