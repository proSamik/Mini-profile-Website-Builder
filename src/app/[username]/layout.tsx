import { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 overflow-y-auto">
      {children}
    </div>
  );
}
