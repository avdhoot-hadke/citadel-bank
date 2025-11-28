const TextField = ({
    label,
    id,
    type = "text",
    errors,
    register,
    required,
    message,
    className = "",
    min,
    placeholder,
}: { [key: string]: any }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={id} className={`${className} font-thin text-md`}>
                {label}
            </label>

            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className={`px-2 py-2 border-[0.5px] outline-none bg-transparent text-slate-700 rounded-md  border-slate-200 hover:border-blue-200 transition-all duration-300
                    ${errors[id] ? "border-red-500" : "border-slate-400"}
                    ${className}
                `}
                {...register(id, {
                    required: required ? message : false,

                    minLength: min
                        ? { value: min, message: `Minimum ${min} characters required` }
                        : undefined,

                    pattern:
                        type === "email"
                            ? {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email format",
                            }
                            : type === "url"
                                ? {
                                    value:
                                        /^(https?:\/\/)?(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d{2,5})?(\/.*)?$/,
                                    message: "Please enter a valid URL",
                                }
                                : id === "password"
                                    ? {
                                        value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                                        message: "Password must contain 6+ characters, 1 letter, and 1 number",
                                    }
                                    : id === "pin"
                                        ? {
                                            value: /^\d{4,6}$/,
                                            message: "PIN must be 4 to 6 digits",
                                        }
                                        : undefined,
                })}
            />

            {errors[id]?.message && (
                <p className="text-sm font-semibold text-red-600 mt-0">
                    {errors[id].message}*
                </p>
            )}
        </div>
    );
};

export default TextField;
