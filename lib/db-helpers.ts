import { createServerSupabaseClient } from './supabase/supabase-server'
import { z } from 'zod'

export interface User {
    id: string
    email: string
    created_at: string
    updated_at: string
}

export interface Category {
    id: string
    user_id: string
    name: string
    color: string
    icon?: string
    description?: string
    created_at: string
    updated_at: string
}

export interface Expense {
    id: string
    user_id: string
    title: string
    description?: string
    amount: number
    date: string
    category_id: string
    created_at: string
    updated_at: string
}

export type ExpenseWithRelations = Expense & {
    category: Category
}

export type CategoryWithStats = Category & {
    _count: { expenses: number }
    totalAmount: number
}

// Validation schemas
export const expenseSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).optional(),
    amount: z.number().positive('Amount must be positive').max(999999.99),
    date: z.date().max(new Date(), 'Date cannot be in the future'),
    category_id: z.string().uuid('Invalid category'),
})

export const categorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(30),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color'),
    icon: z.string().optional(),
    description: z.string().max(100).optional(),
})

export type ExpenseFormData = z.infer<typeof expenseSchema>
export type CategoryFormData = z.infer<typeof categorySchema>

// Database helper functions
export async function createUser(userData: { id: string; email: string }) {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getExpensesWithRelations(userId: string, limit = 50) {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('expenses')
        .select(`
      *,
      category:categories(*)
    `)
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit)

    if (error) throw error
    return data as ExpenseWithRelations[]
}

export async function getCategoriesWithStats(userId: string) {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .rpc('get_categories_with_stats', { user_id: userId })

    if (error) throw error
    return data as CategoryWithStats[]
}

export async function getMonthlyExpenseSummary(userId: string, year: number, month: number) {
    const supabase = await createServerSupabaseClient()

    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('expenses')
        .select(`
      *,
      category:categories(name, color)
    `)
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })

    if (error) throw error
    return data
}

export async function createExpense(expenseData: {
    title: string
    description?: string
    amount: number
    date: string
    category_id: string
    user_id: string
}) {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('expenses')
        .insert(expenseData)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getCategories(userId: string) {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name')

    if (error) throw error
    return data as Category[]
}

export async function createCategory(categoryData: {
    name: string
    color: string
    icon?: string
    description?: string
    user_id: string
}) {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function ensureUserExists(userId: string, email: string) {
    const supabase = await createServerSupabaseClient()

    // Check if user exists in our users table
    const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single()

    if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
    }

    // If user doesn't exist, create them
    if (!existingUser) {
        try {
            await createUser({
                id: userId,
                email: email || ''
            })
        } catch (error) {
            console.error('Error creating user record:', error)
            // Don't throw here if user creation fails, as they might already exist
            // due to race conditions
        }
    }
}
