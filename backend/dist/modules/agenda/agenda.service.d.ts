import { PrismaService } from '../../common/prisma/prisma.service';
export declare class AgendaService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserAgenda(userId: string, eventId: string): Promise<any>;
    addToAgenda(userId: string, eventId: string, sessionId: string): Promise<any>;
    removeFromAgenda(userId: string, eventId: string, sessionId: string): Promise<any>;
    updateAgendaItemNotes(userId: string, eventId: string, sessionId: string, notes: string): Promise<any>;
}
