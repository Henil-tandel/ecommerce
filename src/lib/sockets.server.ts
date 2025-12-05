import { Server, Socket } from "socket.io";
const orderNamespaces = new Map();

export default function initializeSocket(io: Server) {
    const adminNamespace = io.of('/admin');
    const userNamsespace = io.of('/users');

    adminNamespace.on('connection', (client: Socket) => {
        console.log(`[Socket] Admin connected: ${client.id}`);

        client.on('register', (adminId: string) => {
            client.emit('connection status', {
                status: 'registered',
                userId: adminId,
            });
        });

        client.on('disconnect', () => {
            console.log(`[Socket] Admin disconnected: ${client.id}`);
        });
    });

    userNamsespace.on('connection', (client: Socket) => {
        console.log(`[Socket] User connected: ${client.id}`);

        client.on('register', (userId: string) => {
            client.emit('connection status', {
                status: 'registered',
                userId,
            });
        });

        client.on('disconnect', () => {
            console.log(`[Socket] User disconnected: ${client.id}`);
        });
    });


    io.on('connection', (client: Socket) => {
        console.log(`Client connected:${client.id}`)
        client.on('disconnect', () => {
            console.log(`[Socket] Client disconneted: ${client.id}`)
        })
    });

    io.on('error', (error) => {
        console.log(`Socket.io error: ${error}`);
    });
}