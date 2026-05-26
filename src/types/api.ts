export interface ApiSuccessResponse<T> { success: boolean; message?: string; data: T }
export interface ApiErrorResponse { success: false; message: string; errors?: Record<string,string[]> }
export interface LaravelPaginationLinks { first: string|null; last: string|null; prev: string|null; next: string|null }
export interface LaravelPaginationMeta { current_page:number; from:number|null; last_page:number; path:string; per_page:number; to:number|null; total:number }
export interface LaravelPaginatedResponse<T> { data:T[]; links:LaravelPaginationLinks; meta:LaravelPaginationMeta }
export class ApiError extends Error { constructor(message:string, public status:number, public errors?:Record<string,string[]>) { super(message) }}
