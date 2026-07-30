const BRANDS = [
  "Neutrogena", "Cetaphil", "La Roche-Posay", "Nivea",
  "Garnier", "L'Oréal", "Dove", "Pantene", "Head & Shoulders",
  "Colgate", "Oral-B", "Always", "Gillette", "Old Spice",
];

export function BrandsSection() {
  return (
    <section className="py-12 overflow-hidden" aria-label="Featured brands">
      <div className="container-shop mb-8 text-center">
        <h2 className="section-heading">Shop by Brand</h2>
        <p className="section-subheading">Authentic products from world-leading brands</p>
      </div>

      {/* Auto-scrolling brand strip */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div
          className="flex gap-4 overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 64px, black calc(100% - 64px), transparent)" }}
        >
          <div className="flex gap-4 animate-scroll" style={{ width: "max-content" }}>
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div
                key={`${brand}-${i}`}
                className="flex-shrink-0 h-12 px-6 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:border-green-300 hover:text-[#2E6F40] hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
