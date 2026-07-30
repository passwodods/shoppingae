import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const BADGES = [
  {
    id: "delivery",
    title: "Free Delivery",
    subtitle: "On orders over AED 99",
    color: "text-[#2E6F40] bg-green-50",
  },
  {
    id: "authentic",
    title: "100% Authentic",
    subtitle: "All products verified",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "returns",
    title: "Easy Returns",
    subtitle: "30-day hassle-free returns",
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: "support",
    title: "24/7 Support",
    subtitle: "We're always here for you",
    color: "text-purple-600 bg-purple-50",
  },
];

function BadgeIcon({ id, className }: { id: string; className: string }) {
  if (id === "delivery")  return <Truck className={className} />;
  if (id === "authentic") return <Shield className={className} />;
  if (id === "returns")   return <RotateCcw className={className} />;
  if (id === "support")   return <Headphones className={className} />;
  return null;
}

export function TrustBadges() {
  return (
    <section className="py-8 border-y border-gray-100 bg-white" aria-label="Store benefits">
      <div className="container-shop">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${badge.color}`}>
                <BadgeIcon id={badge.id} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{badge.title}</p>
                <p className="text-xs text-gray-500">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
