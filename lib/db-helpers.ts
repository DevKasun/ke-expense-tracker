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

export async function getCategoryAnalytics(userId: string, year?: number, month?: number) {
    const supabase = await createServerSupabaseClient()

    let query = supabase
        .from('expenses')
        .select(`
            amount,
            category:categories(name, color, icon)
        `)
        .eq('user_id', userId)

    if (year && month) {
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
        const endDate = new Date(year, month, 0).toISOString().split('T')[0]
        query = query.gte('date', startDate).lte('date', endDate)
    }

    const { data, error } = await query

    if (error) throw error

    // Group by category and sum amounts
    const categoryTotals = (data || []).reduce((acc: any, expense: any) => {
        const categoryName = expense.category.name
        if (!acc[categoryName]) {
            acc[categoryName] = {
                name: categoryName,
                color: expense.category.color,
                icon: expense.category.icon,
                amount: 0,
                count: 0
            }
        }
        acc[categoryName].amount += expense.amount
        acc[categoryName].count += 1
        return acc
    }, {})

    return Object.values(categoryTotals)
}

export async function getSpendingTrends(userId: string, days: number = 30) {
    const supabase = await createServerSupabaseClient()

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from('expenses')
        .select('amount, date')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true })

    if (error) throw error

    // Group by date and sum amounts
    const dailyTotals = (data || []).reduce((acc: any, expense: any) => {
        const date = expense.date
        if (!acc[date]) {
            acc[date] = { date, amount: 0, count: 0 }
        }
        acc[date].amount += expense.amount
        acc[date].count += 1
        return acc
    }, {})

    return Object.values(dailyTotals)
}

export async function getMonthlyComparison(userId: string, months: number = 6) {
    const supabase = await createServerSupabaseClient()

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const { data, error } = await supabase
        .from('expenses')
        .select('amount, date')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true })

    if (error) throw error

    // Group by month and sum amounts
    const monthlyTotals = (data || []).reduce((acc: any, expense: any) => {
        const date = new Date(expense.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

        if (!acc[monthKey]) {
            acc[monthKey] = { month: monthName, amount: 0, count: 0 }
        }
        acc[monthKey].amount += expense.amount
        acc[monthKey].count += 1
        return acc
    }, {})

    return Object.values(monthlyTotals)
}

export async function getExpenseSummary(userId: string) {
    const supabase = await createServerSupabaseClient()

    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    // Current month
    const currentMonthStart = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`
    const currentMonthEnd = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0]

    // Previous month
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear
    const prevMonthStart = `${prevYear}-${prevMonth.toString().padStart(2, '0')}-01`
    const prevMonthEnd = new Date(prevYear, prevMonth, 0).toISOString().split('T')[0]

    const [currentMonthData, prevMonthData, totalData] = await Promise.all([
        supabase
            .from('expenses')
            .select('amount')
            .eq('user_id', userId)
            .gte('date', currentMonthStart)
            .lte('date', currentMonthEnd),
        supabase
            .from('expenses')
            .select('amount')
            .eq('user_id', userId)
            .gte('date', prevMonthStart)
            .lte('date', prevMonthEnd),
        supabase
            .from('expenses')
            .select('amount')
            .eq('user_id', userId)
    ])

    const currentMonthTotal = currentMonthData.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0
    const prevMonthTotal = prevMonthData.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0
    const totalSpent = totalData.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0

    const monthlyChange = prevMonthTotal === 0 ? 0 : ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100

    return {
        currentMonth: {
            total: currentMonthTotal,
            count: currentMonthData.data?.length || 0
        },
        previousMonth: {
            total: prevMonthTotal,
            count: prevMonthData.data?.length || 0
        },
        totalSpent,
        totalTransactions: totalData.data?.length || 0,
        monthlyChange
    }
}
