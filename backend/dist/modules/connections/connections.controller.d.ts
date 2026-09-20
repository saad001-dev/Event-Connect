import { ConnectionsService } from './connections.service';
import { SendConnectionDto } from './dto/connection.dto';
export declare class ConnectionsController {
    private connectionsService;
    constructor(connectionsService: ConnectionsService);
    getConnections(req: any): Promise<any>;
    getPendingRequests(req: any): Promise<any>;
    sendRequest(req: any, dto: SendConnectionDto): Promise<any>;
    acceptRequest(req: any, id: string): Promise<any>;
    declineRequest(req: any, id: string): Promise<any>;
}
