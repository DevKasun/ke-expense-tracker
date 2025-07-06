'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface TrendData {
    date: string
    amount: number
    count: number
}

interface SpendingTrendsChartProps {
    days?: number
}

export function SpendingTrendsChart({ days = 30 }: SpendingTrendsChartProps) {
    const [data, setData] = useState<TrendData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTrendData()
    }, [days])

    const fetchTrendData = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({ 
                type: 'trends',
                days: days.toString()
            })

            const response = await fetch(`/api/analytics?${params}`)
            if (response.ok) {
                const trendData = await response.json()
                setData(trendData)
            }
        } catch (error) {
            console.error('Error fetching trend data:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    }

    const chartConfig = {
        amount: {
            label: 'Amount',
            color: 'hsl(var(--chart-1))',
        },
    }

    const chartData = data.map(item => ({
        date: formatDate(item.date),
        amount: item.amount,
        count: item.count,
        fullDate: item.date
    }))

    const totalSpent = data.reduce((sum, item) => sum + item.amount, 0)
    const averageDaily = data.length > 0 ? totalSpent / data.length : 0
    const maxDaily = Math.max(...data.map(item => item.amount))

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Spending Trends</CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] animate-pulse bg-muted rounded" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>
                    Daily spending over the last {days} days
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-lg font-semibold">{formatCurrency(totalSpent)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Daily Average</p>
                            <p className="text-lg font-semibold">{formatCurrency(averageDaily)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Highest Day</p>
                            <p className="text-lg font-semibold">{formatCurrency(maxDaily)}</p>
                        </div>
                    </div>
                    
                    <ChartContainer config={chartConfig} className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis 
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <ChartTooltip 
                                    content={
                                        <ChartTooltipContent 
                                            formatter={(value: any, name: string) => [
                                                formatCurrency(value),
                                                'Amount'
                                            ]}
                                            labelFormatter={(label: string, payload: any) => {
                                                if (payload && payload.length > 0) {
                                                    const item = payload[0].payload
                                                    return `${new Date(item.fullDate).toLocaleDateString('en-US', { 
                                                        weekday: 'long', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })} - ${item.count} transaction${item.count !== 1 ? 's' : ''}`
                                                }
                                                return label
                                            }}
                                        />
                                    } 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="var(--color-amount)" 
                                    strokeWidth={2}
                                    dot={{ fill: "var(--color-amount)", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: "var(--color-amount)", strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
} 