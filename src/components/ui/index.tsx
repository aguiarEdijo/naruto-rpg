import React from 'react';

// Função utilitária para combinar classes CSS
function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Container: React.FC<ContainerProps> = ({
    children,
    className = '',
    size = 'lg',
    padding = 'md'
}) => {
    const sizeClasses = {
        sm: 'max-w-2xl',
        md: 'max-w-4xl',
        lg: 'max-w-6xl',
        xl: 'max-w-7xl',
        full: 'max-w-full'
    };

    const paddingClasses = {
        none: '',
        sm: 'px-4 py-2',
        md: 'px-6 py-4',
        lg: 'px-8 py-6',
        xl: 'px-12 py-8'
    };

    return (
        <div className={cn(
            'mx-auto',
            sizeClasses[size],
            paddingClasses[padding],
            className
        )}>
            {children}
        </div>
    );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    ...props
}) => {
    const variantClasses = {
        default: 'bg-surface border border-default shadow-sm',
        elevated: 'bg-surface shadow-lg',
        outlined: 'bg-surface border-2 border-default'
    };

    const paddingClasses = {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6'
    };

    return (
        <div className={cn(
            'rounded-lg transition-normal',
            variantClasses[variant],
            paddingClasses[padding],
            className
        )}
            {...props}
        >
            {children}
        </div>
    );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    ...props
}) => {
    const variantClasses = {
        primary: 'bg-primary hover:bg-primary/90 text-white border-primary',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300',
        accent: 'bg-accent hover:bg-accent/90 text-white border-accent',
        danger: 'bg-error hover:bg-error/90 text-white border-error',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent'
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            className={cn(
                'font-medium rounded-md border transition-normal focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Carregando...
                </div>
            ) : (
                children
            )}
        </button>
    );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    variant?: 'default' | 'filled';
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    variant = 'default',
    className = '',
    ...props
}) => {
    const variantClasses = {
        default: 'bg-white border border-default focus:border-accent',
        filled: 'bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white'
    };

    return (
        <div className="space-y-1">
            {label && (
                <label className="text-small font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    'w-full px-3 py-2 rounded-md transition-normal focus-ring',
                    variantClasses[variant],
                    error && 'border-error focus:border-error',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-xs text-error">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-xs text-muted">{helperText}</p>
            )}
        </div>
    );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    helperText,
    options = [],
    className = '',
    ...props
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="text-small font-medium text-gray-700">
                    {label}
                </label>
            )}
            <select
                className={cn(
                    'w-full px-3 py-2 bg-white border border-default rounded-md transition-normal focus-ring',
                    error && 'border-error focus:border-error',
                    className
                )}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-xs text-error">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-xs text-muted">{helperText}</p>
            )}
        </div>
    );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="text-small font-medium text-gray-700">
                    {label}
                </label>
            )}
            <textarea
                className={cn(
                    'w-full px-3 py-2 bg-white border border-default rounded-md transition-normal focus-ring resize-none',
                    error && 'border-error focus:border-error',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-xs text-error">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-xs text-muted">{helperText}</p>
            )}
        </div>
    );
};

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) => {
    const variantClasses = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800'
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm'
    };

    return (
        <span className={cn(
            'inline-flex items-center rounded-full font-medium',
            variantClasses[variant],
            sizeClasses[size],
            className
        )}>
            {children}
        </span>
    );
};

// Modal exportado do arquivo separado
export { Modal } from './Modal';

interface GridProps {
    children: React.ReactNode;
    cols?: 1 | 2 | 3 | 4 | 5 | 6;
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Grid: React.FC<GridProps> = ({
    children,
    cols = 1,
    gap = 'md',
    className = ''
}) => {
    const colsClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };

    const gapClasses = {
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6'
    };

    return (
        <div className={cn(
            'grid',
            colsClasses[cols],
            gapClasses[gap],
            className
        )}>
            {children}
        </div>
    );
};

interface FlexProps {
    children: React.ReactNode;
    direction?: 'row' | 'col';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    align?: 'start' | 'center' | 'end' | 'stretch';
    gap?: 'sm' | 'md' | 'lg';
    wrap?: boolean;
    className?: string;
}

export const Flex: React.FC<FlexProps> = ({
    children,
    direction = 'row',
    justify = 'start',
    align = 'start',
    gap = 'md',
    wrap = false,
    className = ''
}) => {
    const directionClasses = {
        row: 'flex-row',
        col: 'flex-col'
    };

    const justifyClasses = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around'
    };

    const alignClasses = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch'
    };

    const gapClasses = {
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6'
    };

    return (
        <div className={cn(
            'flex',
            directionClasses[direction],
            justifyClasses[justify],
            alignClasses[align],
            gapClasses[gap],
            wrap && 'flex-wrap',
            className
        )}>
            {children}
        </div>
    );
};

// Exportar componentes de Tabs
export { Tabs, TabPanel, TabContainer } from './Tabs';

