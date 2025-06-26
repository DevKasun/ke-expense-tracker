'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';

export default function ProfilePage() {
	const { user } = useAuth();

	return (
		<div className='max-w-2xl mx-auto'>
			<Card className='p-6'>
				<h2 className='text-2xl font-bold mb-6'>Profile Information</h2>

				{user && (
					<div className='space-y-6'>
						<div>
							<p className='text-sm font-medium text-gray-600 mb-1'>
								Email Address
							</p>
							<p className='text-lg'>{user.email}</p>
						</div>

						<div>
							<p className='text-sm font-medium text-gray-600 mb-1'>
								User ID
							</p>
							<p className='text-sm text-gray-500 break-all font-mono bg-gray-50 p-2 rounded'>
								{user.id}
							</p>
						</div>

						<div>
							<p className='text-sm font-medium text-gray-600 mb-1'>
								Account Created
							</p>
							<p className='text-sm text-gray-700'>
								{new Date(user.created_at).toLocaleDateString(
									'en-US',
									{
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									}
								)}
							</p>
						</div>

						<div>
							<p className='text-sm font-medium text-gray-600 mb-1'>
								Last Sign In
							</p>
							<p className='text-sm text-gray-700'>
								{user.last_sign_in_at
									? new Date(
											user.last_sign_in_at
									  ).toLocaleDateString('en-US', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
									  })
									: 'N/A'}
							</p>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
