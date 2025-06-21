import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { DollarSign, BarChart3, Building2, Menu } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	return (
		<div className='flex flex-col min-h-screen'>
			<header className='border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex h-16 items-center justify-between'>
						<div className='flex items-center'>
							<span className='ml-2 text-xl font-bold text-gray-900'>
								KeExpense Tracker
							</span>
						</div>

						<nav className='hidden md:flex items-center space-x-8'>
							<Link
								href='#features'
								className='text-gray-600 hover:text-gray-900 transition-colors'
							>
								Features
							</Link>
							<Link
								href='#pricing'
								className='text-gray-600 hover:text-gray-900 transition-colors'
							>
								Pricing
							</Link>
						</nav>

						<div className='flex items-center space-x-4'>
							<Button
								variant='ghost'
								className='hidden sm:inline-flex cursor-pointer'
							>
								Sign In
							</Button>
							<Button className='cursor-pointer'>
								Get Started
							</Button>
							<Button
								variant='ghost'
								size='icon'
								className='md:hidden cursor-pointer'
							>
								<Menu className='h-5 w-5' />
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className='flex-1'>
				<section className='py-20 sm:py-32 bg-gradient-to-b from-gray-50 to-white'>
					<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center max-w-4xl mx-auto'>
							<h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6'>
								Track Your Expenses{' '}
								<span className='text-gray-900'>
									Effortlessly
								</span>
							</h1>
							<p className='text-xl text-gray-600 mb-10 max-w-2xl mx-auto'>
								Take control of your finances with our simple
								expense tracker. Monitor spending, set budgets,
								and achieve your financial goals.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<Button size='lg' className='text-lg px-8 py-3'>
									Get Started Free
								</Button>
								<Button
									variant='outline'
									size='lg'
									className='text-lg px-8 py-3'
								>
									View Demo
								</Button>
							</div>
						</div>
					</div>
				</section>

				<section id='features' className='py-20 bg-white'>
					<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center mb-16'>
							<h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
								Everything you need to manage your money
							</h2>
							<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
								Powerful features designed to make expense
								tracking simple and effective
							</p>
						</div>

						<div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
							<Card className='text-center border-2 hover:border-gray-200 transition-colors'>
								<CardHeader>
									<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
										<DollarSign className='h-8 w-8 text-gray-900' />
									</div>
									<CardTitle className='text-xl font-semibold'>
										Easy Tracking
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-gray-600'>
										Add expenses in seconds with our
										intuitive interface. Categorize
										transactions and never lose track of
										your spending.
									</CardDescription>
								</CardContent>
							</Card>

							<Card className='text-center border-2 hover:border-gray-200 transition-colors'>
								<CardHeader>
									<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
										<BarChart3 className='h-8 w-8 text-gray-900' />
									</div>
									<CardTitle className='text-xl font-semibold'>
										Smart Analytics
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-gray-600'>
										Get insights into your spending patterns
										with detailed reports and visualizations
										that help you make better financial
										decisions.
									</CardDescription>
								</CardContent>
							</Card>

							<Card className='text-center border-2 hover:border-gray-200 transition-colors'>
								<CardHeader>
									<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
										<Building2 className='h-8 w-8 text-gray-900' />
									</div>
									<CardTitle className='text-xl font-semibold'>
										Multi Account
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-gray-600'>
										Connect multiple bank accounts and
										credit cards. Get a complete view of
										your finances in one place.
									</CardDescription>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section className='py-20 bg-gray-900'>
					<div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
						<h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
							Ready to take control of your finances?
						</h2>
						<p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
							Join thousands of users who have already transformed
							their financial habits
						</p>
						<Button
							size='lg'
							variant='secondary'
							className='text-lg px-8 py-3'
						>
							Start Your Free Trial
						</Button>
					</div>
				</section>
			</main>

			<footer className='bg-gray-900 text-white py-12'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid md:grid-cols-4 gap-8'>
						<div className='col-span-2'>
							<div className='flex items-center mb-4'>
								<span className='ml-2 text-xl font-bold'>
									KeExpense Tracker
								</span>
							</div>
							<p className='text-gray-400 max-w-md'>
								The simple and powerful way to track your
								expenses and take control of your financial
								future.
							</p>
						</div>
						<div>
							<h3 className='font-semibold mb-4'>Product</h3>
							<ul className='space-y-2 text-gray-400'>
								<li>
									<Link
										href='#'
										className='hover:text-white transition-colors'
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										href='#'
										className='hover:text-white transition-colors'
									>
										Pricing
									</Link>
								</li>
								<li>
									<Link
										href='#'
										className='hover:text-white transition-colors'
									>
										Security
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className='font-semibold mb-4'>Company</h3>
							<ul className='space-y-2 text-gray-400'>
								<li>
									<Link
										href='#'
										className='hover:text-white transition-colors'
									>
										About
									</Link>
								</li>
								<li>
									<Link
										href='#'
										className='hover:text-white transition-colors'
									>
										Team
									</Link>
								</li>
								<li>
									<Link
										href='#'
										className='hover:text-white transition-colors'
									>
										Careers
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className='font-semibold mb-4'>Legal</h3>
							<ul className='space-y-2 text-gray-400'>
								<li>
									<Link
										href='#'
										className='hover:text-white transition-colors'
									>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										href='#'
										className='hover:text-white transition-colors'
									>
										Terms of Service
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className='mt-8 pt-8 border-t border-gray-800 text-center text-gray-500'>
						© 2024 KeExpense Tracker. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
