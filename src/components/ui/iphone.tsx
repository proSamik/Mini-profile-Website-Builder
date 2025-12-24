import React from 'react';

interface IphoneProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  children?: React.ReactNode;
}

export function Iphone({ src, children, className, ...props }: IphoneProps) {
  return (
    <div
      className={`relative mx-auto border-[14px] bg-muted border-border rounded-[3rem] shadow-xl w-[375px] h-[812px] ${className || ''}`}
      {...props}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-card border border-border rounded-b-3xl z-10" />

      {/* Speaker */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-muted-foreground/30 rounded-full z-20 mt-2" />

      {/* Screen */}
      <div className="relative w-full h-full bg-background rounded-[2.25rem] overflow-hidden border border-border">
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
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-muted-foreground/40 rounded-full" />
    </div>
  );
}
