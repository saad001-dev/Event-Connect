import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ConnectionsService {
  constructor(private prisma: PrismaService) {}

  async getConnections(userId: string, eventId?: string) {
    const where: any = {
      OR: [
        { fromUserId: userId },
        { toUserId: userId },
      ],
      status: 'ACCEPTED',
    };

    if (eventId) {
      where.eventId = eventId;
    }

    const connections = await this.prisma.connection.findMany({
      where,
      include: {
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
        toUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
      },
    });

    // Transform to get the connected user
    return connections.map(conn => {
      const isFromUser = conn.fromUserId === userId;
      return {
        id: conn.id,
        userId: isFromUser ? conn.toUserId : conn.fromUserId,
        user: isFromUser ? conn.toUser : conn.fromUser,
        status: conn.status,
        message: conn.message,
        createdAt: conn.createdAt,
        updatedAt: conn.updatedAt,
      };
    });
  }

  async getPendingRequests(userId: string) {
    return this.prisma.connection.findMany({
      where: {
        toUserId: userId,
        status: 'PENDING',
      },
      include: {
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
      },
    });
  }

  async sendConnectionRequest(fromUserId: string, toUserId: string, eventId: string, message?: string) {
    if (fromUserId === toUserId) {
      throw new ConflictException('Cannot connect with yourself');
    }

    // Check if request already exists
    const existing = await this.prisma.connection.findFirst({
      where: {
        OR: [
          { fromUserId, toUserId, eventId },
          { fromUserId: toUserId, toUserId: fromUserId, eventId },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Connection request already exists');
    }

    return this.prisma.connection.create({
      data: {
        fromUserId,
        toUserId,
        eventId,
        message,
        status: 'PENDING',
      },
      include: {
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
        toUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
      },
    });
  }

  async acceptConnectionRequest(connectionId: string, userId: string) {
    const connection = await this.prisma.connection.findFirst({
      where: {
        id: connectionId,
        toUserId: userId,
        status: 'PENDING',
      },
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    return this.prisma.connection.update({
      where: { id: connectionId },
      data: { status: 'ACCEPTED' },
      include: {
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
        toUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
      },
    });
  }

  async declineConnectionRequest(connectionId: string, userId: string) {
    const connection = await this.prisma.connection.findFirst({
      where: {
        id: connectionId,
        toUserId: userId,
        status: 'PENDING',
      },
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    return this.prisma.connection.update({
      where: { id: connectionId },
      data: { status: 'DECLINED' },
    });
  }
}