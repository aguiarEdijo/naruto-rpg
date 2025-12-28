import React from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
    variant?: 'default' | 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className = '',
    variant = 'default'
}) => {
    const getTabClasses = (tabId: string) => {
        const baseClasses = 'px-4 sm:px-6 py-3 text-sm font-medium transition-colors';

        switch (variant) {
            case 'pills':
                return `${baseClasses} rounded-lg ${activeTab === tabId
                        ? 'bg-primary text-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`;
            case 'underline':
                return `${baseClasses} border-b-2 ${activeTab === tabId
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`;
            default:
                return `${baseClasses} border-b-2 ${activeTab === tabId
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`;
        }
    };

    const getContainerClasses = () => {
        switch (variant) {
            case 'pills':
                return 'flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg';
            case 'underline':
                return 'flex space-x-8 border-b border-gray-200';
            default:
                return 'flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 border-b border-gray-200';
        }
    };

    return (
        <div className={`${getContainerClasses()} ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={getTabClasses(tab.id)}
                >
                    {tab.icon && <span className="mr-2">{tab.icon}</span>}
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

interface TabPanelProps {
    children: React.ReactNode;
    className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
};

interface TabContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const TabContainer: React.FC<TabContainerProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`bg-surface rounded-lg shadow-md ${className}`}>
            {children}
        </div>
    );
};
