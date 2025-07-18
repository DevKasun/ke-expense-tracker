'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAME } from '@/constant';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, loading, signOut } = useAuth();
	const pathname = usePathname();

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

	const navigationItems = [
		{
			name: 'Dashboard',
			href: '/dashboard',
			icon: (
				<svg
					className='w-5 h-5'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M8 5a2 2 0 012-2h4a2 2 0 012 2v14l-5-3-5 3V5z'
					/>
				</svg>
			),
		},
		{
			name: 'Expenses',
			href: '/dashboard/expenses',
			icon: (
				<svg
					className='w-5 h-5'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
					/>
				</svg>
			),
		},
		{
			name: 'Profile',
			href: '/dashboard/profile',
			icon: (
				<svg
					className='w-5 h-5'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
					/>
				</svg>
			),
		},
	];

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Sidebar */}
			<div className='fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col'>
				{/* Sidebar Header */}
				<div className='p-6 border-b border-gray-200'>
					<h1 className='text-xl font-bold text-gray-900'>
						{APP_NAME}
					</h1>
				</div>

				{/* Navigation */}
				<nav className='flex-1 p-4'>
					<ul className='space-y-2'>
						{navigationItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<li key={item.name}>
									<Link
										href={item.href}
										className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
											isActive
												? 'bg-blue-50 text-blue-700 border border-blue-200'
												: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
										}`}
									>
										<span
											className={
												isActive
													? 'text-blue-700'
													: 'text-gray-400'
											}
										>
											{item.icon}
										</span>
										<span>{item.name}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* User Info & Sign Out */}
				<div className='p-4 border-t border-gray-200'>
					<div className='flex items-center space-x-3 mb-3'>
						<div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
							<span className='text-blue-600 text-sm font-medium'>
								{user.email?.charAt(0).toUpperCase()}
							</span>
						</div>
						<div className='flex-1 min-w-0'>
							<p className='text-sm font-medium text-gray-900 truncate'>
								{user.email?.split('@')[0]}
							</p>
							<p className='text-xs text-gray-500 truncate'>
								{user.email}
							</p>
						</div>
					</div>
					<Button
						onClick={signOut}
						variant='outline'
						size='sm'
						className='w-full'
					>
						<svg
							className='w-4 h-4 mr-2'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
							/>
						</svg>
						Sign Out
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className='ml-64 flex-1 flex flex-col min-w-0'>
				<main className='flex-1 p-8'>{children}</main>
			</div>
		</div>
	);
}
