import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-semibold text-foreground mb-2.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-300',
            'bg-input text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:shadow-glow-purple',
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-border',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
