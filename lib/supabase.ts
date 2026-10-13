import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  email: string
  full_name?: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status: string
  subscription_price_id?: string
  subscription_current_period_end?: string
  created_at: string
  updated_at: string
}

export type Email = {
  id: string
  user_id: string
  from_email: string
  subject: string
  body: string
  parsed_content?: any
  status: string
  processed_at?: string
  created_at: string
}

export type Task = {
  id: string
  user_id: string
  email_id?: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'completed' | 'archived'
  due_date?: string
  tags?: string[]
  metadata?: any
  created_at: string
  updated_at: string
}

export type EmailForwardingAddress = {
  id: string
  user_id: string
  address: string
  is_active: boolean
  created_at: string
}

// Helper functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as Profile
}

export async function getTasks(userId: string, filters?: {
  status?: string
  priority?: string
  limit?: number
}) {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  
  if (filters?.priority) {
    query = query.eq('priority', filters.priority)
  }
  
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data as Task[]
}

export async function createTask(userId: string, taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      user_id: userId,
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Task
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()
  
  if (error) throw error
  return data as Task
}

export async function getEmailForwardingAddress(userId: string) {
  const { data, error } = await supabase
    .from('email_forwarding_addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
  return data as EmailForwardingAddress | null
}

export async function createEmailForwardingAddress(userId: string, address: string) {
  const { data, error } = await supabase
    .from('email_forwarding_addresses')
    .insert({
      user_id: userId,
      address,
      is_active: true,
    })
    .select()
    .single()
  
  if (error) throw error
  return data as EmailForwardingAddress
}
