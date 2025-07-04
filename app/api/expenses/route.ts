import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/supabase-server'
import { expenseSchema, createExpense, ensureUserExists, getExpensesWithRelations, getMonthlyExpenseSummary } from '@/lib/db-helpers'
import { z } from 'zod'

const createExpenseRequestSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).optional(),
    amount: z.string().transform((val) => parseFloat(val)),
    date: z.string().transform((val) => new Date(val)),
    category_id: z.string().uuid('Invalid category'),
}).transform((data) => ({
    ...data,
    amount: data.amount,
    date: data.date.toISOString().split('T')[0],
}))

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const year = searchParams.get('year')
        const month = searchParams.get('month')

        // If year and month are provided, get monthly summary
        if (year && month) {
            const expenses = await getMonthlyExpenseSummary(
                user.id,
                parseInt(year),
                parseInt(month)
            )
            return NextResponse.json(expenses)
        }

        // Otherwise, get all expenses
        const expenses = await getExpensesWithRelations(user.id, limit)
        return NextResponse.json(expenses)
    } catch (error) {
        console.error('Error fetching expenses:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Ensure user exists in our users table
        await ensureUserExists(user.id, user.email || '')

        const body = await request.json()
        const validatedData = createExpenseRequestSchema.parse(body)

        const expenseData = {
            ...validatedData,
            user_id: user.id,
        }

        const expense = await createExpense(expenseData)

        return NextResponse.json(expense, { status: 201 })
    } catch (error) {
        console.error('Error creating expense:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 