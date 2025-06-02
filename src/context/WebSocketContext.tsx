import React, { createContext, useContext } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { WebSocketMessage } from '@/types/websocket';

interface WebSocketContextType {
    isConnected: boolean;
    lastMessage: WebSocketMessage | null;
    sendMessage: (message: WebSocketMessage) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const { isConnected, lastMessage, sendMessage } = useWebSocket('https://52e6-202-87-221-237.ngrok-free.app');

    return (
        <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocketContext() {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider');
    }
    return context;
} 