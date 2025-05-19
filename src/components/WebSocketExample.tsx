import React, { useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export const WebSocketExample: React.FC = () => {
    const { isConnected, lastMessage, error, sendMessage } = useWebSocket('/api/socket');

    useEffect(() => {
        // Example of sending a message
        if (isConnected) {
            sendMessage({
                type: 'greeting',
                payload: { text: 'Hello from client!' },
                timestamp: Date.now(),
            });
        }
    }, [isConnected, sendMessage]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold">WebSocket Status</h2>
                <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
                {error && <p className="text-red-500">Error: {error.message}</p>}
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold">Last Message</h3>
                {lastMessage ? (
                    <pre className="bg-gray-100 p-2 rounded">
                        {JSON.stringify(lastMessage, null, 2)}
                    </pre>
                ) : (
                    <p>No messages received yet</p>
                )}
            </div>

            <button
                onClick={() => {
                    sendMessage({
                        type: 'button_click',
                        payload: { action: 'clicked' },
                        timestamp: Date.now(),
                    });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Send Test Message
            </button>
        </div>
    );
}; 