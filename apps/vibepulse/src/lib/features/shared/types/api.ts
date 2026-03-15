export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}
