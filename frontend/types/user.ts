export interface User {
  id: number
  mobile: string
  name: string | null
  referral_code: string
  referred_by: string | null
  is_premium: boolean
  premium_until: string | null
  avatar_url: string | null
  country_code: string
  is_active: boolean
  is_admin: boolean
  created_at: string
  last_login: string | null
}

export interface Wallet {
  user_id: number
  balance: number
  commission_income: number
  total_withdrawn: number
  total_earned: number
  updated_at: string
}

export interface DashboardData {
  wallet: Wallet
  today_mining: number
  yesterday_mining: number
  total_referrals: number
}

export interface LoginHistory {
  id: number
  ip_address: string
  device_type: string
  os_name: string
  browser_name: string
  ip_location: string
  is_current: boolean
  login_time: string
}
