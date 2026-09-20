import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { status, startDate, endDate, limit = 20, offset = 0 } = query;

    const where: any = {};
    if (status) where.status = status;
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: {
          _count: {
            select: { registrations: true },
          },
        },
        orderBy: { startDate: 'asc' },
        take: Number(limit),
        skip: Number(offset),
      }),
      this.prisma.event.count({ where }),
    ]);

    return { events, total, limit: Number(limit), offset: Number(offset) };
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        registrations: true,
        sessions: true,
        speakers: true,
        sponsors: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async create(data: CreateEventDto) {
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
    return this.prisma.event.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async update(id: string, data: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async getSessions(eventId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.session.findMany({
      where: { eventId },
      include: {
        speakers: {
          include: {
            speaker: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }
}