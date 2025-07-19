import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const drawerVariants = cva(
	'fixed inset-y-0 z-50 flex flex-col bg-background shadow-lg transition-transform duration-300 ease-in-out',
	{
		variants: {
			side: {
				left: 'left-0 border-r',
				right: 'right-0 border-l',
			},
			size: {
				sm: 'w-80',
				md: 'w-96',
				lg: 'w-[32rem]',
				xl: 'w-[40rem]',
			},
		},
		defaultVariants: {
			side: 'right',
			size: 'md',
		},
	}
);

interface DrawerContextValue {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextValue | undefined>(
	undefined
);

function useDrawer() {
	const context = React.useContext(DrawerContext);
	if (!context) {
		throw new Error('useDrawer must be used within a DrawerProvider');
	}
	return context;
}

interface DrawerProps {
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function Drawer({ children, open, onOpenChange }: DrawerProps) {
	React.useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onOpenChange(false);
			}
		};

		if (open) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [open, onOpenChange]);

	return (
		<DrawerContext.Provider value={{ open, onOpenChange }}>
			{children}
		</DrawerContext.Provider>
	);
}

type DrawerOverlayProps = React.ComponentProps<'div'>;

function DrawerOverlay({ className, ...props }: DrawerOverlayProps) {
	const { open, onOpenChange } = useDrawer();

	if (!open) return null;

	return (
		<div
			className={cn(
				'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out',
				className
			)}
			onClick={() => onOpenChange(false)}
			{...props}
		/>
	);
}

interface DrawerContentProps
	extends React.ComponentProps<'div'>,
		VariantProps<typeof drawerVariants> {}

function DrawerContent({
	className,
	side,
	size,
	children,
	...props
}: DrawerContentProps) {
	const { open } = useDrawer();

	return (
		<div
			className={cn(
				drawerVariants({ side, size }),
				open
					? 'translate-x-0'
					: side === 'right'
					? 'translate-x-full'
					: '-translate-x-full',
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}

type DrawerHeaderProps = React.ComponentProps<'div'>;

function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
	return (
		<div
			className={cn(
				'flex items-center justify-between border-b px-6 py-4',
				className
			)}
			{...props}
		/>
	);
}

type DrawerTitleProps = React.ComponentProps<'h2'>;

function DrawerTitle({ className, ...props }: DrawerTitleProps) {
	return <h2 className={cn('text-lg font-semibold', className)} {...props} />;
}

type DrawerCloseProps = React.ComponentProps<'button'>;

function DrawerClose({ className, children, ...props }: DrawerCloseProps) {
	const { onOpenChange } = useDrawer();

	return (
		<button
			className={cn(
				'rounded-md p-2 hover:bg-accent transition-colors',
				className
			)}
			onClick={() => onOpenChange(false)}
			{...props}
		>
			{children || (
				<svg
					className='h-4 w-4'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M6 18L18 6M6 6l12 12'
					/>
				</svg>
			)}
		</button>
	);
}

type DrawerBodyProps = React.ComponentProps<'div'>;

function DrawerBody({ className, ...props }: DrawerBodyProps) {
	return (
		<div
			className={cn('flex-1 overflow-y-auto px-6 py-4', className)}
			{...props}
		/>
	);
}

type DrawerFooterProps = React.ComponentProps<'div'>;

function DrawerFooter({ className, ...props }: DrawerFooterProps) {
	return (
		<div
			className={cn(
				'border-t px-6 py-4 flex items-center justify-end gap-3',
				className
			)}
			{...props}
		/>
	);
}

export {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
	DrawerBody,
	DrawerFooter,
	useDrawer,
};
