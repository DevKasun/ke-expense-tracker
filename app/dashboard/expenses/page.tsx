'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ExpenseWithRelations } from '@/lib/db-helpers';
import { ExpensesTable } from '@/components/expenses/expenses-table';
import { Button } from '@/components/ui/button';
import { AddExpenseDrawer } from '@/components/expenses/add-expense-drawer';
import { Card } from '@/components/ui/card';

export default function ExpensesPage() {
	const { user } = useAuth();
	const [expenses, setExpenses] = useState<ExpenseWithRelations[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

	const fetchExpenses = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch('/api/expenses');

			if (!response.ok) {
				throw new Error('Failed to fetch expenses');
			}

			const data = await response.json();
			setExpenses(data);
		} catch (err) {
			console.error('Error fetching expenses:', err);
			setError(
				err instanceof Error ? err.message : 'Failed to fetch expenses'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			fetchExpenses();
		}
	}, [user]);

	const handleExpenseAdded = () => {
		fetchExpenses();
		setIsAddExpenseOpen(false);
	};

	const totalAmount = expenses.reduce(
		(sum, expense) => sum + expense.amount,
		0
	);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	return (
		<div className='max-w-6xl mx-auto space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Expenses
					</h1>
					<p className='text-gray-600 mt-2'>
						View and manage your expense records
					</p>
				</div>
				<Button onClick={() => setIsAddExpenseOpen(true)}>
					Add Expense
				</Button>
			</div>

			{/* Summary Cards */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card className='p-6'>
					<h3 className='text-lg font-semibold mb-2'>
						Total Expenses
					</h3>
					<p className='text-3xl font-bold text-gray-900'>
						{formatCurrency(totalAmount)}
					</p>
				</Card>

				<Card className='p-6'>
					<h3 className='text-lg font-semibold mb-2'>
						Total Transactions
					</h3>
					<p className='text-3xl font-bold text-gray-900'>
						{expenses.length}
					</p>
				</Card>

				<Card className='p-6'>
					<h3 className='text-lg font-semibold mb-2'>
						Average Amount
					</h3>
					<p className='text-3xl font-bold text-gray-900'>
						{expenses.length > 0
							? formatCurrency(totalAmount / expenses.length)
							: '$0.00'}
					</p>
				</Card>
			</div>

			{/* Error State */}
			{error && (
				<Card className='p-6'>
					<div className='text-center'>
						<p className='text-red-600 mb-4'>{error}</p>
						<Button onClick={fetchExpenses} variant='outline'>
							Try Again
						</Button>
					</div>
				</Card>
			)}

			{/* Expenses Table */}
			{!error && (
				<div>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-xl font-semibold'>
							Recent Expenses
						</h2>
						{!loading && expenses.length > 0 && (
							<Button
								onClick={fetchExpenses}
								variant='outline'
								size='sm'
							>
								Refresh
							</Button>
						)}
					</div>
					<ExpensesTable expenses={expenses} loading={loading} />
				</div>
			)}

			<AddExpenseDrawer
				open={isAddExpenseOpen}
				onOpenChange={setIsAddExpenseOpen}
				onExpenseAdded={handleExpenseAdded}
			/>
		</div>
	);
}
