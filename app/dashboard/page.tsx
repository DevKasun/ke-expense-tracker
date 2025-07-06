'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddExpenseDrawer } from '@/components/expenses/add-expense-drawer';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { SummaryStats } from '@/components/analytics/summary-stats';
import { CategoryChart } from '@/components/analytics/category-chart';
import { SpendingTrendsChart } from '@/components/analytics/spending-trends-chart';
import { MonthlyComparisonChart } from '@/components/analytics/monthly-comparison-chart';
import Link from 'next/link';

interface ExpenseWithCategory {
	id: string;
	title: string;
	amount: number;
	date: string;
	description?: string;
	category: {
		name: string;
		color: string;
		icon?: string;
	};
}

export default function DashboardPage() {
	const { user } = useAuth();
	const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
	const [recentExpenses, setRecentExpenses] = useState<ExpenseWithCategory[]>(
		[]
	);
	const [loading, setLoading] = useState(true);

	const fetchRecentExpenses = async () => {
		try {
			const response = await fetch('/api/expenses?limit=5');
			if (response.ok) {
				const expenses = await response.json();
				setRecentExpenses(expenses);
			}
		} catch (error) {
			console.error('Error fetching recent expenses:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			fetchRecentExpenses();
		}
	}, [user]);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
	};

	const handleExpenseAdded = () => {
		fetchRecentExpenses();
		// This will trigger a re-render of all analytics components
		window.location.reload();
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Dashboard
					</h1>
					<p className='text-muted-foreground'>
						Track your expenses and analyze your spending patterns
					</p>
				</div>
				<Button onClick={() => setIsAddExpenseOpen(true)}>
					Add Expense
				</Button>
			</div>

			{/* Summary Stats */}
			<SummaryStats />

			{/* Charts Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<CategoryChart />
				<SpendingTrendsChart />
			</div>

			{/* Monthly Comparison - Full Width */}
			<MonthlyComparisonChart />

			{/* Recent Expenses */}
			<Card>
				<div className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<div>
							<h3 className='text-lg font-semibold'>
								Recent Expenses
							</h3>
							<p className='text-sm text-muted-foreground'>
								Your latest transactions
							</p>
						</div>
						<Button asChild variant='outline' size='sm'>
							<Link href='/dashboard/expenses'>View All</Link>
						</Button>
					</div>

					{loading ? (
						<div className='space-y-3'>
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className='h-12 bg-muted animate-pulse rounded'
								/>
							))}
						</div>
					) : recentExpenses.length === 0 ? (
						<div className='text-center py-8'>
							<p className='text-muted-foreground mb-4'>
								No expenses yet. Add your first expense to get
								started!
							</p>
							<Button onClick={() => setIsAddExpenseOpen(true)}>
								Add Your First Expense
							</Button>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Date</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentExpenses.map((expense) => (
									<TableRow key={expense.id}>
										<TableCell className='font-medium'>
											{expense.title}
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<div
													className='w-3 h-3 rounded-full'
													style={{
														backgroundColor:
															expense.category
																.color,
													}}
												/>
												<span className='flex items-center gap-1'>
													{expense.category.icon && (
														<span>
															{
																expense.category
																	.icon
															}
														</span>
													)}
													{expense.category.name}
												</span>
											</div>
										</TableCell>
										<TableCell className='font-semibold'>
											{formatCurrency(expense.amount)}
										</TableCell>
										<TableCell className='text-gray-600'>
											{formatDate(expense.date)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			</Card>

			<AddExpenseDrawer
				open={isAddExpenseOpen}
				onOpenChange={setIsAddExpenseOpen}
				onExpenseAdded={handleExpenseAdded}
			/>
		</div>
	);
}
