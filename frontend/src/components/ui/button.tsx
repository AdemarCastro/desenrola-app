import React from 'react';
import { cn } from '@/lib/utils';

const variantStyles = {
  default: 'bg-black text-white hover:bg-neutral-800',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-zinc-300 bg-transparent hover:bg-zinc-100',
  secondary: 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300',
  ghost: 'hover:bg-zinc-100',
  link: 'text-black underline-offset-4 hover:underline',
  white: 'bg-white text-black border border-zinc-300 hover:bg-zinc-100',
};

const sizeStyles = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

export interface ButtonVariantProps {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

export function buttonVariants({ variant = 'default', size = 'default' }: ButtonVariantProps) {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer";

  return cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size]
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };