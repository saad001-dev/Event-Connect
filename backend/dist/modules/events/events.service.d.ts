import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        events: any;
        total: any;
        limit: number;
        offset: number;
    }>;
    findBySlug(slug: string): Promise<any>;
    create(data: CreateEventDto): Promise<any>;
    update(id: string, data: UpdateEventDto): Promise<any>;
    getSessions(eventId: string): Promise<any>;
}
