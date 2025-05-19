
export interface WebSocketMessage {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
    timestamp: number;
}

export interface WebSocketEventHandlers {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Error) => void;
    onMessage?: (message: WebSocketMessage) => void;
}

export interface WebSocketState {
    isConnected: boolean;
    lastMessage: WebSocketMessage | null;
    error: Error | null;
}

export type WebSocketEventType =
    | 'connect'
    | 'disconnect'
    | 'error'
    | 'message'; 