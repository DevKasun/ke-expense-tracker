'use client';

import { useState } from 'react';
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
	DrawerBody,
	DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

interface AddExpenseDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AddExpenseDrawer({
	open,
	onOpenChange,
}: AddExpenseDrawerProps) {
	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log({ title, amount, description, category });
		setTitle('');
		setAmount('');
		setDescription('');
		setCategory('');
		onOpenChange(false);
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerOverlay />
			<DrawerContent side='right' size='md'>
				<DrawerHeader>
					<DrawerTitle>Add New Expense</DrawerTitle>
					<DrawerClose />
				</DrawerHeader>

				<DrawerBody>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label
								htmlFor='title'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Title
							</label>
							<input
								type='text'
								id='title'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='Expense title'
								required
							/>
						</div>

						<div>
							<label
								htmlFor='amount'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Amount
							</label>
							<input
								type='number'
								id='amount'
								step='0.01'
								min='0'
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='0.00'
								required
							/>
						</div>

						<div>
							<label
								htmlFor='description'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Description
							</label>
							<input
								type='text'
								id='description'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='What did you spend on?'
								required
							/>
						</div>

						<div>
							<label
								htmlFor='category'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Category
							</label>
							<select
								id='category'
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								required
							>
								<option value=''>Select a category</option>
								<option value='food'>Food & Dining</option>
								<option value='transportation'>
									Transportation
								</option>
								<option value='shopping'>Shopping</option>
								<option value='entertainment'>
									Entertainment
								</option>
								<option value='bills'>Bills & Utilities</option>
								<option value='healthcare'>Healthcare</option>
								<option value='other'>Other</option>
							</select>
						</div>

						<div>
							<label
								htmlFor='date'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Date
							</label>
							<input
								type='date'
								id='date'
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								defaultValue={
									new Date().toISOString().split('T')[0]
								}
								required
							/>
						</div>
					</form>
				</DrawerBody>

				<DrawerFooter>
					<Button
						variant='outline'
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						type='submit'
						form='expense-form'
						onClick={handleSubmit}
					>
						Add Expense
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
