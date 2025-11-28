'use client'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');

            toast.success("Logged out successfully");

            router.push('/auth/signin');
            router.refresh();
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    return (
        <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium">
            Logout
        </button>
    );
}