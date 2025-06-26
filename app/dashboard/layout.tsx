'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, loading, signOut } = useAuth();

	useEffect(() => {
		if (!loading && !user) {
			redirect('/login');
		}
	}, [user, loading]);

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-lg'>Loading...</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Dashboard Header */}
			<header className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<h1 className='text-xl font-semibold text-gray-900'>
							Expense Tracker
						</h1>

						<div className='flex items-center space-x-4'>
							<span className='text-sm text-gray-600'>
								{user.email}
							</span>
							<Button
								onClick={signOut}
								variant='outline'
								size='sm'
							>
								Sign Out
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Dashboard Content */}
			<main className='py-8'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					{children}
				</div>
			</main>
		</div>
	);
}
