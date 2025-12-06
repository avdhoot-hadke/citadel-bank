import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient'; // Your configured Axios (localhost:8080)
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Forward query params (page, size)
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '10';

        const response = await axiosClient.get(`/api/beneficiaries?page=${page}&size=${size}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return NextResponse.json(
                error.response?.data || { message: "Error fetching beneficiaries" },
                { status: error.response?.status || 500 }
            );
        }
    }
}

// 2. Add Beneficiary (POST)
// Put this in the SAME file (route.ts)
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const body = await request.json();

        const response = await axiosClient.post('/api/beneficiaries', body, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return NextResponse.json(
                error.response?.data || { message: "Error adding beneficiary" },
                { status: error.response?.status || 500 }
            );
        }
    }
}