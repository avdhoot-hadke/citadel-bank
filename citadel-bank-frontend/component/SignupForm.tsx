'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import TextField from './textfield';
import Link from "next/link";
import axios from 'axios';

export default function SignUpForm() {
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    type Inputs = {
        username: string,
        email: string,
        password: string,
        pin: string
    }
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

    const registerHandler = async (data: any) => {
        setLoader(true);

        try {

            await axios.post("/api/auth/register", data);

            toast.success("Registration Successful!");
            router.push("/auth/signin");
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response.data || "Registration Failed!"
            toast.error(errorMessage);
        } finally {
            setLoader(false);
        }
    };


    return (
        <div
            className='flex justify-center items-center'>
            <form onSubmit={handleSubmit(registerHandler)}
                className="flex flex-col w-full justify-center items-center">
                <h1 className="text-3xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-8">
                    Register
                </h1>

                <div className="flex flex-col gap-3 lg:w-[] sm:w-2/3 w-full sm:px-0 px-4">
                    <TextField
                        label="Username"
                        required
                        id="username"
                        type="text"
                        message="Username is required"
                        placeholder="Enter Username"
                        register={register}
                        errors={errors}
                    />

                    <TextField
                        label="Email"
                        required
                        id="email"
                        type="email"
                        message="Email is required"
                        placeholder="Enter Email"
                        register={register}
                        errors={errors}
                    />

                    <TextField
                        label="Pin"
                        required
                        id="pin"
                        type="password"
                        message="Pin is required"
                        placeholder="Enter Pin"
                        register={register}
                        min={4}
                        errors={errors}
                    />

                    <TextField
                        label="Password"
                        required
                        id="password"
                        type="password"
                        message="Password is required"
                        placeholder="Enter password"
                        register={register}
                        min={6}
                        errors={errors}
                    />
                </div>

                <button
                    disabled={loader}
                    type='submit'
                    className='w-fit px-12 font-semibold hover:bg-slate-700 cursor-pointer hover:text-white text-slate-700 border-[0.5px] border-slate-600   py-2  transition-colors duration-100 rounded-sm mt-6'>
                    {loader ? "Loading..." : "Register"}
                </button>

                <p className='text-center text-xs font-light text-slate-700 mt-6'>
                    Already have an account?
                    <Link href="/auth/signin" className="hover:text-black text-blue-700">
                        <span className="text-btnColor"> SignIn</span>
                    </Link>
                </p>
            </form>
        </div>

    )
}
