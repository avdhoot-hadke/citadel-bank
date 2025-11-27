'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextField from "./textfield";
import Link from "next/link";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";

export default function SigninForm() {
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    type Inputs = {
        username: string,
        password: string,
    }
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

    const loginHandler = async (data: any) => {
        setLoader(true);
        try {
            await axios.post("/api/auth/login", data);

            toast.success("Login Successful!");
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            toast.error("Invalid Credentials");
        } finally {
            setLoader(false);
        }
    };

    return (
        <div
            className='flex justify-center items-center'>
            <form onSubmit={handleSubmit(loginHandler)}
                className="flex flex-col w-full justify-center items-center">
                <h1 className="text-center font-thin lg:text-3xl text-2xl mb-8">
                    Login
                </h1>

                <div className="flex flex-col gap-3 lg:w-[] sm:w-2/3 w-full sm:px-0 px-8">
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
                    className='w-fit px-12 font-semibold text-slate-700 border-[0.5px] border-slate-600 py-2 hover:bg-slate-700 cursor-pointer hover:text-white   transition-colors duration-100 rounded-sm mt-6'>
                    {loader ? "Loading..." : "Login"}
                </button>

                <p className='text-center text-xs font-light text-slate-700 mt-6'>
                    Don't have an account?
                    <Link href="/auth/signup" className="hover:text-black text-blue-700">
                        <span className="text-btnColor"> SignUp</span>
                    </Link>
                </p>
            </form>
        </div>
    )
}

