import { queryKeys } from '@/constants/query-keys';
import { productService, ProductQueryParams } from '@/services/product.service';
import { useQuery } from '@tanstack/react-query';

export const useProductsQuery = (params: ProductQueryParams) => useQuery({ queryKey: queryKeys.products.list(params), queryFn: ()=>productService.list(params) });
export const useProductDetailQuery = (id:number) => useQuery({ queryKey: queryKeys.products.detail(id), queryFn: ()=>productService.detail(id), enabled: Number.isFinite(id) });
