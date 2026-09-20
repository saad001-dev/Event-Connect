import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { SendConnectionDto, RespondConnectionDto } from './dto/connection.dto';

@Controller('api/v1/connections')
export class ConnectionsController {
  constructor(private connectionsService: ConnectionsService) {}

  @Get()
  async getConnections(@Request() req: any) {
    const userId = req.user?.id || 'temp-user-id';
    return this.connectionsService.getConnections(userId);
  }

  @Get('pending')
  async getPendingRequests(@Request() req: any) {
    const userId = req.user?.id || 'temp-user-id';
    return this.connectionsService.getPendingRequests(userId);
  }

  @Post()
  async sendRequest(@Request() req: any, @Body() dto: SendConnectionDto) {
    const userId = req.user?.id || 'temp-user-id';
    return this.connectionsService.sendConnectionRequest(userId, dto.toUserId, dto.eventId, dto.message);
  }

  @Put(':id/accept')
  async acceptRequest(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.id || 'temp-user-id';
    return this.connectionsService.acceptConnectionRequest(id, userId);
  }

  @Put(':id/decline')
  async declineRequest(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.id || 'temp-user-id';
    return this.connectionsService.declineConnectionRequest(id, userId);
  }
}