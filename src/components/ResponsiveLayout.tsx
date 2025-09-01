import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
}

export const ResponsiveLayout = ({ 
  children, 
  className,
  maxWidth = '7xl'
}: ResponsiveLayoutProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      "w-full mx-auto",
      "px-2 sm:px-4 md:px-6 lg:px-8",
      "py-4 sm:py-6 md:py-8",
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
};