import type { Metadata } from "next";
import { getWPPage } from "@/lib/wordpress";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how ShopAE collects, uses, and protects your personal information.",
};

export const revalidate = 86400;

export default async function PrivacyPolicyPage() {
  const page = await getWPPage("privacy-policy");

  return (
    <div className="container-shop py-12 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} className="mb-6" />

      {page ? (
        <>
          <h1
            className="text-3xl font-bold text-gray-900 mb-8"
            dangerouslySetInnerHTML={{ __html: page.title }}
          />
          <div
            className="prose prose-gray prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-a:text-[#2E6F40] hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </>
      ) : (
        /* Fallback static content */
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <div className="prose prose-gray prose-lg max-w-none">
            <p className="text-gray-500 text-sm mb-8">Last updated: January 2025</p>
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us when making a purchase, creating an account, or contacting our customer support team. This includes your name, email address, phone number, billing and shipping address, and payment information.</p>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to process orders and payments, send transactional and promotional communications, improve our services, and comply with legal obligations.</p>
            <h2>3. Data Security</h2>
            <p>We implement industry-standard security measures including SSL encryption to protect your personal information. Payment data is never stored on our servers — it is processed securely via our payment providers.</p>
            <h2>4. Cookies</h2>
            <p>We use cookies and similar tracking technologies to provide and improve our services, personalise your experience, and analyse site traffic.</p>
            <h2>5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:privacy@shopae.com">privacy@shopae.com</a> to exercise your rights.</p>
            <h2>6. Contact</h2>
            <p>For privacy inquiries, contact us at <a href="mailto:privacy@shopae.com">privacy@shopae.com</a> or write to ShopAE, Dubai, United Arab Emirates.</p>
          </div>
        </>
      )}
    </div>
  );
}
