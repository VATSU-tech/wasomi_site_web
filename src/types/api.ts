export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  requestId?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
  meta?: ApiMeta;
}

export class ApiError extends Error {
  public code: string;
  public status: number;
  public fields?: Record<string, string[]>;
  public requestId?: string;

  constructor(
    message: string,
    status: number,
    code = 'UNKNOWN_ERROR',
    fields?: Record<string, string[]>,
    requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
    this.requestId = requestId;
  }
}
