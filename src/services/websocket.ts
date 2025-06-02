import { io, Socket } from 'socket.io-client';
import { WebSocketEventHandlers, WebSocketMessage } from '@/types/websocket';

class WebSocketService {
    private static instance: WebSocketService;
    private socket: Socket | null = null;
    private eventHandlers: WebSocketEventHandlers = {};

    private constructor() { }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    public connect(url: string): void {
        if (this.socket?.connected) return;

        console.log('Attempting to connect to WebSocket:', url);

        this.socket = io(url, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ['websocket', 'polling'],
            secure: true,
            rejectUnauthorized: false
        });

        this.setupEventListeners();
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public subscribe(eventHandlers: WebSocketEventHandlers): void {
        this.eventHandlers = { ...this.eventHandlers, ...eventHandlers };
    }

    public unsubscribe(): void {
        this.eventHandlers = {};
    }

    public send(message: WebSocketMessage): void {
        if (this.socket?.connected) {
            this.socket.emit('message', message);
        } else {
            console.warn('Cannot send message: WebSocket is not connected');
        }
    }

    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('WebSocket connected successfully');
            this.eventHandlers.onConnect?.();
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.eventHandlers.onError?.(error);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
            this.eventHandlers.onDisconnect?.();
        });

        this.socket.on('error', (error: Error) => {
            console.error('WebSocket error:', error);
            this.eventHandlers.onError?.(error);
        });

        this.socket.on('message', (message: WebSocketMessage) => {
            console.log('Received message:', message);
            this.eventHandlers.onMessage?.(message);
        });
    }
}

export const websocketService = WebSocketService.getInstance(); 