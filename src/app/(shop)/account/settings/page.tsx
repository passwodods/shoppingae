"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight, Loader2, Save } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const settingsSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  email: z.string().email("Valid email required"),
  current_password: z.string().optional(),
  new_password: z.string().optional(),
  confirm_password: z.string().optional(),
}).refine(
  (data) => !data.new_password || data.new_password === data.confirm_password,
  { message: "Passwords don't match", path: ["confirm_password"] }
);

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function AccountSettingsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user) {
      reset({
        first_name: user.user_display_name.split(" ")[0] ?? "",
        last_name: user.user_display_name.split(" ").slice(1).join(" ") ?? "",
        email: user.user_email,
      });
    }
  }, [isAuthenticated, user, router, reset]);

  if (!isAuthenticated) return null;

  const onSubmit = async (data: SettingsFormData) => {
    // In production: call WooCommerce customers/{id} PUT with Bearer token
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Settings saved!");
  };

  return (
    <div className="container-shop py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="text-gray-400 hover:text-gray-600 text-sm">Account</Link>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">First Name</label>
              <input {...register("first_name")} className="input" />
              {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Last Name</label>
              <input {...register("last_name")} className="input" />
              {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
            <input {...register("email")} type="email" className="input" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* Change Password */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Change Password</h2>
          <p className="text-sm text-gray-500">Leave blank to keep your current password.</p>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Current Password</label>
            <input {...register("current_password")} type="password" className="input" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">New Password</label>
              <input {...register("new_password")} type="password" className="input" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Confirm Password</label>
              <input {...register("confirm_password")} type="password" className="input" placeholder="••••••••" />
              {errors.confirm_password && <p className="text-xs text-red-500 mt-1">{errors.confirm_password.message}</p>}
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSubmitting ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

