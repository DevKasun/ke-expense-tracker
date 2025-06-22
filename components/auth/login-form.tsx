'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);

	const supabase = createClient();

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		try {
			if (isSignUp) {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
					},
				});
				if (error) throw error;
				setMessage('Check your email for the confirmation link!');
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
				setMessage('Signed in successfully!');
				window.location.href = '/dashboard';
			}
		} catch (error: unknown) {
			setMessage(
				error instanceof Error ? error.message : 'An error occurred'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-md mx-auto p-6'>
			<h2 className='text-2xl font-bold mb-6 text-center'>
				{isSignUp ? 'Sign Up' : 'Sign In'}
			</h2>

			<form onSubmit={handleAuth} className='space-y-4'>
				<div>
					<label
						htmlFor='email'
						className='block text-sm font-medium mb-1'
					>
						Email
					</label>
					<input
						id='email'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>

				<div>
					<label
						htmlFor='password'
						className='block text-sm font-medium mb-1'
					>
						Password
					</label>
					<input
						id='password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={6}
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>

				<Button type='submit' disabled={loading} className='w-full'>
					{loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
				</Button>
			</form>

			<div className='mt-4 text-center'>
				<button
					type='button'
					onClick={() => setIsSignUp(!isSignUp)}
					className='text-blue-600 hover:underline'
				>
					{isSignUp
						? 'Already have an account? Sign In'
						: "Don't have an account? Sign Up"}
				</button>
			</div>

			{message && (
				<div
					className={`mt-4 p-3 rounded-md text-sm ${
						message.includes('successfully') ||
						message.includes('Check your email')
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'
					}`}
				>
					{message}
				</div>
			)}
		</Card>
	);
}
