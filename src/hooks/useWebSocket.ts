import { useEffect, useCallback, useState } from 'react';
import { websocketService } from '@/services/websocket';
import { WebSocketMessage, WebSocketState } from '@/types/websocket';

export const useWebSocket = (url: string) => {
    const [state, setState] = useState<WebSocketState>({
        isConnected: false,
        lastMessage: null,
        error: null,
    });

    const sendMessage = useCallback((message: WebSocketMessage) => {
        websocketService.send(message);
    }, []);

    useEffect(() => {
        websocketService.connect(url);

        websocketService.subscribe({
            onConnect: () => {
                setState(prev => ({ ...prev, isConnected: true, error: null }));
            },
            onDisconnect: () => {
                setState(prev => ({ ...prev, isConnected: false }));
            },
            onError: (error) => {
                setState(prev => ({ ...prev, error }));
            },
            onMessage: (message) => {
                setState(prev => ({ ...prev, lastMessage: message }));
            },
        });

        return () => {
            websocketService.unsubscribe();
            websocketService.disconnect();
        };
    }, [url]);

    return {
        ...state,
        sendMessage,
    };
}; 