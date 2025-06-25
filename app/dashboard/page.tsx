'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
	const { user } = useAuth();

	return (
		<div className='max-w-4xl mx-auto space-y-6'>
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
						<Button asChild className='w-full'>
							<Link href='/dashboard/expenses/add'>
								Add Expense
							</Link>
						</Button>
						<Button asChild variant='outline' className='w-full'>
							<Link href='/dashboard/expenses'>
								View Expenses
							</Link>
						</Button>
					</div>
				</Card>

				<Card className='p-6'>
					<h3 className='text-lg font-semibold mb-2'>This Month</h3>
					<div className='space-y-2'>
						<div className='flex justify-between'>
							<span className='text-gray-600'>Total Spent:</span>
							<span className='font-semibold'>$0.00</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-gray-600'>Transactions:</span>
							<span className='font-semibold'>0</span>
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
		</div>
	);
}
