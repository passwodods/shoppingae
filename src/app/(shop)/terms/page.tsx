import type { Metadata } from "next";
import { getWPPage } from "@/lib/wordpress";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions governing your use of ShopAE.",
};

export const revalidate = 86400;

export default async function TermsPage() {
  const page = await getWPPage("terms");

  return (
    <div className="container-shop py-12 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} className="mb-6" />

      {page ? (
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-8" dangerouslySetInnerHTML={{ __html: page.title }} />
          <div
            className="prose prose-gray prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-[#2E6F40]"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <div className="prose prose-gray prose-lg max-w-none">
            <p className="text-gray-500 text-sm mb-8">Last updated: January 2025</p>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using ShopAE, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            <h2>2. Products and Pricing</h2>
            <p>All product descriptions, prices, and availability are subject to change without notice. We reserve the right to refuse service, cancel orders, or limit quantities at our discretion.</p>
            <h2>3. Order Policy</h2>
            <p>Orders are confirmed via email. We reserve the right to cancel any order due to pricing errors, out-of-stock items, or fraud detection. Full refunds are issued for cancelled orders.</p>
            <h2>4. Returns & Refunds</h2>
            <p>We accept returns within 30 days of delivery for unused products in original packaging. Contact our support team to initiate a return.</p>
            <h2>5. Intellectual Property</h2>
            <p>All content on this site — including text, images, and branding — is the property of ShopAE and may not be reproduced without written permission.</p>
            <h2>6. Limitation of Liability</h2>
            <p>ShopAE shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
            <h2>7. Governing Law</h2>
            <p>These terms are governed by the laws of the United Arab Emirates. Any disputes shall be resolved in the courts of Dubai, UAE.</p>
          </div>
        </>
      )}
    </div>
  );
}
