import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-gradient-primary text-white hover:shadow-glow-purple hover:scale-105 font-semibold',
      secondary: 'bg-gradient-secondary text-white hover:shadow-glow-pink hover:scale-105 font-semibold',
      danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-105 font-semibold',
      outline: 'glass border-2 border-primary/30 text-foreground hover:border-primary hover:shadow-glow-purple hover:scale-105',
      ghost: 'bg-transparent text-foreground hover:glass hover:scale-105',
      gradient: 'bg-gradient-accent text-white hover:shadow-glow-blue hover:scale-105 font-semibold',
      glass: 'glass-card text-foreground hover:shadow-glow-purple hover:scale-105 font-semibold',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg',
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
