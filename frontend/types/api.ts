export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error_code?: string
}
