import type { Metadata } from "next";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { getFAQs } from "@/lib/wordpress";
import { faqSchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";
import { FAQAccordion } from "@/components/contact/FAQAccordion";

export const metadata: Metadata = {
  title: "Contact Us & FAQ",
  description: "Get in touch with ShopAE — we're here to help with your orders, returns, and questions.",
};

export const revalidate = 3600;

const CONTACT_CARDS = [
  { id: "phone", title: "Call Us", info: "+971 4 000 0000", sub: "Mon–Sat, 9 AM – 6 PM" },
  { id: "email", title: "Email Us", info: "support@shopae.com", sub: "We reply within 24 hrs" },
  { id: "chat", title: "Live Chat", info: "Chat with us now", sub: "Available on site" },
];

const DEFAULT_FAQS = [
  { question: "What are your delivery times?", answer: "We deliver within 1-3 business days across UAE. Same-day delivery available in Dubai for orders placed before 2 PM." },
  { question: "Do you offer free delivery?", answer: "Yes! Free standard delivery on all orders over AED 99." },
  { question: "How do I return a product?", answer: "We accept returns within 30 days of delivery. The product must be unused and in original packaging. Contact us to initiate a return." },
  { question: "Are the products authentic?", answer: "100%. We source directly from brand-authorised distributors and never sell grey market goods." },
  { question: "Can I track my order?", answer: "Yes! Once shipped, you'll receive an email with a tracking link. You can also track from your account dashboard." },
  { question: "What payment methods do you accept?", answer: "We accept Visa, Mastercard, American Express, Apple Pay, and Cash on Delivery." },
];

export default async function ContactPage() {
  const faqs = await getFAQs();
  const displayFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <>
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(displayFaqs)) }}
        />
      )}

      <div className="container-shop py-8">
        <Breadcrumbs items={[{ label: "Contact" }]} className="mb-6" />

        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="section-heading">How can we help?</h1>
          <p className="section-subheading mt-2">We're here Monday–Saturday, 9 AM – 6 PM UAE time.</p>
        </div>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {CONTACT_CARDS.map((item) => (
            <div key={item.id} className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-50 flex items-center justify-center">
                {item.id === "phone" && <Phone className="w-6 h-6 text-[#2E6F40]" />}
                {item.id === "email" && <Mail className="w-6 h-6 text-[#2E6F40]" />}
                {item.id === "chat"  && <MessageCircle className="w-6 h-6 text-[#2E6F40]" />}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-[#2E6F40] font-semibold text-sm">{item.info}</p>
              <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Contact form + FAQ split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <ContactForm />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <FAQAccordion items={displayFaqs} />
          </div>
        </div>
      </div>
    </>
  );
}
