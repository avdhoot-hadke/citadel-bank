import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await axiosClient.post('/api/auth/register', body);

        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error("Registration Error:", error.response?.data || error.message);

        const status = error.response?.status || 500;
        const message = error.response?.data || "Registration Failed";

        return NextResponse.json(message, { status });
    }
}
