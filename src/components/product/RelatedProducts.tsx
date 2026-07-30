import { getCachedRelatedProducts } from "@/lib/cache";
import { ProductCard } from "@/components/ui/ProductCard";

interface RelatedProductsProps {
  productId: number;
  categoryId?: number;
}

export async function RelatedProducts({ productId, categoryId }: RelatedProductsProps) {
  const products = await getCachedRelatedProducts(productId, categoryId, 4);

  if (!products.length) return null;

  return (
    <section className="mt-4">
      <h2 className="section-heading mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
