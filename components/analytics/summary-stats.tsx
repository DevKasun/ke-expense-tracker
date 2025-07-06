'use client';

import { useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	TrendingUp,
	TrendingDown,
	DollarSign,
	CreditCard,
	Calendar,
	Target,
} from 'lucide-react';

interface SummaryData {
	currentMonth: {
		total: number;
		count: number;
	};
	previousMonth: {
		total: number;
		count: number;
	};
	totalSpent: number;
	totalTransactions: number;
	monthlyChange: number;
}

export function SummaryStats() {
	const [data, setData] = useState<SummaryData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchSummaryData();
	}, []);

	const fetchSummaryData = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({ type: 'summary' });
			const response = await fetch(`/api/analytics?${params}`);
			if (response.ok) {
				const summaryData = await response.json();
				setData(summaryData);
			}
		} catch (error) {
			console.error('Error fetching summary data:', error);
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

	const formatPercentage = (percentage: number) => {
		return `${Math.abs(percentage).toFixed(1)}%`;
	};

	const getCurrentMonthName = () => {
		return new Date().toLocaleDateString('en-US', { month: 'long' });
	};

	if (loading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className='pb-2'>
							<div className='h-4 bg-muted animate-pulse rounded' />
						</CardHeader>
						<CardContent>
							<div className='h-8 bg-muted animate-pulse rounded mb-2' />
							<div className='h-3 bg-muted animate-pulse rounded w-2/3' />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!data) {
		return (
			<div className='text-center py-8'>
				<p className='text-muted-foreground'>No data available</p>
			</div>
		);
	}

	const averagePerTransaction =
		data.currentMonth.count > 0
			? data.currentMonth.total / data.currentMonth.count
			: 0;

	const stats = [
		{
			title: `${getCurrentMonthName()} Spending`,
			value: formatCurrency(data.currentMonth.total),
			description: `${data.currentMonth.count} transaction${
				data.currentMonth.count !== 1 ? 's' : ''
			}`,
			icon: DollarSign,
			trend: data.monthlyChange,
			trendLabel: data.monthlyChange >= 0 ? 'increase' : 'decrease',
		},
		{
			title: 'Total Spent',
			value: formatCurrency(data.totalSpent),
			description: `${data.totalTransactions} total transactions`,
			icon: CreditCard,
		},
		{
			title: 'Average per Transaction',
			value: formatCurrency(averagePerTransaction),
			description: `This month average`,
			icon: Target,
		},
		{
			title: 'Last Month',
			value: formatCurrency(data.previousMonth.total),
			description: `${data.previousMonth.count} transaction${
				data.previousMonth.count !== 1 ? 's' : ''
			}`,
			icon: Calendar,
		},
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
			{stats.map((stat, index) => (
				<Card key={index}>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							{stat.title}
						</CardTitle>
						<stat.icon className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stat.value}</div>
						<div className='flex items-center space-x-2'>
							<p className='text-xs text-muted-foreground'>
								{stat.description}
							</p>
							{stat.trend !== undefined && (
								<div className='flex items-center space-x-1'>
									{stat.trend >= 0 ? (
										<TrendingUp className='h-3 w-3 text-green-500' />
									) : (
										<TrendingDown className='h-3 w-3 text-red-500' />
									)}
									<span
										className={`text-xs font-medium ${
											stat.trend >= 0
												? 'text-green-500'
												: 'text-red-500'
										}`}
									>
										{formatPercentage(stat.trend)}{' '}
										{stat.trendLabel}
									</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
