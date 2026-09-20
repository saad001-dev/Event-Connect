import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AgendaService } from './agenda.service';

@Controller('api/v1/agenda')
export class AgendaController {
  constructor(private agendaService: AgendaService) {}

  @Get(':eventId')
  async getAgenda(@Request() req: any, @Param('eventId') eventId: string) {
    const userId = req.user?.id || 'temp-user-id';
    return this.agendaService.getUserAgenda(userId, eventId);
  }

  @Post(':eventId/sessions/:sessionId')
  async addToAgenda(@Request() req: any, @Param('eventId') eventId: string, @Param('sessionId') sessionId: string) {
    const userId = req.user?.id || 'temp-user-id';
    return this.agendaService.addToAgenda(userId, eventId, sessionId);
  }

  @Delete(':eventId/sessions/:sessionId')
  async removeFromAgenda(@Request() req: any, @Param('eventId') eventId: string, @Param('sessionId') sessionId: string) {
    const userId = req.user?.id || 'temp-user-id';
    return this.agendaService.removeFromAgenda(userId, eventId, sessionId);
  }

  @Patch(':eventId/sessions/:sessionId/notes')
  async updateNotes(
    @Request() req: any,
    @Param('eventId') eventId: string,
    @Param('sessionId') sessionId: string,
    @Body('notes') notes: string,
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.agendaService.updateAgendaItemNotes(userId, eventId, sessionId, notes);
  }
}