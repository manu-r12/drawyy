"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormData {
    email: string;
    password: string;
    confirmPassword?: string; // Only for sign-up
    rememberMe: boolean;
}

const AuthForm: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        confirmPassword: "",
        rememberMe: false,
    });
    const [isSignUp, setIsSignUp] = useState<boolean>(false); // For toggling between login and sign-up

    // If the user is authenticated, redirect to the dashboard
    if (status === "authenticated") {
        router.push("/");
        return null;
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            if (isSignUp) {
                // Handle sign-up logic
                console.log("Sign up attempted with:", formData);
            } else {
                // Handle login logic
                console.log("Login attempted with:", formData);
            }
        } catch (error) {
            console.error("Authentication error:", error);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <div className="flex h-screen w-full">
            <div className="hidden lg:block lg:w-[70%] relative bg-gray-200 overflow-hidden">
                <img
                    src="/images/bg_1.jpg"
                    alt="Login visual"
                    className="w-full h-full object-cover"
                />
                <div className="absolute -top-[160px] inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white animate-fade-in">
                    <img
                        src="/images/mac.png"
                        alt="Drawyy Logo"
                        className="w-[600px] h-[600px] object-contain"
                    />
                    <h1 className="text-transparent text-6xl font-bold bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        Drawwy
                    </h1>
                    <p className="mt-2 -tracking-tight text-lg">Unleash your imagination with AI!</p>
                    <p className="mt-2 -tracking-tight text-lg">
                        Draw what you can imagine and let the AI do rest of the work
                    </p>
                    <p className="mt-2 -tracking-tight text-lg">For you</p>
                </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="w-full lg:w-[30%] flex items-center justify-center px-6 bg-white animate-slide-in">
                <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[80px] border-t-appleBlue border-l-[40px] border-l-transparent"></div>
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {isSignUp ? "Create an Account" : "Welcome Back!"}
                        </h2>
                        <p className="mt-2 text-gray-600">
                            {isSignUp
                                ? "Enter your details to create an account."
                                : "Enter your details to continue to Drawyy."}
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 bg-gray-100 p-6 rounded-xl shadow-lg transition-all hover:shadow-xl"
                    >
                        <div className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm transition duration-200 hover:border-black focus:border-black focus:outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="relative mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm transition duration-200 hover:border-black focus:border-black focus:outline-none"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 transition duration-200 hover:text-black focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field (for Sign Up) */}
                            {isSignUp && (
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="relative mt-2">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            required={isSignUp}
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm transition duration-200 hover:border-black focus:border-black focus:outline-none"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-black px-4 py-2 text-white font-semibold shadow-md transition duration-300 hover:bg-gray-800 hover:shadow-lg"
                        >
                            {isSignUp ? "Sign Up" : "Login"}
                        </button>

                        {/* Google Login Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="flex items-center justify-center w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-md transition duration-300 hover:border-black hover:bg-gray-50"
                        >
                            <FcGoogle className="mr-2 h-5 w-5" />
                            Continue with Google
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            {isSignUp
                                ? "Already have an account? "
                                : "Don't have an account? "}
                            <a
                                href="#"
                                className="text-black font-medium hover:underline"
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? "Login" : "Sign up"}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
