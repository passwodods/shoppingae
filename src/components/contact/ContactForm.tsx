"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSent(true);
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
        <p className="text-gray-500 mb-4">We'll get back to you within 24 hours.</p>
        <button onClick={() => setSent(false)} className="btn-ghost">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name *</label>
        <input {...register("name")} className="input" placeholder="Your name" />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
        <input {...register("email")} type="email" className="input" placeholder="your@email.com" />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subject *</label>
        <input {...register("subject")} className="input" placeholder="Order query, return, etc." />
        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Message *</label>
        <textarea
          {...register("message")}
          rows={5}
          className="input resize-none"
          placeholder="Describe your query in detail…"
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isSubmitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
