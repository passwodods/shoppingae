"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  User,
  Star as StarIcon,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Truck,
  Layers,
  HelpCircle as FaqIcon,
  ChevronDown,
} from "lucide-react";
import type { WCProduct, WCReview } from "@/types/product";
import { StarRating, RatingInput } from "@/components/ui/StarRating";
import { createReview } from "@/lib/woocommerce";
import { formatDate, stripHtml } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductTabsProps {
  product: WCProduct;
  reviews: WCReview[];
}

const reviewSchema = z.object({
  reviewer: z.string().min(2, "Name is required"),
  reviewer_email: z.string().email("Valid email required"),
  review: z.string().min(10, "Review must be at least 10 characters"),
  rating: z.number().min(1).max(5),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export function ProductTabs({ product, reviews }: ProductTabsProps) {
  const [localReviews, setLocalReviews] = useState(reviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // State for toggling individual vertical accordion tabs
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    features: true,
    description: true,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const rating = watch("rating");

  const onSubmitReview = async (data: ReviewFormData) => {
    setSubmitting(true);
    try {
      const newReview = await createReview({ ...data, product_id: product.id });
      if (newReview) {
        setLocalReviews((prev) => [newReview, ...prev]);
        reset();
        setShowReviewForm(false);
        toast.success("Thank you for your review!");
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to check if a value has meaningful data
  const hasValue = (val: unknown): boolean => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string") return val.trim().length > 0;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "object") return Object.keys(val as object).length > 0;
    return Boolean(val);
  };

  // 1. Features & Benefits
  const featuresContent = useMemo(() => {
    const raw = product.acf?.features_benefits || product.acf?.features;
    if (hasValue(raw)) return raw;
    return [
      "Broad-spectrum SPF 50+ UV protection",
      "Formulated with 3 essential ceramides (1, 3, 6-II)",
      "Hydrates and restores skin moisture barrier",
      "Dermatologist recommended & hypoallergenic",
      "Non-comedogenic formula (won't clog pores)",
    ];
  }, [product]);

  // 2. Description
  const descriptionContent = useMemo(() => {
    return product.description && stripHtml(product.description).trim().length > 0
      ? product.description
      : null;
  }, [product]);

  // 3. Specification
  const specificationContent = useMemo(() => {
    const raw = product.acf?.specification;
    if (hasValue(raw)) return raw;
    const specs: Record<string, string> = {};
    if (product.weight) specs["Weight"] = `${product.weight} kg`;
    if (product.dimensions?.length)
      specs["Dimensions"] = `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`;
    if (product.sku) specs["SKU"] = product.sku;
    if (product.acf?.brand) specs["Brand"] = String(product.acf.brand);
    return Object.keys(specs).length > 0 ? specs : null;
  }, [product]);

  // 4. Ingredient
  const ingredientContent = useMemo(() => {
    return product.acf?.ingredients && String(product.acf.ingredients).trim().length > 0
      ? String(product.acf.ingredients)
      : null;
  }, [product]);

  // 5. Included Makeup Brushes
  const brushesContent = useMemo(() => {
    const raw = product.acf?.included_makeup_brushes || product.acf?.included_brushes;
    return hasValue(raw) ? raw : null;
  }, [product]);

  // 6. How To Use
  const howToUseContent = useMemo(() => {
    return product.acf?.how_to_use && String(product.acf.how_to_use).trim().length > 0
      ? String(product.acf.how_to_use)
      : null;
  }, [product]);

  // 7. Safety
  const safetyContent = useMemo(() => {
    const raw = product.acf?.safety || product.acf?.warnings;
    return hasValue(raw) ? String(raw) : null;
  }, [product]);

  // 8. FAQs
  const faqsContent = useMemo(() => {
    const raw = product.acf?.faqs;
    return hasValue(raw) ? (raw as Array<{ question: string; answer: string }>) : null;
  }, [product]);

  // 9. Shipping & Returns
  const shippingContent = useMemo(() => {
    const raw = product.acf?.shipping_returns;
    if (hasValue(raw)) return String(raw);
    return "Standard UAE delivery within 1-3 business days. Same-day delivery available in Dubai for orders placed before 2 PM. Free shipping on orders over AED 99. 30-day hassle-free returns on unused unopened items.";
  }, [product]);

  // All potential tabs definition
  const rawTabs = [
    {
      id: "features",
      title: "Features and Benefits",
      icon: CheckCircle2,
      content: featuresContent,
      render: () => (
        <div className="space-y-3 pt-2">
          {Array.isArray(featuresContent) ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featuresContent.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-green-50/60 p-3.5 rounded-xl border border-green-100/80">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6F40] mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="prose prose-sm max-w-none text-gray-700">{String(featuresContent)}</div>
          )}
        </div>
      ),
    },
    {
      id: "description",
      title: "Description",
      icon: FileText,
      content: descriptionContent,
      render: () => (
        <div
          className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-[#2E6F40] prose-img:rounded-xl text-sm leading-relaxed pt-2"
          dangerouslySetInnerHTML={{ __html: descriptionContent as string }}
        />
      ),
    },
    {
      id: "specification",
      title: "Specification",
      icon: Sliders,
      content: specificationContent,
      render: () => (
        <div className="overflow-x-auto pt-2">
          {typeof specificationContent === "object" && specificationContent !== null ? (
            <table className="w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
              <tbody>
                {Object.entries(specificationContent as Record<string, string>).map(([key, val], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? "bg-gray-50/70" : "bg-white"}>
                    <td className="px-4 py-3 font-semibold text-gray-700 w-1/3 border-b border-gray-100">{key}</td>
                    <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="prose prose-sm text-gray-700">{String(specificationContent)}</div>
          )}
        </div>
      ),
    },
    {
      id: "ingredient",
      title: "Ingredient",
      icon: Sparkles,
      content: ingredientContent,
      render: () => (
        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100 text-sm text-gray-700 leading-relaxed pt-2">
          {ingredientContent as string}
        </div>
      ),
    },
    {
      id: "brushes",
      title: "Included Makeup Brushes",
      icon: Layers,
      content: brushesContent,
      render: () => (
        <div className="space-y-2 text-sm text-gray-700 pt-2">
          {Array.isArray(brushesContent) ? (
            <ul className="list-disc list-inside space-y-1">
              {brushesContent.map((b: string, idx: number) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          ) : (
            <p>{String(brushesContent)}</p>
          )}
        </div>
      ),
    },
    {
      id: "how_to_use",
      title: "How To Use",
      icon: HelpCircle,
      content: howToUseContent,
      render: () => (
        <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 text-sm text-gray-700 leading-relaxed pt-2">
          {howToUseContent as string}
        </div>
      ),
    },
    {
      id: "safety",
      title: "Safety & Warnings",
      icon: ShieldAlert,
      content: safetyContent,
      render: () => (
        <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 text-sm text-rose-900 leading-relaxed pt-2">
          {safetyContent as string}
        </div>
      ),
    },
    {
      id: "faqs",
      title: "FAQs",
      icon: FaqIcon,
      content: faqsContent,
      render: () => (
        <div className="space-y-3 pt-2">
          {(faqsContent as Array<{ question: string; answer: string }>).map((faq, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/60">
              <p className="font-bold text-gray-900 text-sm mb-1">Q: {faq.question}</p>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      icon: Truck,
      content: shippingContent,
      render: () => (
        <div className="text-sm text-gray-700 leading-relaxed space-y-2 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 pt-2">
          <p>{shippingContent as string}</p>
        </div>
      ),
    },
    {
      id: "reviews",
      title: `Customer Reviews (${localReviews.length})`,
      icon: MessageSquare,
      content: product.reviews_allowed || localReviews.length > 0 ? true : null,
      render: () => (
        <div className="space-y-6 pt-2">
          {/* Summary */}
          {localReviews.length > 0 && (
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50/80 border border-gray-100">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-gray-900">
                  {parseFloat(product.average_rating).toFixed(1)}
                </p>
                <StarRating rating={parseFloat(product.average_rating)} size="md" />
                <p className="text-sm text-gray-500 mt-1">{localReviews.length} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = localReviews.filter((r) => r.rating === star).length;
                  const pct = localReviews.length > 0 ? (count / localReviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-gray-500">{star}</span>
                      <StarIcon className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-gray-400 w-5">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Write review toggle */}
          {product.reviews_allowed && (
            <div>
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Write a Review
                </button>
              ) : (
                <form onSubmit={handleSubmit(onSubmitReview)} className="card p-6 space-y-4">
                  <h3 className="font-bold text-gray-900">Write a Review</h3>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Rating</label>
                    <RatingInput value={rating} onChange={(v) => setValue("rating", v)} />
                    {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name</label>
                      <input {...register("reviewer")} className="input" placeholder="Your name" />
                      {errors.reviewer && <p className="text-xs text-red-500 mt-1">{errors.reviewer.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                      <input {...register("reviewer_email")} type="email" className="input" placeholder="your@email.com" />
                      {errors.reviewer_email && <p className="text-xs text-red-500 mt-1">{errors.reviewer_email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Review</label>
                    <textarea
                      {...register("review")}
                      rows={4}
                      className="input resize-none"
                      placeholder="Share your experience…"
                    />
                    {errors.review && <p className="text-xs text-red-500 mt-1">{errors.review.message}</p>}
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" disabled={submitting} className="btn-primary">
                      {submitting ? "Submitting…" : "Submit Review"}
                    </button>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="btn-ghost">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Review list */}
          {localReviews.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {localReviews.map((review) => (
                <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#2E6F40]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-gray-900">{review.reviewer}</p>
                        <p className="text-xs text-gray-400">{formatDate(review.date_created)}</p>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">{stripHtml(review.review)}</p>
                    {review.verified && (
                      <span className="mt-2 inline-flex items-center text-xs text-emerald-600 gap-1">
                        ✓ Verified purchase
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  // DYNAMIC RULE: Filter out any tab whose content is null, empty string, or empty array!
  const activeTabs = useMemo(() => {
    return rawTabs.filter((t) => hasValue(t.content));
  }, [rawTabs]);

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (activeTabs.length === 0) return null;

  return (
    <div className="mb-12 space-y-3.5" id="reviews">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Product Details & Information</h2>

      {/* ── Vertical Collapsible Accordion Tabs (All Screen Sizes) ── */}
      {activeTabs.map((tab) => {
        const isOpen = Boolean(openAccordions[tab.id]);
        const IconComp = tab.icon;

        return (
          <div
            key={tab.id}
            className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs transition-all duration-200"
          >
            {/* Accordion Header Row with Title + Icon + Dropdown Chevron */}
            <button
              onClick={() => toggleAccordion(tab.id)}
              className={`w-full px-5 py-4 flex items-center justify-between font-bold text-base transition-colors ${
                isOpen
                  ? "bg-green-50/60 text-[#2E6F40] border-b border-green-100"
                  : "bg-white text-gray-800 hover:bg-gray-50/80"
              }`}
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isOpen ? "bg-[#2E6F40] text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <span>{tab.title}</span>
              </span>

              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[#2E6F40]" : "text-gray-400"
                }`}
              />
            </button>

            {/* Collapsible Content Area */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-5 bg-white">{tab.render()}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
