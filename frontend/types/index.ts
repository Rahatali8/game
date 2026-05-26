export * from './api'
export * from './user'
export * from './miner'
export * from './message'

export interface Commission {
  id: number
  user_id: number
  from_user_id: number
  from_user_name: string
  miner_id: number
  miner_name: string
  level: 1 | 2 | 3
  commission_percent: number
  purchase_amount: number
  commission_amount: number
  created_at: string
}

export interface CommissionTotals {
  total: number
  level1: number
  level2: number
  level3: number
}

export interface TeamStats {
  level1_count: number
  level2_count: number
  level3_count: number
  total: number
  weekly_bonus_tier: string
  weekly_bonus_amount: number
}

export interface Deposit {
  id: number
  user_id: number
  amount: number
  method: string
  txn_id: string | null
  screenshot_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_note: string | null
  created_at: string
  processed_at: string | null
}

export interface Withdrawal {
  id: number
  user_id: number
  amount: number
  fee: number
  net_amount: number
  method: string
  account_details: Record<string, string>
  status: 'pending' | 'approved' | 'rejected'
  admin_note: string | null
  requested_at: string
  processed_at: string | null
}

export interface Notification {
  id: number
  title: string
  body: string
  type: 'info' | 'success' | 'warning' | 'error'
  icon: string | null
  is_read: boolean
  created_at: string
}

export interface Announcement {
  id: number
  title: string
  body: string
  banner_url: string | null
  is_active: boolean
  created_at: string
}
