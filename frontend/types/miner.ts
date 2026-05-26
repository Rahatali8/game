export interface Product {
  id: number
  name: string
  price: number
  old_price: number | null
  daily_income: number
  total_income: number
  period_days: number
  quantity_limit: number
  image_url: string | null
  country: string
  is_premium_miner: boolean
  offer_tag: string | null
  card_color: string | null
  is_active: boolean
  sort_order: number
}

export interface UserMiner {
  id: number
  user_id: number
  product_id: number
  product_name: string
  image_url: string | null
  purchase_price: number
  daily_income: number
  total_income: number
  period_days: number
  days_claimed: number
  remaining_days: number
  last_claim_at: string | null
  started_at: string
  expires_at: string
  status: 'active' | 'expired'
  can_claim: boolean
  remaining_cooldown: number
}

export interface ClaimHistory {
  id: number
  miner_id: number
  amount: number
  claimed_at: string
}
