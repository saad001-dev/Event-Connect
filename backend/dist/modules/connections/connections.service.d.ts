import { PrismaService } from '../../common/prisma/prisma.service';
export declare class ConnectionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getConnections(userId: string, eventId?: string): Promise<any>;
    getPendingRequests(userId: string): Promise<any>;
    sendConnectionRequest(fromUserId: string, toUserId: string, eventId: string, message?: string): Promise<any>;
    acceptConnectionRequest(connectionId: string, userId: string): Promise<any>;
    declineConnectionRequest(connectionId: string, userId: string): Promise<any>;
}
