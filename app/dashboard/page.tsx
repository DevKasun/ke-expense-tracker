'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
	const { user, loading, signOut } = useAuth();

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-lg'>Loading...</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md mx-auto'>
				<Card className='p-6'>
					<h1 className='text-2xl font-bold mb-6 text-center'>
						Dashboard
					</h1>

					{user && (
						<div className='space-y-4'>
							<div>
								<p className='text-sm font-medium text-gray-600'>
									Email:
								</p>
								<p className='text-lg'>{user.email}</p>
							</div>

							<div>
								<p className='text-sm font-medium text-gray-600'>
									User ID:
								</p>
								<p className='text-sm text-gray-500 break-all'>
									{user.id}
								</p>
							</div>

							<div>
								<p className='text-sm font-medium text-gray-600'>
									Account created:
								</p>
								<p className='text-sm text-gray-500'>
									{new Date(
										user.created_at
									).toLocaleDateString()}
								</p>
							</div>

							<Button onClick={signOut} className='w-full mt-6'>
								Sign Out
							</Button>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}
