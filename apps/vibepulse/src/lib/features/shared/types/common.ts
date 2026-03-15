export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }

export interface Pagination {
  page: number
  perPage: number
  total: number
}

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  status: Status
  data: T | null
  error: string | null
}
