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
	const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
	const [currentMonthCount, setCurrentMonthCount] = useState(0);
	const [recentExpenses, setRecentExpenses] = useState<ExpenseWithCategory[]>(
		[]
	);
	const [loading, setLoading] = useState(true);

	const fetchCurrentMonthData = async () => {
		try {
			const now = new Date();
			const year = now.getFullYear();
			const month = now.getMonth() + 1;

			const response = await fetch(
				`/api/expenses?year=${year}&month=${month}`
			);

			if (response.ok) {
				const expenses = await response.json();
				const total = expenses.reduce(
					(sum: number, expense: any) => sum + expense.amount,
					0
				);
				setCurrentMonthTotal(total);
				setCurrentMonthCount(expenses.length);
				// Get the 5 most recent expenses
				setRecentExpenses(expenses.slice(0, 5));
			}
		} catch (error) {
			console.error('Error fetching current month data:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			fetchCurrentMonthData();
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

	const getCurrentMonthName = () => {
		return new Date().toLocaleDateString('en-US', { month: 'long' });
	};

	return (
		<div className='max-w-6xl mx-auto space-y-6'>
			<div>
				<h2 className='text-3xl font-bold text-gray-900'>
					Welcome back
					{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
				</h2>
				<p className='text-gray-600 mt-2'>
					Here's your expense tracking overview
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<Card className='p-6'>
					<h3 className='text-lg font-semibold mb-2'>
						Quick Actions
					</h3>
					<div className='space-y-3'>
						<Button
							className='w-full'
							onClick={() => setIsAddExpenseOpen(true)}
						>
							Add Expense
						</Button>
						<Button asChild variant='outline' className='w-full'>
							<Link href='/dashboard/expenses'>
								View Expenses
							</Link>
						</Button>
					</div>
				</Card>

				<Card className='p-6'>
					<h3 className='text-lg font-semibold mb-2'>
						{getCurrentMonthName()} Summary
					</h3>
					<div className='space-y-2'>
						<div className='flex justify-between'>
							<span className='text-gray-600'>Total Spent:</span>
							<span className='font-semibold'>
								{loading
									? '...'
									: formatCurrency(currentMonthTotal)}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-gray-600'>Transactions:</span>
							<span className='font-semibold'>
								{loading ? '...' : currentMonthCount}
							</span>
						</div>
					</div>
				</Card>

				<Card className='p-6'>
					<h3 className='text-lg font-semibold mb-2'>Account</h3>
					<div className='space-y-3'>
						<Button asChild variant='outline' className='w-full'>
							<Link href='/dashboard/profile'>View Profile</Link>
						</Button>
						<Button asChild variant='outline' className='w-full'>
							<Link href='/dashboard/settings'>Settings</Link>
						</Button>
					</div>
				</Card>
			</div>

			{/* Recent Expenses Table */}
			<Card>
				<div className='p-6'>
					<h3 className='text-lg font-semibold mb-4'>
						Recent {getCurrentMonthName()} Expenses
					</h3>
					{loading ? (
						<div className='space-y-4'>
							<div className='h-4 bg-gray-200 rounded animate-pulse' />
							<div className='h-4 bg-gray-200 rounded animate-pulse w-3/4' />
							<div className='h-4 bg-gray-200 rounded animate-pulse w-1/2' />
						</div>
					) : recentExpenses.length === 0 ? (
						<div className='text-center py-8'>
							<p className='text-gray-500 text-lg'>
								No expenses this month
							</p>
							<p className='text-gray-400 text-sm mt-2'>
								Start by adding your first expense
							</p>
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
								<TableRow>
									<TableCell
										colSpan={4}
										className='text-center py-4'
									>
										<Button
											asChild
											variant='outline'
											size='sm'
										>
											<Link href='/dashboard/expenses'>
												View All Expenses →
											</Link>
										</Button>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					)}
				</div>
			</Card>

			<AddExpenseDrawer
				open={isAddExpenseOpen}
				onOpenChange={setIsAddExpenseOpen}
				onExpenseAdded={fetchCurrentMonthData}
			/>
		</div>
	);
}
