'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/supabase';
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

interface Category {
	id: string;
	name: string;
	color: string;
	icon?: string;
}

interface AddExpenseDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AddExpenseDrawer({
	open,
	onOpenChange,
}: AddExpenseDrawerProps) {
	const { user } = useAuth();
	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState('');
	const [description, setDescription] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [categoriesLoading, setCategoriesLoading] = useState(true);

	// New category creation states
	const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [newCategoryColor, setNewCategoryColor] = useState('#4ECDC4');
	const [newCategoryIcon, setNewCategoryIcon] = useState('');
	const [creatingCategory, setCreatingCategory] = useState(false);

	const supabase = createClient();

	// Predefined color options
	const colorOptions = [
		'#FF6B6B',
		'#4ECDC4',
		'#45B7D1',
		'#96CEB4',
		'#FFEAA7',
		'#DDA0DD',
		'#95A5A6',
		'#FF8C42',
		'#6C5CE7',
		'#FD79A8',
		'#00B894',
		'#FDCB6E',
	];

	// Common emoji options for categories
	const iconOptions = [
		'🍽️',
		'🚗',
		'🛍️',
		'🎬',
		'💡',
		'🏥',
		'📝',
		'💰',
		'🏠',
		'✈️',
		'🎓',
		'💼',
		'🎮',
		'📱',
		'👕',
		'⛽',
	];

	useEffect(() => {
		if (open && user) {
			fetchCategories();
		}
	}, [open, user]);

	const fetchCategories = async () => {
		try {
			setCategoriesLoading(true);
			const { data, error } = await supabase
				.from('categories')
				.select('id, name, color, icon')
				.eq('user_id', user?.id)
				.order('name');

			if (error) throw error;
			setCategories(data || []);
		} catch (err) {
			console.error('Error fetching categories:', err);
			setError('Failed to load categories');
		} finally {
			setCategoriesLoading(false);
		}
	};

	const handleCreateCategory = async () => {
		if (!newCategoryName.trim() || !user) return;

		setCreatingCategory(true);
		setError('');

		try {
			const response = await fetch('/api/categories', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: newCategoryName.trim(),
					color: newCategoryColor,
					icon: newCategoryIcon,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create category');
			}

			const newCategory = await response.json();

			// Add to categories list and select it
			setCategories((prev) =>
				[...prev, newCategory].sort((a, b) =>
					a.name.localeCompare(b.name)
				)
			);
			setCategoryId(newCategory.id);

			// Reset form
			setNewCategoryName('');
			setNewCategoryColor('#4ECDC4');
			setNewCategoryIcon('');
			setShowNewCategoryForm(false);
		} catch (err) {
			console.error('Error creating category:', err);
			setError(
				err instanceof Error ? err.message : 'Failed to create category'
			);
		} finally {
			setCreatingCategory(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		setLoading(true);
		setError('');

		try {
			const response = await fetch('/api/expenses', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					description: description || undefined,
					amount,
					date,
					category_id: categoryId,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create expense');
			}

			setTitle('');
			setAmount('');
			setDescription('');
			setCategoryId('');
			setDate(new Date().toISOString().split('T')[0]);
			onOpenChange(false);
		} catch (err) {
			console.error('Error creating expense:', err);
			setError(
				err instanceof Error ? err.message : 'Failed to create expense'
			);
		} finally {
			setLoading(false);
		}
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
					{error && (
						<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm'>
							{error}
						</div>
					)}

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
								disabled={loading}
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
								disabled={loading}
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
								disabled={loading}
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
								value={categoryId}
								onChange={(e) => {
									if (e.target.value === 'CREATE_NEW') {
										setShowNewCategoryForm(true);
									} else {
										setCategoryId(e.target.value);
									}
								}}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								required
								disabled={loading || categoriesLoading}
							>
								<option value=''>
									{categoriesLoading
										? 'Loading...'
										: 'Select a category'}
								</option>
								{categories.map((category) => (
									<option
										key={category.id}
										value={category.id}
									>
										{category.icon} {category.name}
									</option>
								))}
								<option
									value='CREATE_NEW'
									className='font-semibold text-blue-600'
								>
									+ Create New Category
								</option>
							</select>

							{/* Inline Category Creation Form */}
							{showNewCategoryForm && (
								<div className='mt-4 p-4 bg-gray-50 rounded-lg border'>
									<h4 className='font-medium text-gray-900 mb-3'>
										Create New Category
									</h4>

									<div className='space-y-3'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Name
											</label>
											<input
												type='text'
												value={newCategoryName}
												onChange={(e) =>
													setNewCategoryName(
														e.target.value
													)
												}
												className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
												placeholder='Category name'
												disabled={creatingCategory}
											/>
										</div>

										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Color
											</label>
											<div className='flex flex-wrap gap-2'>
												{colorOptions.map((color) => (
													<button
														key={color}
														type='button'
														onClick={() =>
															setNewCategoryColor(
																color
															)
														}
														className={`w-6 h-6 rounded-full border-2 ${
															newCategoryColor ===
															color
																? 'border-gray-900'
																: 'border-gray-300'
														}`}
														style={{
															backgroundColor:
																color,
														}}
														disabled={
															creatingCategory
														}
													/>
												))}
											</div>
										</div>

										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Icon (optional)
											</label>
											<div className='flex flex-wrap gap-2'>
												{iconOptions.map((icon) => (
													<button
														key={icon}
														type='button'
														onClick={() =>
															setNewCategoryIcon(
																icon
															)
														}
														className={`p-2 text-lg border rounded ${
															newCategoryIcon ===
															icon
																? 'border-blue-500 bg-blue-50'
																: 'border-gray-300 hover:border-gray-400'
														}`}
														disabled={
															creatingCategory
														}
													>
														{icon}
													</button>
												))}
											</div>
										</div>

										<div className='flex gap-2 pt-2'>
											<Button
												type='button'
												size='sm'
												onClick={handleCreateCategory}
												disabled={
													!newCategoryName.trim() ||
													creatingCategory
												}
											>
												{creatingCategory
													? 'Creating...'
													: 'Create'}
											</Button>
											<Button
												type='button'
												variant='outline'
												size='sm'
												onClick={() => {
													setShowNewCategoryForm(
														false
													);
													setNewCategoryName('');
													setNewCategoryColor(
														'#4ECDC4'
													);
													setNewCategoryIcon('');
												}}
												disabled={creatingCategory}
											>
												Cancel
											</Button>
										</div>
									</div>
								</div>
							)}
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
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								required
								disabled={loading}
							/>
						</div>
					</form>
				</DrawerBody>

				<DrawerFooter>
					<Button
						variant='outline'
						onClick={() => onOpenChange(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						type='submit'
						onClick={handleSubmit}
						disabled={loading || !categoryId}
					>
						{loading ? 'Adding...' : 'Add Expense'}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
