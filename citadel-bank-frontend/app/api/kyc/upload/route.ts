import { NextResponse } from 'next/server';
import axios, { isAxiosError } from 'axios';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const formData = await request.formData();

        const backendResponse = await axios.post('http://localhost:8080/api/kyc/upload', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' // Important
            }
        });

        return NextResponse.json(backendResponse.data);

    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.error("KYC Upload Error:", error.response?.data || error.message);
            return NextResponse.json(
                error.response?.data || { message: "Upload failed" },
                { status: error.response?.status || 500 }
            );
        }
    }
}