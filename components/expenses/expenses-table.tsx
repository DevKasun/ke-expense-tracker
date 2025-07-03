'use client';

import { ExpenseWithRelations } from '@/lib/db-helpers';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface ExpensesTableProps {
	expenses: ExpenseWithRelations[];
	loading?: boolean;
}

export function ExpensesTable({ expenses, loading }: ExpensesTableProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	if (loading) {
		return (
			<Card className='p-6'>
				<div className='space-y-4'>
					<div className='h-4 bg-gray-200 rounded animate-pulse' />
					<div className='h-4 bg-gray-200 rounded animate-pulse w-3/4' />
					<div className='h-4 bg-gray-200 rounded animate-pulse w-1/2' />
				</div>
			</Card>
		);
	}

	if (expenses.length === 0) {
		return (
			<Card className='p-6'>
				<div className='text-center py-8'>
					<p className='text-gray-500 text-lg'>No expenses found</p>
					<p className='text-gray-400 text-sm mt-2'>
						Start by adding your first expense
					</p>
				</div>
			</Card>
		);
	}

	return (
		<Card>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Description</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{expenses.map((expense) => (
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
												expense.category.color,
										}}
									/>
									<span className='flex items-center gap-1'>
										{expense.category.icon && (
											<span>{expense.category.icon}</span>
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
							<TableCell className='text-gray-600'>
								{expense.description || '-'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
}
