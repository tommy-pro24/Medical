// context/DataContext.tsx

'use client'; // ✅ Required if using Next.js App Router with client components

import React, { createContext, useContext, ReactNode } from 'react';
import useDataStore from '../services/dataService';

const DataContext = createContext<ReturnType<typeof useDataStore> | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const dataStore = useDataStore();
    return <DataContext.Provider value={dataStore}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
