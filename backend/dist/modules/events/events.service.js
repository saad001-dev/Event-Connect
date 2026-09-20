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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { status, startDate, endDate, limit = 20, offset = 0 } = query;
        const where = {};
        if (status)
            where.status = status;
        if (startDate)
            where.startDate = { gte: new Date(startDate) };
        if (endDate)
            where.endDate = { lte: new Date(endDate) };
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
    async findBySlug(slug) {
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
            throw new common_1.NotFoundException('Event not found');
        }
        return event;
    }
    async create(data) {
        const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
        return this.prisma.event.create({
            data: {
                ...data,
                slug,
            },
        });
    }
    async update(id, data) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return this.prisma.event.update({
            where: { id },
            data,
        });
    }
    async getSessions(eventId) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
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
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map