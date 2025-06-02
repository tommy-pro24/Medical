import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

interface SocketServer extends NetServer {
    io?: SocketIOServer;
}

type NextApiResponseWithSocket = NextApiResponse & {
    socket: {
        server: SocketServer;
    };
};

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
    if (!res.socket.server.io) {
        const httpServer: SocketServer = res.socket.server;
        const io = new SocketIOServer(httpServer, {
            path: '/api/socket',
            addTrailingSlash: false,
        });

        io.on('connection', (socket) => {
            console.log('Client connected');

            socket.on('message', (message) => {
                // Handle incoming messages
                console.log('Received message:', message);

                // Broadcast the message to all connected clients
                io.emit('message', {
                    ...message,
                    timestamp: Date.now(),
                });
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });

        res.socket.server.io = io;
    }

    res.end();
};

export default ioHandler;