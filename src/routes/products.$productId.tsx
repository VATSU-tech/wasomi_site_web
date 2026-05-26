import { createFileRoute } from '@tanstack/react-router';
import { useProductDetailQuery } from '@/features/products/hooks';

export const Route = createFileRoute('/products/$productId')({ component: ProductDetail });
function ProductDetail() {
  const { productId } = Route.useParams();
  const query = useProductDetailQuery(Number(productId));
  if (query.isLoading) return <p className='p-6'>Chargement...</p>;
  if (!query.data) return <p className='p-6'>Produit introuvable</p>;
  return <div className='container mx-auto p-6'><h1 className='text-3xl font-bold'>{query.data.name}</h1><p className='mt-2'>{query.data.description}</p><p className='mt-4 font-semibold'>{query.data.price}</p></div>;
}
