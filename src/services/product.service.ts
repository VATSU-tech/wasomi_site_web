import { apiClient } from '@/api/client';
import { LaravelPaginatedResponse } from '@/types/api';
import { Category, Product } from '@/types/domain';

export interface ProductQueryParams { page?:number; limit?:number; q?:string; category_id?:number }
const toQuery = (params: ProductQueryParams) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k,v])=>{ if (v !== undefined && v !== null && `${v}` !== '') search.set(k,String(v)); });
  const query = search.toString();
  return query ? `?${query}` : '';
};
export const productService = {
  list: (params: ProductQueryParams) => apiClient.get<LaravelPaginatedResponse<Product>>(`/products${toQuery(params)}`),
  detail: (id:number) => apiClient.get<Product>(`/products/${id}`),
  categories: () => apiClient.get<Category[]>('/categories'),
};
