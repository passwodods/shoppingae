"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerCustomer, loginCustomer } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth.store";
import toast from "react-hot-toast";

const registerSchema = z.object({
  first_name: z.string().min(2, "First name required"),
  last_name: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const { login, setLoading, isLoading } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerCustomer({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        password: data.password,
      });

      // Auto-login after registration
      const authToken = await loginCustomer({ username: data.username, password: data.password });
      login(authToken.token, authToken);
      toast.success("Account created! Welcome to ShopAE!");
      router.push("/account");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E6F40] to-[#166534] flex items-center justify-center">
              <span className="text-white font-black text-xl">S</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Join ShopAE and start shopping</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">First Name *</label>
                <input {...register("first_name")} className="input" placeholder="John" />
                {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Last Name *</label>
                <input {...register("last_name")} className="input" placeholder="Doe" />
                {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
              <input {...register("email")} type="email" className="input" placeholder="john@example.com" autoComplete="email" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Username *</label>
              <input {...register("username")} className="input" placeholder="johndoe123" autoComplete="username" />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password *</label>
              <div className="relative">
                <input {...register("password")} type={showPass ? "text" : "password"} className="input pr-10" placeholder="Min. 8 characters" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Confirm Password *</label>
              <input {...register("confirm_password")} type={showPass ? "text" : "password"} className="input" placeholder="Repeat password" autoComplete="new-password" />
              {errors.confirm_password && <p className="text-xs text-red-500 mt-1">{errors.confirm_password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2E6F40] font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
