export interface Role { id:number; name:string; slug:string }
export interface Permission { id:number; name:string; slug:string }
export interface User { id:number; name:string; email:string; roles:Role[]; permissions:Permission[] }
export interface AuthPayload { token:string; token_type:'Bearer'; user:User }
export interface Category { id:number; name:string; slug:string; description?:string|null; is_active:boolean }
export interface ProductImage { id:number; image_url:string; alt_text?:string|null; is_primary:boolean }
export interface ProductVariant { id:number; product_id:number; name:string; sku:string; price:string|null }
export interface Product { id:number; category_id:number; name:string; slug:string; description?:string|null; price:string; sku:string; is_active:boolean; images?:ProductImage[]; variants?:ProductVariant[] }
export interface CartItem { id:number; product_id:number; quantity:number; price:string; product?:Product }
export interface Cart { id:number; user_id:number; items:CartItem[] }
export interface Order { id:number; user_id:number; order_status_id:number; total:string; items: Array<{id:number; product_id:number; quantity:number; price:string}> }
export interface Payment { payment_id:number; status:'PENDING'|'COMPLETED'|'FAILED'; redirect_url?:string }
