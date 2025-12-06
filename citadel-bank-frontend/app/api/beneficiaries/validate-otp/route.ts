import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';

export async function POST(request: Request) {
    try {
        // 1. Get Token from Cookie
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 2. Get Data from Frontend
        const body = await request.json(); // { beneficiaryId, otp }

        // 3. Call Spring Boot
        const response = await axiosClient.post('/api/beneficiaries/validate-otp', body, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 4. Return Success
        return NextResponse.json(response.data);

    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.error("OTP Error:", error.response?.data);
            return NextResponse.json(
                error.response?.data || { message: "Invalid OTP" },
                { status: error.response?.status || 500 }
            );
        }
    }
}