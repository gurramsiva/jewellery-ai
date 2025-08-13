import ProductsPage from "@/modules/products/page";
import { Suspense } from "react";

export default function Products() {
  return (
    <Suspense fallback={null}>
      <ProductsPage />
    </Suspense>
  );
}
