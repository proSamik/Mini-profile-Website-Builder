import React from 'react';

interface IphoneProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  children?: React.ReactNode;
}

export function Iphone({ src, children, className, ...props }: IphoneProps) {
  return (
    <div
      className={`relative mx-auto border-[10px] bg-muted border-border rounded-[2.5rem] shadow-xl w-[300px] h-[650px] ${className || ''}`}
      {...props}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-card border border-border rounded-b-2xl z-10" />

      {/* Speaker */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-muted-foreground/30 rounded-full z-20 mt-1.5" />

      {/* Screen */}
      <div className="relative w-full h-full bg-background rounded-[1.75rem] overflow-hidden border border-border">
        {src ? (
          <iframe
            src={src}
            className="w-full h-full border-0"
            title="iPhone Preview"
          />
        ) : (
          <div className="w-full h-full overflow-y-auto">
            {children}
          </div>
        )}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-muted-foreground/40 rounded-full" />
    </div>
  );
}
