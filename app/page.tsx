'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DollarSign,
	BarChart3,
	Building2,
	Menu,
	Tags,
	TrendingUp,
	Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { APP_NAME } from '@/constant';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

export default function Home() {
	const heroRef = useRef<HTMLDivElement>(null);
	const featuresRef = useRef<HTMLDivElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Hero animations
		if (heroRef.current) {
			gsap.fromTo(
				heroRef.current.querySelector('h1'),
				{ opacity: 0, y: 50 },
				{ opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
			);
			gsap.fromTo(
				heroRef.current.querySelector('p'),
				{ opacity: 0, y: 50 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					delay: 0.2,
					ease: 'power3.out',
				}
			);
			gsap.fromTo(
				heroRef.current.querySelectorAll('button'),
				{ opacity: 0, scale: 0.9 },
				{
					opacity: 1,
					scale: 1,
					duration: 0.8,
					delay: 0.4,
					stagger: 0.2,
					ease: 'back.out(1.7)',
				}
			);
		}

		// Typewriter animation
		if (heroRef.current) {
			const typewriterElem = heroRef.current.querySelector('.typewriter');
			if (typewriterElem) {
				const fullText = 'Track Your Expenses Effortlessly';
				let index = 0;

				const tl = gsap.timeline({ repeat: -1 });

				// Type forward
				tl.to(typewriterElem, {
					duration: fullText.length * 0.05,
					ease: 'none',
					onStart: () => {
						index = 0;
					},
					onUpdate: () => {
						typewriterElem.textContent = fullText.substring(
							0,
							++index
						);
					},
				});

				// Pause
				tl.to({}, { duration: 1 });

				// Type backward (delete)
				tl.to(typewriterElem, {
					duration: fullText.length * 0.05,
					ease: 'none',
					onStart: () => {
						index = fullText.length;
					},
					onUpdate: () => {
						typewriterElem.textContent = fullText.substring(
							0,
							--index
						);
					},
				});

				// Pause before repeat
				tl.to({}, { duration: 1 });
			}
		}

		// Features animations
		if (featuresRef.current) {
			const cards = featuresRef.current.querySelectorAll('.border-2');
			gsap.from(cards, {
				opacity: 0,
				y: 50,
				duration: 0.8,
				stagger: 0.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: featuresRef.current,
					start: 'top 80%',
				},
			});
		}

		// CTA animations
		if (ctaRef.current) {
			gsap.fromTo(
				ctaRef.current.querySelector('h2'),
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: ctaRef.current,
						start: 'top 80%',
					},
				}
			);
			gsap.fromTo(
				ctaRef.current.querySelector('p'),
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					delay: 0.2,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: ctaRef.current,
						start: 'top 80%',
					},
				}
			);
			gsap.fromTo(
				ctaRef.current.querySelector('button'),
				{ opacity: 0, scale: 0.9 },
				{
					opacity: 1,
					scale: 1,
					duration: 0.8,
					delay: 0.4,
					ease: 'back.out(1.7)',
					scrollTrigger: {
						trigger: ctaRef.current,
						start: 'top 80%',
					},
				}
			);
		}

		// Footer animations
		if (footerRef.current) {
			gsap.from(footerRef.current.querySelectorAll('div'), {
				opacity: 0,
				y: 30,
				duration: 0.8,
				stagger: 0.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: footerRef.current,
					start: 'top 90%',
				},
			});
		}

		// Reduced motion handling
		const mediaQuery = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		);
		if (mediaQuery.matches) {
			gsap.globalTimeline.clear();
		}
	}, []);

	return (
		<div className='flex flex-col min-h-screen'>
			<header className='border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex h-16 items-center justify-between'>
						<div className='flex items-center'>
							<span className='ml-2 text-xl font-bold text-gray-900'>
								{APP_NAME}
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
							<Link href='/login'>
								<Button
									variant='ghost'
									className='hidden sm:inline-flex cursor-pointer'
								>
									Sign In
								</Button>
							</Link>
							<Link href='/login'>
								<Button className='cursor-pointer'>
									Get Started
								</Button>
							</Link>
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
				<section
					ref={heroRef}
					className='py-20 sm:py-32 bg-gradient-to-b from-gray-50 to-white'
				>
					<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center max-w-4xl mx-auto'>
							<h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6'>
								<span className='typewriter'></span>
							</h1>
							<p className='text-xl text-gray-600 mb-10 max-w-2xl mx-auto'>
								Take control of your finances with our simple
								expense tracker. Monitor spending, set budgets,
								and achieve your financial goals.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<Link href='/login'>
									<Button
										size='lg'
										className='text-lg px-8 py-3'
									>
										Get Started Free
									</Button>
								</Link>
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

				<section
					id='features'
					ref={featuresRef}
					className='py-20 bg-white'
				>
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

						<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
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
										<Tags className='h-8 w-8 text-gray-900' />
									</div>
									<CardTitle className='text-xl font-semibold'>
										Custom Categories
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-gray-600'>
										Create personalized categories with
										custom colors and icons. Organize your
										expenses exactly how you want them.
									</CardDescription>
								</CardContent>
							</Card>

							<Card className='text-center border-2 hover:border-gray-200 transition-colors'>
								<CardHeader>
									<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
										<TrendingUp className='h-8 w-8 text-gray-900' />
									</div>
									<CardTitle className='text-xl font-semibold'>
										Spending Trends
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-gray-600'>
										Track your spending trends over time
										with interactive charts and monthly
										comparisons to identify patterns.
									</CardDescription>
								</CardContent>
							</Card>

							<Card className='text-center border-2 hover:border-gray-200 transition-colors'>
								<CardHeader>
									<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
										<Calendar className='h-8 w-8 text-gray-900' />
									</div>
									<CardTitle className='text-xl font-semibold'>
										Monthly Views
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-gray-600'>
										Navigate through different months to
										review past expenses and track your
										financial progress over time.
									</CardDescription>
								</CardContent>
							</Card>

							<Card className='text-center border-2 hover:border-gray-200 transition-colors'>
								<CardHeader>
									<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
										<Building2 className='h-8 w-8 text-gray-900' />
									</div>
									<CardTitle className='text-xl font-semibold'>
										Secure & Private
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-gray-600'>
										Your financial data is protected with
										enterprise-grade security. All data is
										encrypted and privately stored.
									</CardDescription>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section ref={ctaRef} className='py-20 bg-gray-900'>
					<div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
						<h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
							Ready to take control of your finances?
						</h2>
						<p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
							Join thousands of users who have already transformed
							their financial habits
						</p>
						<Link href='/login'>
							<Button
								size='lg'
								variant='secondary'
								className='text-lg px-8 py-3'
							>
								Start Your Free Trial
							</Button>
						</Link>
					</div>
				</section>
			</main>

			<footer ref={footerRef} className='bg-gray-900 text-white py-12'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid md:grid-cols-4 gap-8'>
						<div className='col-span-2'>
							<div className='flex items-center mb-4'>
								<span className='ml-2 text-xl font-bold'>
									{APP_NAME}
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
						© 2024 {APP_NAME}. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
