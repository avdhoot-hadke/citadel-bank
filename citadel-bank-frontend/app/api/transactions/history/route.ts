import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';

export async function GET(request: Request) {
    try {
        // 1. Get the Token
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 2. Extract Query Parameters (page, size) from the URL
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '10';

        // 3. Call Spring Boot Backend
        // The backend uses the Token to identify the user, so we don't need accountId anymore
        const response = await axiosClient.get(`/api/transactions/history`, {
            params: { page, size },
            headers: { Authorization: `Bearer ${token}` }
        });

        // 4. Return Data to Frontend
        return NextResponse.json(response.data);

    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.error("Transaction History Error:", error.response?.data || error.message);
            return NextResponse.json(
                error.response?.data || { message: "Error fetching transactions" },
                { status: error.response?.status || 500 }
            );
        }

    }
}