'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
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
} from '@/components/ui/chart';

interface CategoryData {
	name: string;
	amount: number;
	color: string;
	icon?: string;
	count: number;
}

interface CategoryChartProps {
	year?: number;
	month?: number;
}

export function CategoryChart({ year, month }: CategoryChartProps) {
	const [data, setData] = useState<CategoryData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCategoryData();
	}, [year, month]);

	const fetchCategoryData = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({ type: 'categories' });
			if (year) params.append('year', year.toString());
			if (month) params.append('month', month.toString());

			const response = await fetch(`/api/analytics?${params}`);
			if (response.ok) {
				const categoryData = await response.json();
				setData(categoryData);
			}
		} catch (error) {
			console.error('Error fetching category data:', error);
		} finally {
			setLoading(false);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const chartConfig = data.reduce((config, item, index) => {
		config[item.name] = {
			label: item.name,
			color: item.color,
		};
		return config;
	}, {} as any);

	const chartData = data.map((item) => ({
		category: item.name,
		amount: item.amount,
		fill: item.color,
		icon: item.icon,
		count: item.count,
	}));

	const total = data.reduce((sum, item) => sum + item.amount, 0);

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Category Breakdown</CardTitle>
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
				<CardTitle>Category Breakdown</CardTitle>
				<CardDescription>
					{year && month
						? `Spending by category for ${new Date(
								year,
								month - 1
						  ).toLocaleDateString('en-US', {
								month: 'long',
								year: 'numeric',
						  })}`
						: 'Total spending by category'}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col lg:flex-row gap-6'>
					<div className='flex-1'>
						<ChartContainer
							config={chartConfig}
							className='h-[300px]'
						>
							<ResponsiveContainer width='100%' height='100%'>
								<PieChart>
									<Pie
										data={chartData}
										cx='50%'
										cy='50%'
										innerRadius={60}
										outerRadius={120}
										paddingAngle={2}
										dataKey='amount'
										nameKey='category'
									>
										{chartData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.fill}
											/>
										))}
									</Pie>
									<ChartTooltip
										content={
											<ChartTooltipContent
												formatter={(value: any) =>
													formatCurrency(value)
												}
											/>
										}
									/>
								</PieChart>
							</ResponsiveContainer>
						</ChartContainer>
					</div>

					<div className='lg:w-64'>
						<div className='space-y-3'>
							<div className='text-center'>
								<p className='text-sm text-muted-foreground'>
									Total Spent
								</p>
								<p className='text-2xl font-bold'>
									{formatCurrency(total)}
								</p>
							</div>
							<div className='space-y-2'>
								{data.map((item) => (
									<div
										key={item.name}
										className='flex items-center justify-between text-sm'
									>
										<div className='flex items-center gap-2'>
											<div
												className='w-3 h-3 rounded-full'
												style={{
													backgroundColor: item.color,
												}}
											/>
											<span className='flex items-center gap-1'>
												{item.icon && (
													<span>{item.icon}</span>
												)}
												{item.name}
											</span>
										</div>
										<div className='text-right'>
											<p className='font-medium'>
												{formatCurrency(item.amount)}
											</p>
											<p className='text-xs text-muted-foreground'>
												{item.count} transaction
												{item.count !== 1 ? 's' : ''}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
