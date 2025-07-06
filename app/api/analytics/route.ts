import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/supabase-server'
import {
    getCategoryAnalytics,
    getSpendingTrends,
    getMonthlyComparison,
    getExpenseSummary
} from '@/lib/db-helpers'

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
        const type = searchParams.get('type')
        const year = searchParams.get('year')
        const month = searchParams.get('month')
        const days = searchParams.get('days')
        const months = searchParams.get('months')

        switch (type) {
            case 'categories':
                const categoryData = await getCategoryAnalytics(
                    user.id,
                    year ? parseInt(year) : undefined,
                    month ? parseInt(month) : undefined
                )
                return NextResponse.json(categoryData)

            case 'trends':
                const trendData = await getSpendingTrends(
                    user.id,
                    days ? parseInt(days) : 30
                )
                return NextResponse.json(trendData)

            case 'monthly':
                const monthlyData = await getMonthlyComparison(
                    user.id,
                    months ? parseInt(months) : 6
                )
                return NextResponse.json(monthlyData)

            case 'summary':
                const summaryData = await getExpenseSummary(user.id)
                return NextResponse.json(summaryData)

            default:
                return NextResponse.json(
                    { error: 'Invalid analytics type' },
                    { status: 400 }
                )
        }
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 