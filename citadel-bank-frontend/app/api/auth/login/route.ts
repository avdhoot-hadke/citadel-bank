import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import axiosClient from '@/lib/axiosClient';

export async function POST(request: any) {
    try {
        const body = await request.json();

        const response = await axiosClient.post('/api/auth/login', body);

        const { token, username, roles } = response.data;

        const cookiesStore = await cookies();

        cookiesStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        return NextResponse.json({
            message: 'Login successful',
            username,
            roles,
        });

    } catch (error: any) {
        console.error("Login Error:", error.response?.data || error.message);

        const status = error.response?.status || 500;
        const message = error.response?.data || { message: "Internal Server Error" };

        return NextResponse.json(message, { status });
    }
}