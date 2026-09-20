import { AgendaService } from './agenda.service';
export declare class AgendaController {
    private agendaService;
    constructor(agendaService: AgendaService);
    getAgenda(req: any, eventId: string): Promise<any>;
    addToAgenda(req: any, eventId: string, sessionId: string): Promise<any>;
    removeFromAgenda(req: any, eventId: string, sessionId: string): Promise<any>;
    updateNotes(req: any, eventId: string, sessionId: string, notes: string): Promise<any>;
}
