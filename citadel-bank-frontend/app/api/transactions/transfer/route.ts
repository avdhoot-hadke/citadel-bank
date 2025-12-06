import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const response = await axiosClient.post('/api/transactions/transfer', body, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return NextResponse.json(
                error.response?.data ?? { message: "Transfer failed" },
                { status: error.response?.status ?? 500 }
            );
        }

        return NextResponse.json(
            { message: "Unexpected error occurred" },
            { status: 500 }
        );
    }
}