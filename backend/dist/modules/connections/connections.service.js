"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let ConnectionsService = class ConnectionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConnections(userId, eventId) {
        const where = {
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
    async getPendingRequests(userId) {
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
    async sendConnectionRequest(fromUserId, toUserId, eventId, message) {
        if (fromUserId === toUserId) {
            throw new common_1.ConflictException('Cannot connect with yourself');
        }
        const existing = await this.prisma.connection.findFirst({
            where: {
                OR: [
                    { fromUserId, toUserId, eventId },
                    { fromUserId: toUserId, toUserId: fromUserId, eventId },
                ],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Connection request already exists');
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
    async acceptConnectionRequest(connectionId, userId) {
        const connection = await this.prisma.connection.findFirst({
            where: {
                id: connectionId,
                toUserId: userId,
                status: 'PENDING',
            },
        });
        if (!connection) {
            throw new common_1.NotFoundException('Connection request not found');
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
    async declineConnectionRequest(connectionId, userId) {
        const connection = await this.prisma.connection.findFirst({
            where: {
                id: connectionId,
                toUserId: userId,
                status: 'PENDING',
            },
        });
        if (!connection) {
            throw new common_1.NotFoundException('Connection request not found');
        }
        return this.prisma.connection.update({
            where: { id: connectionId },
            data: { status: 'DECLINED' },
        });
    }
};
exports.ConnectionsService = ConnectionsService;
exports.ConnectionsService = ConnectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConnectionsService);
//# sourceMappingURL=connections.service.js.map