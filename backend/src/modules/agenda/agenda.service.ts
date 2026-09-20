import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AgendaService {
  constructor(private prisma: PrismaService) {}

  async getUserAgenda(userId: string, eventId: string) {
    const agenda = await this.prisma.agenda.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      include: {
        items: {
          include: {
            session: {
              include: {
                speakers: {
                  include: {
                    speaker: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!agenda) {
      // Return empty agenda
      return {
        id: null,
        userId,
        eventId,
        items: [],
      };
    }

    return agenda;
  }

  async addToAgenda(userId: string, eventId: string, sessionId: string) {
    // Check if session exists and belongs to event
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        eventId,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Get or create agenda
    let agenda = await this.prisma.agenda.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!agenda) {
      agenda = await this.prisma.agenda.create({
        data: {
          userId,
          eventId,
        },
      });
    }

    // Check if already in agenda
    const existingItem = await this.prisma.agendaItem.findUnique({
      where: {
        agendaId_sessionId: {
          agendaId: agenda.id,
          sessionId,
        },
      },
    });

    if (existingItem) {
      throw new ConflictException('Session already in agenda');
    }

    // Check for time conflicts
    const conflicts = await this.prisma.agendaItem.findMany({
      where: {
        agendaId: agenda.id,
        session: {
          startTime: {
            lt: session.endTime,
          },
          endTime: {
            gt: session.startTime,
          },
        },
      },
      include: {
        session: true,
      },
    });

    if (conflicts.length > 0) {
      throw new ConflictException('Time conflict with existing agenda item');
    }

    return this.prisma.agendaItem.create({
      data: {
        agendaId: agenda.id,
        sessionId,
      },
      include: {
        session: {
          include: {
            speakers: {
              include: {
                speaker: true,
              },
            },
          },
        },
      },
    });
  }

  async removeFromAgenda(userId: string, eventId: string, sessionId: string) {
    const agenda = await this.prisma.agenda.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!agenda) {
      throw new NotFoundException('Agenda not found');
    }

    const item = await this.prisma.agendaItem.findUnique({
      where: {
        agendaId_sessionId: {
          agendaId: agenda.id,
          sessionId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Session not in agenda');
    }

    return this.prisma.agendaItem.delete({
      where: {
        agendaId_sessionId: {
          agendaId: agenda.id,
          sessionId,
        },
      },
    });
  }

  async updateAgendaItemNotes(userId: string, eventId: string, sessionId: string, notes: string) {
    const agenda = await this.prisma.agenda.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!agenda) {
      throw new NotFoundException('Agenda not found');
    }

    return this.prisma.agendaItem.update({
      where: {
        agendaId_sessionId: {
          agendaId: agenda.id,
          sessionId,
        },
      },
      data: { notes },
    });
  }
}