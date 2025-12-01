import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // CORRECT ENDPOINT: Fetch Accounts (List<AccountDTO>)
        const response = await axiosClient.get('/api/accounts', {
            headers: { Authorization: `Bearer ${token}` }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            error.response?.data || { message: "Error fetching accounts" },
            { status: error.response?.status || 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const body = await request.json();

        const response = await axiosClient.post('/api/accounts', body, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            error.response?.data || { message: "Error creating account" },
            { status: error.response?.status || 500 }
        );
    }
}