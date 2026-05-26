import { createFileRoute, Link } from '@tanstack/react-router';
import { useProductsQuery } from '@/features/products/hooks';

export const Route = createFileRoute('/products')({ component: ProductsPage });
function ProductsPage() {
  const products = useProductsQuery({ page:1, limit:20 });
  return <div className='container mx-auto px-4 py-8'><h1 className='text-3xl font-bold mb-4'>Produits</h1>{products.isLoading?<p>Chargement...</p>:<div className='grid md:grid-cols-3 gap-4'>{products.data?.data.map((p)=><Link to='/products/$productId' params={{productId:String(p.id)}} key={p.id} className='border rounded p-4'><h3 className='font-semibold'>{p.name}</h3><p>{p.price}</p></Link>)}</div>}</div>;
}
