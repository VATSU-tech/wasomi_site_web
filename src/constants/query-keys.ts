export const queryKeys = {
  auth: { me: ['auth','me'] as const },
  products: { all: ['products'] as const, list: (params: unknown) => ['products','list',params] as const, detail:(id:number)=>['products','detail',id] as const },
  cart: { current:['cart'] as const },
  orders: { all:['orders'] as const, detail:(id:number)=>['orders',id] as const },
} as const;
