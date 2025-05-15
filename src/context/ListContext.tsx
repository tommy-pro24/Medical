'use client'
import { createContext, useContext, ReactNode, useState } from 'react';

// Types
interface ListItem {
    id: number;
    text: string;
}

interface ListContextType {
    items: ListItem[];
    addItem: (text: string) => void;
}

// Create context
const ListContext = createContext<ListContextType | undefined>(undefined);

// Provider Props type
interface ListProviderProps {
    children: ReactNode;
}

// Custom hook for using the context
export function useList() {
    const context = useContext(ListContext);
    if (context === undefined) {
        throw new Error('useList must be used within a ListProvider');
    }
    return context;
}

// Provider component
export function ListProvider({ children }: ListProviderProps) {
    const [items, setItems] = useState<ListItem[]>([]);

    const addItem = (text: string) => {
        setItems(prev => [...prev, {
            id: Date.now(),
            text: text.trim()
        }]);
    };

    return (
        <ListContext.Provider value={{ items, addItem }}>
            {children}
        </ListContext.Provider>
    );
} 