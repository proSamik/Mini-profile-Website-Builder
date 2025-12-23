import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-foreground text-background hover:bg-foreground/90 font-semibold border-2 border-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 border-2 border-secondary',
      danger: 'bg-red-600 text-white hover:bg-red-700 border-2 border-red-600',
      outline: 'border-2 border-transparent bg-transparent text-muted-foreground hover:text-foreground hover:border-border',
      ghost: 'bg-transparent text-foreground hover:bg-accent border-2 border-transparent',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
