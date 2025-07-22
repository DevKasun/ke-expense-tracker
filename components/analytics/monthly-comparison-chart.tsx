'use client';

import {
	useEffect,
	useState,
	useCallback,
	forwardRef,
	useImperativeHandle,
} from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
} from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	TooltipPayloadItem,
} from '@/components/ui/chart';

interface MonthlyData {
	month: string;
	amount: number;
	count: number;
}

interface MonthlyComparisonChartProps {
	months?: number;
}

export interface MonthlyComparisonChartRef {
	refresh: () => void;
}

export const MonthlyComparisonChart = forwardRef<
	MonthlyComparisonChartRef,
	MonthlyComparisonChartProps
>(({ months = 6 }, ref) => {
	const [data, setData] = useState<MonthlyData[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchMonthlyData = useCallback(async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({
				type: 'monthly',
				months: months.toString(),
			});

			const response = await fetch(`/api/analytics?${params}`);
			if (response.ok) {
				const monthlyData = await response.json();
				setData(monthlyData);
			}
		} catch (error) {
			console.error('Error fetching monthly data:', error);
		} finally {
			setLoading(false);
		}
	}, [months]);

	useImperativeHandle(ref, () => ({
		refresh: fetchMonthlyData,
	}));

	useEffect(() => {
		fetchMonthlyData();
	}, [fetchMonthlyData]);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const chartConfig = {
		amount: {
			label: 'Amount',
			color: 'hsl(var(--chart-2))',
		},
	};

	const chartData = data.map((item) => ({
		month: item.month,
		amount: item.amount,
		count: item.count,
	}));

	const totalSpent = data.reduce((sum, item) => sum + item.amount, 0);
	const averageMonthly = data.length > 0 ? totalSpent / data.length : 0;
	const highestMonth = data.reduce(
		(max, item) => (item.amount > max.amount ? item : max),
		data[0] || { amount: 0, month: '' }
	);

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Monthly Comparison</CardTitle>
					<CardDescription>Loading...</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='h-[300px] animate-pulse bg-muted rounded' />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Monthly Comparison</CardTitle>
				<CardDescription>
					Monthly spending over the last {months} months
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='grid grid-cols-3 gap-4 text-center'>
						<div>
							<p className='text-sm text-muted-foreground'>
								Total
							</p>
							<p className='text-lg font-semibold'>
								{formatCurrency(totalSpent)}
							</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground'>
								Monthly Average
							</p>
							<p className='text-lg font-semibold'>
								{formatCurrency(averageMonthly)}
							</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground'>
								Highest Month
							</p>
							<p className='text-lg font-semibold'>
								{formatCurrency(highestMonth.amount)}
							</p>
						</div>
					</div>

					<ChartContainer config={chartConfig} className='h-[300px]'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart data={chartData}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis
									dataKey='month'
									tick={{ fontSize: 12 }}
								/>
								<YAxis
									tick={{ fontSize: 12 }}
									tickFormatter={(value) =>
										`$${Number(value)}`
									}
								/>
								<ChartTooltip
									content={
										<ChartTooltipContent
											formatter={(value) => [
												formatCurrency(Number(value)),
												'Amount',
											]}
											labelFormatter={(
												label: string,
												payload: TooltipPayloadItem[]
											) => {
												if (
													payload &&
													payload.length > 0
												) {
													const item = payload[0]
														.payload as {
														count: number;
													};
													return `${label} - ${
														item.count
													} transaction${
														item.count !== 1
															? 's'
															: ''
													}`;
												}
												return label;
											}}
										/>
									}
								/>
								<Bar
									dataKey='amount'
									fill='var(--color-amount)'
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</ChartContainer>
				</div>
			</CardContent>
		</Card>
	);
});

MonthlyComparisonChart.displayName = 'MonthlyComparisonChart';
